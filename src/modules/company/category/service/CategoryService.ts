import {buildQueryParams} from "../../../../common/lib/queryBuilder.ts";
import {api} from "../../../../config/axios.config.ts";
import type {FilterRequest} from "../type/FilterRequest.ts";

export async function getCategories(
    companyId: string,
    page: number,
    size: number,
    filters: FilterRequest = {}
) {
    const query = buildQueryParams({
        ...filters,
        page,
        size,
        sort: "name,asc",
    });

    const response = await api.get(`/companies/${companyId}/categories?${query}`);
    return response.data.data; // contains content, totalPages, etc.
}

export async function getCategoryById(
    companyId: string,
    id: string) {
    const res = await api.get(`/companies/${companyId}/categories/${id}`);
    return res.data.data;
}

export async function createCategory(
    companyId:string , payload: any) {
    const response = await api.post(`/companies/${companyId}/categories`, payload);
    return response.data;
}

export async function updateCategory(
    companyId:string,
    customerId:string,
    payload: any) {
    const response = await api.put(`/companies/${companyId}/categories/${customerId}`, payload);
    return response.data;
}
