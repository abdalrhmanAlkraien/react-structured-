import type {FilterRequest} from "../../category/type/FilterRequest.ts";
import {buildQueryParams} from "../../../../common/lib/queryBuilder.ts";
import {api} from "../../../../config/axios.config.ts";

export async function getOrders(
    companyId: string,
    page: number,
    size: number,
    filters: FilterRequest = {}
) {
    const query = buildQueryParams({
        ...filters,
        page,
        size,
        sort: "customerId,asc",
    });

    const response = await api.get(`/companies/${companyId}/orders?${query}`);
    return response.data.data; // contains content, totalPages, etc.
}

export async function getOrderById(
    companyId: string,
    id: string) {
    const res = await api.get(`/companies/${companyId}/orders/${id}`);
    return res.data.data;
}

export async function createOrder(
    companyId:string , payload: any) {
    const response = await api.post(`/companies/${companyId}/orders`, payload);
    return response.data;
}

export async function updateOrders(
    companyId:string,
    orderId:string,
    payload: any) {
    const response = await api.put(`/companies/${companyId}/orders/${orderId}`, payload);
    return response.data;
}