import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import type {FilterField} from "../../../../common/component/table/type/filter.ts";
import type {Column} from "../../../../common/component/table/DataTable.tsx";
import {ActionButtons} from "../../../../common/component/table/ActionButtons.tsx";
import {getOrders} from "../service/OrderService.ts";
import {DynamicFilter} from "../../../../common/component/table/DynamicFilter.tsx";
import {TableContainer} from "../../../../common/component/table/TableContainer.tsx";
import type {OrderRow} from "../style/OrderRow.ts";
import {StatusBadge} from "../../../../common/component/common/StatusBadge.tsx";

export function OrderListComponent() {

    const navigate = useNavigate();
    const [activeFilters, setActiveFilters] = useState({});
    const [reloadFlag, setReloadFlag] = useState(0); // <-- force reload
    const {user} = useAuth();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReloadFlag(prev => prev + 1);
    }, [activeFilters]);

    const filterFields: FilterField[] = [
        {id: "productName", type: "text", name: "productName", label: "Product Name"},
        {id: "companyName", type: "text", name: "companyName", label: "Company Name"},
        {id: "customerEmail", type: "text", name: "customerEmail", label: "Customer Email"},
        {id: "customerName", type: "text", name: "customerName", label: "Customer Name"},
        {id: "customerId", type: "text", name: "customerId", label: "Customer Id"},
        {id: "productId", type: "text", name: "productId", label: "Product Id"},
        {id: "orderDate", type: "date", name: "orderDate", label: "Order Date"},
        {id: "totalAmount", type: "boolean", name: "totalAmount", label: "Total Amount"},
        {id: "productPrice", type: "boolean", name: "productPrice", label: "Product Price"}
    ];

    const columns: Column<OrderRow>[] = [
        {
            header: "Order ID",
            accessor: "externalId",
        },
        {
            header: "Customer",
            accessor: "customer",
            render: (row) => row.customer?.name ?? "-"
        },
        {
            header: "Total Amount",
            accessor: "totalAmount",
            render: (row) => `$${row.totalAmount.toFixed(2)}`
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => <StatusBadge status={row.status} />
        },
        {
            header: "Transaction ID",
            accessor: "transactionId",
        },
        {
            header: "Actions",
            accessor: "id",
            render: (row) => (
                <ActionButtons
                    onView={() => navigate(`/company/orders/details/${row.id}`)}
                    onEdit={() => navigate(`/company/orders/update/${row.id}`)}
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
        return getOrders(user?.companyId, page, size, activeFilters); // pass filters to service
    };

    return (
        <div>
            <DynamicFilter
                key={reloadFlag}
                fields={filterFields}
                onChange={setActiveFilters}/>

            <TableContainer<OrderRow>
                columns={columns}
                fetchData={fetchProducts}
                reloadFlag={reloadFlag}
            />
        </div>
    );
}