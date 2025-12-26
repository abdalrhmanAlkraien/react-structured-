import type {FormSection} from "../../../../common/lib/FormSection.ts";

export const ProductForm: FormSection[] = [
    {
        title: "Product Information",       // Section visible title
        name: "productInfo",                // Unique internal section key
        sectionName: "Product Information",

        fields: [
            { type: "text", name: "externalId", label: "Product External id", required: true },
            { type: "text", name: "name", label: "Product Name", required: true },
            { type: "text", name: "description", label: "Product Description", required: true },
            { type: "number", name: "price", label: "Product price", required: true },
            { type: "number", name: "stock", label: "Product stock", required: true },
            {
                type: "api-select",
                name: "categoryName", // to display this value as pre-selected in update form
                label: "Assign Category",
                api: "/companies/{companyId}/categories/lookup",   // GET list of categories
                valueKey: "externalId",         // backend response field mapping for get the externalId
                labelKey: "categoryName",       // show the value drop down list
                required: false,
                dependsOn: "__company__", // 🔥 special marker
                // 🔥 UPDATE-ONLY HELPERS
                updateShowField: "categoryName",
                // 🔹 BACKEND PAYLOAD KEY
                submitKey: "categoryExternalId",

            }
        ]
    },
]