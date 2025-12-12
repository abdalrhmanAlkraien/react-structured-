import type {FormSection} from "../../../../common/lib/FormSection.ts";

export const ProductForm: FormSection[] = [
    {
        title: "Customer Information",       // Section visible title
        name: "customerInfo",                // Unique internal section key
        sectionName: "Customer Information",

        fields: [
            { type: "text", name: "externalId", label: "external id", required: true },
            { type: "text", name: "name", label: "Customer Name", required: true },
            { type: "email", name: "email", label: "Customer Email", required: true },
            { type: "text", name: "phone", label: "Customer Phone", required: true },
            {
                type: "select",
                name: "gender",
                label: "Gender",
                options: ["FEMALE", "MALE"]
            }
        ]
    },
]