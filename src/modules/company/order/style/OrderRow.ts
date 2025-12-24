/* ================================
 * Shared / Enums
 * ================================ */

export type Status = "ACTIVE" | "INACTIVE" | "BLOCKED";
// adjust based on backend enum

/* ================================
 * Customer
 * ================================ */

export interface CustomerResponseDto {
    id: string;               // UUID -> string
    companyId: string;
    externalId: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: number;
    status: Status;
    createdTime: string;      // LocalDateTime -> ISO string
    updatedTime: string;
}

/* ================================
 * Base Order Info
 * ================================ */

export interface OrderInfoResponse {
    id: string;               // UUID -> string
    externalId: string;
    customer: CustomerResponseDto;
    orderDate: string;        // Instant -> ISO string
    totalAmount: number;
    status: string;
    transactionId: string;
}

/* ================================
 * Extended Order Response
 * ================================ */

export interface OrderRow extends OrderInfoResponse {
    productName: string;
    productExternalId: string;
}