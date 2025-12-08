import type { FormSection } from "../../../../common/lib/FormSection";

export const updateCompanyForm: FormSection[] = [
    {
        title: "Company Information",       // Section visible title
        name: "companyInfo",                // Unique internal section key
        sectionName: "Company Information",
        objectKey: "company",

        fields: [
            { type: "text", name: "name", label: "Company Name", required: true },
            { type: "text", name: "companyAddress", label: "Address" },
            { type: "text", name: "companyPhone", label: "Phone" },
            { type: "email", name: "email", label: "Email", required: true },
            { type: "text", name: "companyDomain", label: "Domain" },
            {
                type: "select",
                name: "plan",
                label: "Subscription Plan",
                options: ["FREE", "PRO", "ENTERPRISE"]
            }
        ]
    }
];
