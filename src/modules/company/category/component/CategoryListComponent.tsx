import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import type {FilterField} from "../../../../common/component/table/type/filter.ts";
import type {Column} from "../../../../common/component/table/DataTable.tsx";
import {DynamicFilter} from "../../../../common/component/table/DynamicFilter.tsx";
import {TableContainer} from "../../../../common/component/table/TableContainer.tsx";
import type {CategoryRow} from "../type/CategoryRow.ts";
import {getCategories} from "../service/CategoryService.ts";
import {ActionButtons} from "../../../../common/component/table/ActionButtons.tsx";
import {useNavigate} from "react-router-dom";



export function CategoryListComponent() {

    const navigate = useNavigate();
    const [activeFilters, setActiveFilters] = useState({});
    const [reloadFlag, setReloadFlag] = useState(0); // <-- force reload
    const {user} = useAuth();

    useEffect(() => {
        setReloadFlag(prev => prev + 1);
    }, [activeFilters]);

    const filterFields: FilterField[] = [
        { id: "name", type: "text", name: "name", label: "Category Name" },
        { id: "externalId", type: "text", name: "externalId", label: "External Id" },
        { id: "parentCategoryName", type: "text", name: "parentCategoryName", label: "Parent Category Name" }
    ];

    const columns: Column<CategoryRow>[] = [
        {header: "Category Name", accessor: "name"},
        {header: "Category ExternalId", accessor: "externalId"},
        {header: "Parent Category Name", accessor: "parentCategoryName"},
        {
            header: "Actions",
            accessor: "id",
            render: (row) => (
                <ActionButtons
                    onView={() => navigate(`/company/categories/details/${row.id}`)}
                    onEdit={() => navigate(`/company/categories//update/${row.id}`)}
                    onDelete={() => console.log("delete", row.id)}
                />
            )
        }
    ];

    // Add a check to ensure companyId is available
    if (!user?.companyId) {
        return <div>Error: Company ID not available</div>;
    }

    const fetchCategories = (page: number, size: number) => {
        return getCategories(user?.companyId, page, size, activeFilters); // pass filters to service
    };

    return (
        <div>
            <DynamicFilter
                key={reloadFlag}
                fields={filterFields}
                onChange={setActiveFilters}/>

            <TableContainer<CategoryRow>
                columns={columns}
                fetchData={fetchCategories}
                reloadFlag={reloadFlag}
            />
        </div>
    );
}