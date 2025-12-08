import {buildQueryParams} from "../../../../common/lib/queryBuilder.ts";
import {api} from "../../../../config/axios.config.ts";

export interface CompanyFilter {
    companyName?: string;
    country?: string;
    city?: string;
    isActive?: string;
    isDeleted?: string;
    isLocked?: string;
    subscribedDateFrom?: string;
    subscribedDateTo?: string;
    plan?: string;
}

export async function getCompanies(
    page: number,
    size: number,
    filters: CompanyFilter = {},
) {
    const query = buildQueryParams({
        ...filters,
        page,
        size,
        sort: "companyName,asc",
    });

    const response = await api.get(`/companies?${query}`);
    return response.data; // contains content, totalPages, etc.
}

export async function getCompanyDetails(id: string) {
    const res = await api.get(`/companies/${id}`);
    console.log(res.data);
    return res.data;
}

export async function registerCompany(payload: any) {
    const response = await api.post("/register", payload);
    return response.data;
}