export interface FormField {
    name: string;
    label: string;
    type:
        | "text"
        | "email"
        | "password"
        | "textarea"
        | "number"
        | "select"
        | "api-select"
        | "page-api-select"
        | "multi-select"
        | "multi-select-dropdown"
        | "date"
        | "datetime-local";

    required?: boolean;

    // For select:
    options?: string[];

    // For api-select:
    api?: string;
    dependsOn?: string;
    valueKey?: string;   // e.g. "id"
    labelKey?: string;   // e.g. "name"
    updateShowField: string;

    // 🔥 NEW for pageable (optional)
    pageable?: boolean;
    searchParam?: string; // e.g. "externalId" or "name"
    pageSize?: number;

    // (for update forms with pageable)
    apiById?: string;
    idKey?: string; // eg: customerId

    // ✅ NEW (apiById specific)
    apiByIdIdKey?: string;
    apiByIdValueKey?: string;
    apiByIdLabelKey?: string;

    // for mapping with new key for submit
    submitKey?: string;
}