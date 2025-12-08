import type {Column} from "../../../../common/component/table/DataTable.tsx";
import {TableContainer} from "../../../../common/component/table/TableContainer.tsx";
import {useNavigate} from "react-router-dom";
import {ActionButtons} from "../../../../common/component/table/ActionButtons.tsx";
import {useState} from "react";
import {useEffect} from "react";

import {DynamicFilter} from "../../../../common/component/table/DynamicFilter.tsx";
import type {FilterField} from "../../../../common/component/table/type/filter.ts";
import {getCompanies} from "../service/companyService.ts";


interface CompanyRow {
    id: string;
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
}

export function CompanyListComponent() {

    const navigate = useNavigate();
    const [activeFilters, setActiveFilters] = useState({});
    const [reloadFlag, setReloadFlag] = useState(0); // <-- force reload
    
        useEffect(() => {
        setReloadFlag(prev => prev + 1);
    }, [activeFilters]);

    const filterFields: FilterField[] = [
        { type: "text", name: "companyName", label: "Company Name" },
        { type: "select", name: "plan", label: "Plan", options: ["FREE", "PRO", "ENTERPRISE"] },
        { type: "boolean", name: "isActive", label: "Active?" },
        {
            name: "country",
            label: "Country",
            type: "api-select",
            api: "/lookup/countries", // GET
            valueKey: "id",
            labelKey: "name",
        },
        {
            name: "city",
            label: "City",
            type: "api-select",
            api: "/lookup/countries/{countryId}/cities",
            dependsOn: "country",
            valueKey: "id",
            labelKey: "name",
        },
        { type: "date", name: "subscribedDateFrom", label: "Subscribed From" },
        { type: "date", name: "subscribedDateTo", label: "Subscribed To" }
    ];

    const columns: Column<CompanyRow>[] = [
        { header: "Company Name", accessor: "companyName" },
        { header: "Address", accessor: "companyAddress" },
        { header: "Phone", accessor: "companyPhone" },
        { header: "Email", accessor: "companyEmail" },
        {
            header: "Actions",
            accessor: "id",
            render: (row) => (
                <ActionButtons
                    onView={() => navigate(`/platform/company/details/${row.id}`)}
                    onEdit={() => navigate(`/platform/company/update/${row.id}`)}
                    onDelete={() => console.log("delete", row.id)}
                />
            )
        }
    ];

    const fetchCompanies = (page: number, size: number) => {
        return getCompanies(page, size, activeFilters); // pass filters to service
    };

    return (
        <div>
            <h1>Companies</h1>

            <DynamicFilter
             key={reloadFlag}      
             fields={filterFields}
             onChange={setActiveFilters} />

            <TableContainer<CompanyRow>
                columns={columns}
                fetchData={fetchCompanies}
                reloadFlag= {reloadFlag}
            />
        </div>
    );
}
