import {buildQueryParams} from "../../../../common/lib/queryBuilder.ts";
import {api} from "../../../../config/axios.config.ts";

export interface CustomerFilter {
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    gender?: string;
    minAge?: string;
    maxAge?: string;
    createdDateFrom?: string;
    createdDateTo?: string;
    plan?: string;
}

export async function getCustomers(
    companyId: string,
    page: number,
    size: number,
    filters: CustomerFilter = {}
) {
    const query = buildQueryParams({
        ...filters,
        page,
        size,
        sort: "name,asc",
    });

    const response = await api.get(`/companies/${companyId}/customers?${query}`);
    return response.data; // contains content, totalPages, etc.
}