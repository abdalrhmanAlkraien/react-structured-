import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getCompanyDetails} from "../service/companyService.ts";
import {GenericDetailsComponent} from "../../../../common/component/details/GenericDetailsComponent.tsx";
import {NoData} from "../../../../common/component/common/NoData.tsx";
import { FiBriefcase } from "react-icons/fi";

export function CompanyDetailsComponent() {

    const { id } = useParams();
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        getCompanyDetails(id).then((res) => {
            setDetails(res);
            setLoading(false);
        });
    }, [id]);


    if (loading) return <p>Loading...</p>;
    if (!details) return <NoData message="Company details not available" />;


    const fields = [
        { label: "Company Name", accessor: "companyName" },
        { label: "Address", accessor: "companyAddress" },
        { label: "Phone", accessor: "companyPhone" },
        { label: "Email", accessor: "companyEmail" },
        { label: "Domain", accessor: "companyDomain" },
        { label: "Logo URL", accessor: "companyLogoUrl" },

        { label: "Active", accessor: "active" },
        { label: "Locked", accessor: "locked" },
        { label: "Deleted", accessor: "deleted" },

        { label: "Subscribed", accessor: "subscribed" },
        { label: "Subscribed Date", accessor: "subscribedDate" },
        { label: "Unsubscribed Date", accessor: "unsubscribedDate" },
    ];

    return (
        <GenericDetailsComponent
            title="Company Details"
            data={details}
            fields={fields}
            icon={<FiBriefcase />}
        />
    );
}