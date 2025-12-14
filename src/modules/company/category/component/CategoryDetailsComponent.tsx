import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {NoData} from "../../../../common/component/common/NoData.tsx";
import {GenericDetailsComponent} from "../../../../common/component/details/GenericDetailsComponent.tsx";
import {FiBriefcase} from "react-icons/fi";
import {getCategoryById} from "../service/CategoryService.ts";

export function CategoryDetailsComponent() {

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

        getCategoryById(user.companyId, id)
            .then((res) => {
                if (!isMounted) return;
                setDetails(res);
            })
            .catch(() => {
                if (!isMounted) return;
                setError("Failed to load category");
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
        { label: "Category Name", accessor: "name" },
        { label: "Category External Id", accessor: "externalId" },
        { label: "Parent Category", accessor: "parentCategoryName" },
        { label: "Parent Category Id", accessor: "parentCategoryId" },
        { label: "Created Date", accessor: "createdTime" },
        { label: "Updated Date", accessor: "updateTime" },
    ];


    return (
        <GenericDetailsComponent
            title="Category Details"
            data={details}
            fields={fields}
            icon={<FiBriefcase />}
        />
    );
}