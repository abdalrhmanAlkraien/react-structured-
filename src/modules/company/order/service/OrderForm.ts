import type {FormSection} from "../../../../common/lib/FormSection.ts";

export const OrderForm: FormSection[] = [
    {
        title: "Order Information",       // Section visible title
        name: "orderInfo",                // Unique internal section key
        sectionName: "Order Information",

        fields: [
            { type: "text", name: "externalId", label: "Order External id", required: true },
            { type: "date", name: "orderDate", label: "Order Date", required: true },
            { type: "text", name: "description", label: "Product Description", required: true },
            { type: "number", name: "totalAmount", label: "total amount", required: true },
            { type: "text", name: "status", label: "Order Status", required: true },
            { type: "text", name: "transactionId", label: "Transaction Id", required: true },
            {
                type: "api-select",
                name: "customerName", // to display this value as pre-selected in update form
                label: "Assign Customer",
                api: "/companies/{companyId}/customers/lookup",   // GET list of customers
                valueKey: "customerExternalId",         // backend response field mapping for get the externalId
                labelKey: "customerName",       // show the value drop down list
                required: false,
                dependsOn: "__company__", // 🔥 special marker
                // 🔥 UPDATE-ONLY HELPERS
                updateShowField: "customerName",
                pageable: true,
                searchParam: "externalId",
                pageSize: 10,
                apiById: "/companies/{companyId}/customers/{id}"
            }
        ]
    },
    {
        title: "Item Information",
        name: "items",
        sectionName: "Items",
        repeatable: true,        // 🔥
        minItems: 1,
        fields: [
            {
                type: "api-pageable-select",
                name: "productExternalId",
                label: "Product",
                api: "/companies/{companyId}/products/lookup",
                apiById: "/companies/{companyId}/products/{id}",
                valueKey: "externalId",
                labelKey: "name",
                pageable: true,
                searchParam: "externalId",
                pageSize: 10,
                updateShowField: "productName",
                dependsOn: "__company__",
                required: true
            },
            { type: "number", name: "quantity", label: "Quantity", required: true },
            { type: "number", name: "price", label: "Price", required: true }
        ]
    }
]
