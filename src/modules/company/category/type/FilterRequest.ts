export interface FilterRequest {
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