import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import type {FilterField} from "../../../../common/component/table/type/filter.ts";
import type {Column} from "../../../../common/component/table/DataTable.tsx";
import {ActionButtons} from "../../../../common/component/table/ActionButtons.tsx";
import {DynamicFilter} from "../../../../common/component/table/DynamicFilter.tsx";
import {TableContainer} from "../../../../common/component/table/TableContainer.tsx";
import type {ProductRow} from "../type/ProductRow.ts";
import {getProducts} from "../service/ProductService.ts";

export function ProductListComponent() {

    const navigate = useNavigate();
    const [activeFilters, setActiveFilters] = useState({});
    const [reloadFlag, setReloadFlag] = useState(0); // <-- force reload
    const {user} = useAuth();

    useEffect(() => {
        setReloadFlag(prev => prev + 1);
    }, [activeFilters]);

    const filterFields: FilterField[] = [
        {id: "name", type: "text", name: "name", label: "Product Name"},
        {id: "externalId", type: "text", name: "externalId", label: "External Id"},
        {id: "categoryName", type: "text", name: "categoryName", label: "Category Name"},
        {id: "status", type: "boolean", name: "status", label: "Product Status"}
    ];

    const columns: Column<ProductRow>[] = [
        {header: "Product Name", accessor: "name"},
        {header: "Product ExternalId", accessor: "externalId"},
        {header: "Category Name", accessor: "categoryName"},
        {
            header: "Actions",
            accessor: "id",
            render: (row) => (
                <ActionButtons
                    onView={() => navigate(`/company/products/details/${row.id}`)}
                    onEdit={() => navigate(`/company/products//update/${row.id}`)}
                    onDelete={() => console.log("delete", row.id)}
                />
            )
        }
    ];

    // Add a check to ensure companyId is available
    if (!user?.companyId) {
        return <div>Error: Company ID not available</div>;
    }

    const fetchProducts = (page: number, size: number) => {
        return getProducts(user?.companyId, page, size, activeFilters); // pass filters to service
    };

    return (
        <div>
            <DynamicFilter
                key={reloadFlag}
                fields={filterFields}
                onChange={setActiveFilters}/>

            <TableContainer<ProductRow>
                columns={columns}
                fetchData={fetchProducts}
                reloadFlag={reloadFlag}
            />
        </div>
    );
}