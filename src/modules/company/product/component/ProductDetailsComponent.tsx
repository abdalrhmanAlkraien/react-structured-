import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {NoData} from "../../../../common/component/common/NoData.tsx";
import {GenericDetailsComponent} from "../../../../common/component/details/GenericDetailsComponent.tsx";
import {FiBriefcase} from "react-icons/fi";
import {getProductsById} from "../service/ProductService.ts";

export function ProductCreateComponent() {

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

        getProductsById(user.companyId, id)
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

    const fields = [
        { label: "Product Name", accessor: "name" },
        { label: "Product description", accessor: "description" },
        { label: "Product External Id", accessor: "externalId" },
        { label: "Product Category", accessor: "categoryName" },
        { label: "Product Category Id", accessor: "categoryId" },
        { label: "Product Stock", accessor: "stock" },
        { label: "Product Price", accessor: "price" },
        { label: "Product status", accessor: "status" },
        { label: "Created Date", accessor: "createdTime" },
        { label: "Updated Date", accessor: "updateTime" },
    ];


    return (
        <GenericDetailsComponent
            title="Product Details"
            data={details}
            fields={fields}
            icon={<FiBriefcase />}
        />
    );
}