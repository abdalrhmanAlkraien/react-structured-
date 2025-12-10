import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import type {FilterField} from "../../../../common/component/table/type/filter.ts";
import type {Column} from "../../../../common/component/table/DataTable.tsx";
import {ActionButtons} from "../../../../common/component/table/ActionButtons.tsx";
import {getCustomers} from "../service/CustomerService.ts";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {DynamicFilter} from "../../../../common/component/table/DynamicFilter.tsx";
import {TableContainer} from "../../../../common/component/table/TableContainer.tsx";

interface CustomerRow {
    id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
}

export function CustomerListComponent() {

    const navigate = useNavigate();
    const [activeFilters, setActiveFilters] = useState({});
    const [reloadFlag, setReloadFlag] = useState(0); // <-- force reload
    const {user} = useAuth();

    useEffect(() => {
        setReloadFlag(prev => prev + 1);
    }, [activeFilters]);

    const filterFields: FilterField[] = [
        { type: "text", name: "name", label: "Customer Name" },
        { type: "text", name: "email", label: "Customer Email" },
        { type: "text", name: "phone", label: "Customer phone" },
        { type: "text", name: "gender", label: "Customer gender" },

        { type: "select", name: "gender", label: "Gender", options: ["FEMALE", "MALE"] },
        { type: "boolean", name: "isActive", label: "Active?" },

        { type: "date", name: "createDateFrom", label: "Create From" },
        { type: "date", name: "createDateTo", label: "Create To" }
    ];

    const columns: Column<CustomerRow>[] = [
        { header: "Customer Name", accessor: "name" },
        { header: "Customer Email", accessor: "email" },
        { header: "Customer Phone", accessor: "phone" },
        { header: "Customer Gender", accessor: "gender" },
        {
            header: "Actions",
            accessor: "id",
            render: (row) => (
                <ActionButtons
                    onView={() => navigate(`/company/customers/details/${row.id}`)}
                    onEdit={() => navigate(`/company/customers//update/${row.id}`)}
                    onDelete={() => console.log("delete", row.id)}
                />
            )
        }
    ];

    // Add a check to ensure companyId is available
    if (!user?.companyId) {
        return <div>Error: Company ID not available</div>;
    }

    const fetchCustomers = (page: number, size: number) => {
        return getCustomers(user?.companyId, page, size, activeFilters); // pass filters to service
    };

    return (
        <div>
            <DynamicFilter
                key={reloadFlag}
                fields={filterFields}
                onChange={setActiveFilters} />

            <TableContainer<CustomerRow>
                columns={columns}
                fetchData={fetchCustomers}
                reloadFlag= {reloadFlag}
            />
        </div>
    );
}