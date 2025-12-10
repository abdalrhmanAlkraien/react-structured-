import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {NoData} from "../../../../common/component/common/NoData.tsx";
import {GenericDetailsComponent} from "../../../../common/component/details/GenericDetailsComponent.tsx";
import {FiBriefcase} from "react-icons/fi";
import {getCustomerById} from "../service/CustomerService.ts";
import {useAuth} from "../../../../context/auth/useAuth.ts";

export function CustomerDetailsComponent() {

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

        getCustomerById(user.companyId, id)
            .then((res) => {
                if (!isMounted) return;
                setDetails(res);
            })
            .catch(() => {
                if (!isMounted) return;
                setError("Failed to load customer");
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

    if (error) return <NoData message="Customer details not available" />;

    const fields = [
        { label: "Customer Name", accessor: "name" },
        { label: "Customer Email", accessor: "email" },
        { label: "Customer Phone", accessor: "phone" },
        { label: "Customer Gender", accessor: "gender" },
        { label: "Customer Age", accessor: "age" },
        { label: "Customer Status", accessor: "status" },
        { label: "Customer Created Date", accessor: "createdTime" },
        { label: "Customer Updated Date", accessor: "updatedTime" },
    ];


    return (
        <GenericDetailsComponent
            title="Customer Details"
            data={details}
            fields={fields}
            icon={<FiBriefcase />}
        />
    );

}