import { useCallback, useEffect, useState } from "react";
import type {FormField} from "../../../lib/FormField.ts";
import type {FormSection} from "../../../lib/FormSection.ts";
import {getSectionData} from "../../../lib/DynamicForm.ts";
import {api} from "../../../../config/axios.config.ts";


/* ======================================================
 * Hook
 * ====================================================== */

interface UseDynamicFormProps {
    sections: FormSection[];
    initialData?: Record<string, any>;
}

export function useDynamicForm({
                                   sections,
                                   initialData = {},
                               }: UseDynamicFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>(initialData);
    const [apiOptions, setApiOptions] = useState<Record<string, any[]>>({});

    /* -----------------------------
     * Normalize API response
     * ----------------------------- */
    const normalizeApiResponse = (res: any): any[] => {
        if (Array.isArray(res?.data?.data)) return res.data.data;
        if (Array.isArray(res?.data)) return res.data;
        return [];
    };

    /* -----------------------------
     * Load API options helper
     * ----------------------------- */
    const fetchOptions = useCallback(
        async (field: FormField, url: string) => {
            const res = await api.get(url);
            const list = normalizeApiResponse(res);

            setApiOptions((prev) => ({
                ...prev,
                [field.name]: list,
            }));
        },
        []
    );

    /* =====================================================
     * 1️⃣ Load LOOKUP api-select (no dependsOn)
     * ===================================================== */
    useEffect(() => {
        sections.forEach((section) => {
            section.fields.forEach((field) => {
                if (
                    (field.type === "api-select" || field.type === "multi-select-dropdown") &&
                    field.api &&
                    !field.dependsOn
                ) {
                    fetchOptions(field, field.api);
                }
            });
        });
    }, [sections, fetchOptions]);

    /* =====================================================
     * 2️⃣ Load COMPANY-based api-select
     * ===================================================== */
    useEffect(() => {
        const companyId = formData.__meta__?.companyId;
        if (!companyId) return;

        sections.forEach((section) => {
            section.fields.forEach((field) => {
                if (
                    field.type === "api-select" &&
                    field.dependsOn === "__company__" &&
                    field.api
                ) {
                    const url = field.api.replace("{companyId}", companyId);
                    fetchOptions(field, url);
                }
            });
        });
    }, [sections, formData.__meta__?.companyId, fetchOptions]);

    /* =====================================================
     * 3️⃣ Load FIELD-dependent api-select
     * ===================================================== */
    useEffect(() => {
        sections.forEach((section) => {
            const sectionData = getSectionData(formData, section);

            section.fields.forEach((field) => {
                if (
                    field.type === "api-select" &&
                    field.dependsOn &&
                    field.dependsOn !== "__company__" &&
                    field.api
                ) {
                    const parentValue = sectionData[field.dependsOn];
                    if (!parentValue) return;

                    const url = field.api.replace(
                        `{${field.dependsOn}}`,
                        parentValue
                    );

                    fetchOptions(field, url);
                }
            });
        });
    }, [sections, formData, fetchOptions]);

    return {
        formData,
        setFormData,
        apiOptions,
    };
}
