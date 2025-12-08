import type { FormSection } from "../../../../common/lib/FormSection";

export const createCompanyForm: FormSection[] = [
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
    },

    {
        title: "Admin User Information",
        name: "adminUser",
        sectionName: "Admin User",
        objectKey: "user",

        fields: [
            { type: "text", name: "fullName", label: "Full Name", required: true },
            { type: "text", name: "username", label: "Username", required: true },
            { type: "email", name: "email", label: "Admin Email", required: true },
            { type: "password", name: "password", label: "Password", required: true },
            { type: "text", name: "mobile", label: "Mobile" },
            {
                type: "multi-select-dropdown",
                name: "roles",
                label: "Assign Roles",
                api: "/role",   // GET list of roles
                valueKey: "id",         // backend response field mapping
                labelKey: "role",       // backend response field mapping
                required: true
            }
        ]
    }
];
