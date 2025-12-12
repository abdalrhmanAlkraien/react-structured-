import {buildQueryParams} from "../../../../common/lib/queryBuilder.ts";
import {api} from "../../../../config/axios.config.ts";
import type {FileType} from "../../../../common/component/upload/type/FileType.ts";

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
    return response.data.data; // contains content, totalPages, etc.
}

export async function getCustomerById(
    companyId: string,
    id: string) {
    const res = await api.get(`/companies/${companyId}/customers/${id}`);
    console.log(res.data);
    return res.data;
}

export async function createCustomer(
    companyId:string , payload: any) {
    const response = await api.post(`/companies/${companyId}/customers`, payload);
    return response.data;
}

export async function updateCustomer(
    companyId:string,
    customerId:string,
    payload: any) {
    const response = await api.put(`/companies/${companyId}/customers/${customerId}`, payload);
    return response.data;
}


export async function uploadCustomerFile(
    file: File,
    bucket: string
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    const response = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data; // S3 URL
}


export async function validateCustomerImport(
    companyId:string,
    payload: any) {
    const response = await api.post(`/companies/${companyId}/customers/import/validate`, {
        payload,
    });
    return response.data;
}

export async function importCustomers(
    companyId: string,
    payload: { fileUrl: string; fileType: FileType }
) {
    let endpoint: string;

    switch (payload.fileType) {
        case "CSV":
            endpoint = `/companies/${companyId}/customers/import/csv`;
            break;
        case "JSON":
            endpoint = `/companies/${companyId}/customers/import/json`;
            break;
        case "SQL":
            endpoint = `/companies/${companyId}/customers/import/sql`;
            break;
        default:
            throw new Error(`Unsupported file type: ${payload.fileType}`);
    }

    const response = await api.post(endpoint, payload);
    return response.data;
}

function getFileExtensionFromUrl(fileUrl: string): string {
    // Remove query params if exist
    const cleanUrl = fileUrl.split("?")[0];

    // Get file name
    const fileName = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);

    // Extract extension
    return fileName.split(".").pop()?.toLowerCase() || "";
}