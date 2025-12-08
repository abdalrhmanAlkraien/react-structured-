import type {FormField} from "./FormField.ts";

export interface FormSection {
    title: string;
    name: string; // "company" or "user"
    fields: FormField[];
    sectionName: string;
    objectKey: string;
}
