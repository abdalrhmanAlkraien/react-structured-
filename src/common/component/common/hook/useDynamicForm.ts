import { useCallback, useEffect, useState } from "react";
import type {FormField} from "../../../lib/FormField.ts";
import type {FormSection} from "../../../lib/FormSection.ts";
import {getSectionData} from "../../../lib/DynamicForm.ts";
import {api} from "../../../../config/axios.config.ts";
import type {ApiSelectState} from "../../../lib/ApiSelectState.ts";


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
    const [apiOptions, setApiOptions] = useState<Record<string, ApiSelectState>>({});

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
        async ({
                   field,
                   url,
                   page = 0,
                   search,
                   append = false,
               }: {
            field: FormField;
            url: string;
            page?: number;
            search?: string;
            append?: boolean;
        }) => {

            const isPageable = field.pageable === true;
            const size = field.pageSize ?? 10;

            const params: any = {};

            // ✅ Only add paging params if pageable
            if (isPageable) {
                params.page = page;
                params.size = size;
            }

            // ✅ Search works for both (if backend supports it)
            if (search && field.searchParam) {
                params[field.searchParam] = search;
            }

            setApiOptions(prev => ({
                ...prev,
                [field.name]: {
                    ...(prev[field.name] ?? {
                        items: [],
                        page: 0,
                        hasMore: true,
                    }),
                    loading: true,
                },
            }));

            const res = await api.get(url, { params });
            const data = res.data.data;

            // 🔥 DIFFERENT RESPONSE SHAPES
            let items: any[] = [];
            let hasMore = false;

            if (isPageable) {
                // Page<T>
                items = data.content ?? [];
                hasMore = !data.last;
            } else {
                // Array<T>
                items = Array.isArray(data) ? data : [];
                hasMore = false;
            }

            // 🔥 Clean invalid rows (VERY important)
            items = items.filter(
                (i) => i && i[field.valueKey ?? "id"] && i[field.labelKey ?? "name"]
            );

            setApiOptions(prev => {
                const prevState = prev[field.name];

                return {
                    ...prev,
                    [field.name]: {
                        items: isPageable && append
                            ? [...(prevState?.items ?? []), ...items]
                            : items,
                        page: isPageable ? page : 0,
                        hasMore,
                        loading: false,
                        search,
                        loaded: true,
                    },
                };
            });
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

        sections.forEach(section => {
            section.fields.forEach(field => {
                if (
                    (field.type === "api-select" ||
                        field.type === "page-api-select") &&   // ✅ BOTH
                    field.dependsOn === "__company__" &&
                    field.api
                ) {
                    const url = field.api.replace("{companyId}", companyId);

                    fetchOptions({
                        field,
                        url,
                        page: 0,
                        append: false,
                    });
                }
            });
        });
    }, [sections, formData.__meta__?.companyId, fetchOptions]);

    /* =====================================================
     * 3️⃣ Load FIELD-dependent api-select
     * ===================================================== */
    useEffect(() => {
        sections.forEach(section => {
            const sectionData = getSectionData(formData, section);

            section.fields.forEach(field => {
                if (
                    (field.type === "api-select" ||
                        field.type === "page-api-select") &&  // ✅ BOTH
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

                    fetchOptions({
                        field,
                        url,
                        page: 0,
                        append: false,
                    });
                }
            });
        });
    }, [sections, formData, fetchOptions]);

    const ensureSelectedOptionLoaded = useCallback(
        async (field: FormField, url: string, value: any) => {
            if (!value || !field.apiById) return;

            const state = apiOptions[field.name];
            const exists = state?.items?.some(
                (i) => i[field.valueKey!] === value
            );

            if (exists) return;

            try {
                const res = await api.get(url);
                const item = res.data.data;

                if (!item) return;

                setApiOptions(prev => ({
                    ...prev,
                    [field.name]: {
                        ...prev[field.name],
                        items: [item, ...(prev[field.name]?.items ?? [])],
                    },
                }));
            } catch (e) {
                console.warn("Failed to load selected option", e);
            }
        },
        [apiOptions]
    );

    return {
        formData,
        setFormData,
        apiOptions,
        fetchOptions,
        ensureSelectedOptionLoaded
    };
}
