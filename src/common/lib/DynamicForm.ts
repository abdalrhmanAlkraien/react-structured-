import type {FormSection} from "./FormSection.ts";
import React from "react";
import type {FormField} from "./FormField.ts";

/** Get section data (flat or nested) */
export function getSectionData(
    formData: Record<string, any>,
    section: FormSection
) {
    if (section.objectKey) {
        return formData?.[section.objectKey] ?? {};
    }
    return formData ?? {};
}

/** Get field value with defaults */
export function getFieldValue(
    formData: Record<string, any>,
    section: FormSection,
    field: FormField
) {
    const sectionData = getSectionData(formData, section);

    if (sectionData[field.name] !== undefined) {
        return sectionData[field.name];
    }

    if (
        field.type === "multi-select" ||
        field.type === "multi-select-dropdown"
    ) {
        return [];
    }

    return "";
}

/** Update field value (flat or nested) */
export function updateFieldValue(
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
    section: FormSection,
    fieldName: string,
    value: any
) {
    setFormData((prev) => {
        if (section.objectKey) {
            return {
                ...prev,
                [section.objectKey]: {
                    ...(prev[section.objectKey] || {}),
                    [fieldName]: value,
                },
            };
        }

        return {
            ...prev,
            [fieldName]: value,
        };
    });
}