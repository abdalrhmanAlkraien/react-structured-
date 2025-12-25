import {useCallback, useEffect, useRef, useState} from "react";
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

    // ✅ ADD THIS
    const apiOptionsRef = useRef<Record<string, any>>({});

    // 🔥 keep ref in sync
    useEffect(() => {
        apiOptionsRef.current = apiOptions;
    }, [apiOptions]);

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
                    const existing = apiOptionsRef.current[field.name];

                    console.log(apiOptionsRef.current[field.name]);
                    // 🔥 DO NOT RELOAD IF ALREADY LOADED
                    if (existing?.loaded) return;

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
            const state = apiOptionsRef.current[field.name] ?? {
                items: [],
            };

            // 🔒 Already exists → stop
            if (state.items.some(o => o[field.valueKey!] === value)) {
                return;
            }

            const res = await api.get(url);

            const payload = res.data?.data ?? {};

            const normalized = {
                [field.idKey!]:
                    payload[field.apiByIdIdKey ?? field.idKey!],

                [field.valueKey!]:
                    payload[field.apiByIdValueKey ?? field.valueKey!],

                [field.labelKey!]:
                    payload[field.apiByIdLabelKey ?? field.labelKey!],
            };

            if (
                normalized[field.valueKey!] === undefined ||
                normalized[field.labelKey!] === undefined
            ) {
                console.warn(
                    `[page-api-select] apiById response missing expected keys`,
                    { field, response: res }
                );
            }

            setApiOptions(prev => {
                const existing = prev[field.name]?.items || [];

                // 🔥 MERGE selected option WITH page
                return {
                    ...prev,
                    [field.name]: {
                        ...prev[field.name],
                        items: [normalized, ...existing], // 👈 IMPORTANT
                    },
                };
            });
        },
        []
    );

    return {
        formData,
        setFormData,
        apiOptions,
        fetchOptions,
        ensureSelectedOptionLoaded
    };
}
