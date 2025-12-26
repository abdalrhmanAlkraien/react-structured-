import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {NoData} from "../../../../common/component/common/NoData.tsx";
import {GenericDetailsComponent} from "../../../../common/component/details/GenericDetailsComponent.tsx";
import {FiBriefcase} from "react-icons/fi";
import {getOrderById} from "../service/OrderService.ts";

export function OrderDetailsComponent (){

    const { id } = useParams();
    // @ts-ignore
    const [details, setDetails] = useState<never>(null);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || !user?.companyId) return;

        let isMounted = true; // ✅ prevent state update loops
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        setError(null);

        getOrderById(user.companyId, id)
            .then((res) => {
                if (!isMounted) return;
                setDetails(res);
            })
            .catch(() => {
                if (!isMounted) return;
                setError("Failed to load product");
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });

        return () => {
            isMounted = false; // ✅ cleanup
        };
    }, [id, user?.companyId]);

    if (loading) return <p>Loading...</p>;

    if (error) return <NoData message="Product details not available" />;

    const sections = [
        {
            title: "Order Info",
            fields: [
                { label: "Order External ID", accessor: "externalId" },
                { label: "Order Date", accessor: "orderDate" },
                { label: "Total Amount", accessor: "totalAmount" },
                { label: "Status", accessor: "status" },
                { label: "Transaction ID", accessor: "transactionId" },
            ]
        },
        {
            title: "Customer Details",
            accessor: "customer",
            fields: [
                { label: "Name", accessor: "name" },
                { label: "External ID", accessor: "externalId" },
                { label: "Email", accessor: "email" },
                { label: "Phone", accessor: "phone" },
                { label: "Status", accessor: "status" },
            ]
        },
        {
            title: "Order Items",
            accessor: "items",
            repeatable: true,
            columns: [
                { label: "Product", accessor: "product.name" },
                { label: "External ID", accessor: "product.externalId" },
                { label: "Quantity", accessor: "quantity" },
                { label: "Price", accessor: "price" },
            ]
        }
    ];


    return (
        <GenericDetailsComponent
            title="Order Details"
            data={details}
            sections={sections}
            icon={<FiBriefcase />}
        />
    );
}
