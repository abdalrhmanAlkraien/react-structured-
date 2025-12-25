import type {FormField} from "./FormField.ts";

export interface FormSection {
    title: string;
    name: string; // "company" or "user"
    fields: FormField[];
    sectionName: string;
    objectKey?: string;

    // for child sections
    repeatable?: boolean;     // 🔥 allows add/remove
    minItems?: number;
    maxItems?: number;
}
