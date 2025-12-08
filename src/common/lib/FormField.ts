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
        | "multi-select"
        | "multi-select-dropdown"
        | "date";

    required?: boolean;

    // For select:
    options?: string[];

    // For api-select:
    api?: string;
    dependsOn?: string;
    valueKey?: string;   // e.g. "id"
    labelKey?: string;   // e.g. "name"

}