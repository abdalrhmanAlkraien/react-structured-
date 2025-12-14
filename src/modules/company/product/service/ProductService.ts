import type {FilterRequest} from "../../category/type/FilterRequest.ts";
import {buildQueryParams} from "../../../../common/lib/queryBuilder.ts";
import {api} from "../../../../config/axios.config.ts";

export async function getProducts(
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

    const response = await api.get(`/companies/${companyId}/products?${query}`);
    return response.data.data; // contains content, totalPages, etc.
}

export async function getProductsById(
    companyId: string,
    id: string) {
    const res = await api.get(`/companies/${companyId}/products/${id}`);
    return res.data.data;
}

export async function createProduct(
    companyId:string , payload: any) {
    const response = await api.post(`/companies/${companyId}/products`, payload);
    return response.data;
}

export async function updateProduct(
    companyId:string,
    productId:string,
    payload: any) {
    const response = await api.put(`/companies/${companyId}/products/${productId}`, payload);
    return response.data;
}