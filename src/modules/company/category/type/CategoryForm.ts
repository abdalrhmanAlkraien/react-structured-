import type {FormSection} from "../../../../common/lib/FormSection.ts";

export const CategoryForm: FormSection[] = [
    {
        title: "Category Information",       // Section visible title
        name: "categoryInfo",                // Unique internal section key
        sectionName: "Category Information",

        fields: [
            { type: "text", name: "externalId", label: "Category External id", required: true },
            { type: "text", name: "name", label: "Category Name", required: true },
            {
                type: "api-select",
                name: "parentCategoryExternalId",
                label: "Assign Parent Category",
                api: "/companies/{companyId}/categories/lookup",   // GET list of categories
                valueKey: "externalId",         // backend response field mapping
                labelKey: "name",       // backend response field mapping
                required: false,
                dependsOn: "__company__", // 🔥 special marker
                // 🔥 UPDATE-ONLY HELPERS
                updateShowField: "parentCategoryName"
            }
        ]
    },
]