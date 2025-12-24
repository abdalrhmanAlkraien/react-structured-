import styles from "./style/DynamicCreateForm.module.css";
import type {FormField} from "../../lib/FormField.ts";
import type {FormSection} from "../../lib/FormSection.ts";
import {getFieldValue, updateFieldValue} from "../../lib/DynamicForm.ts";
import {useDynamicForm} from "../common/hook/useDynamicForm.ts";
import {useEffect, useState} from "react";
import {CommonField} from "../common/render/CommonField.tsx";
import {SelectField} from "../common/render/SelectField.tsx";
import {TextareaField} from "../common/render/TextareaField.tsx";
import {ApiSelectField} from "../common/render/ApiSelectField.tsx";
import {MultiSelectDropdownField} from "../common/render/MultiSelectDropdownField.tsx";
import {PageableApiSelectionField} from "../common/render/PageableApiSelectinoField.tsx";

/* ======================================================
 * Types
 * ====================================================== */

interface Props {
    sections: FormSection[];
    onSubmit: (data: any) => void;
    loading?: boolean;
    initialData?: Record<string, any>; // optional
}

/* ======================================================
 * Component
 * ====================================================== */

export function DynamicCreateForm({
                                      sections,
                                      onSubmit,
                                      loading = false,
                                      initialData = {},
                                  }: Props) {
    const {
        formData,
        setFormData,
        apiOptions,
        fetchOptions,   // ✅ NOW AVAILABLE
    } = useDynamicForm({ sections, initialData });

    const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});

    // 🔥 ADD THIS useEffect HERE
    useEffect(() => {
        function handleClickOutside() {
            setOpenDropdown({});
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    /* ======================================================
     * Field Renderers
     * ====================================================== */

    const renderField = (section: FormSection, field: FormField) => {
        const value = getFieldValue(formData, section, field);

        switch (field.type) {
            case "text":
            case "email":
            case "password":
            case "number":
            case "date":
                return (
                    <CommonField
                        type={field.type}
                        value={value}
                        required={field.required}
                        onChange={(val) =>
                            updateFieldValue(setFormData, section, field.name, val)
                        }
                    />
                );

            case "textarea":
                return (
                    <TextareaField
                        value={value}
                        required={field.required}
                        onChange={(val) =>
                            updateFieldValue(setFormData, section, field.name, val)
                        }
                    />
                );

            case "select":
                return (
                    <SelectField
                        value={value}
                        required={field.required}
                        options={field.options || []}
                        onChange={(val) =>
                            updateFieldValue(setFormData, section, field.name, val)
                        }
                    />
                );

            case "api-select": {
                const state = apiOptions[field.name];

                return (
                    <ApiSelectField
                        value={value}
                        required={field.required}
                        options={state?.items ?? []}   // ✅ FIX
                        valueKey={field.valueKey!}
                        labelKey={field.labelKey!}
                        fallbackLabel={
                            field.updateShowField
                                ? formData[field.updateShowField]
                                : undefined
                        }
                        onChange={(val) =>
                            updateFieldValue(setFormData, section, field.name, val)
                        }
                    />
                );
            }

            case "page-api-select": {
                const state = apiOptions[field.name];

                return (
                    <PageableApiSelectionField
                        value={value}
                        optionsState={state}
                        valueKey={field.valueKey!}
                        labelKey={field.labelKey!}
                        fallbackLabel={field.updateShowField
                            ? formData[field.updateShowField]
                            : undefined}
                        onChange={(val) => updateFieldValue(setFormData, section, field.name, val)}
                        onSearch={(search) => fetchOptions({
                            field,
                            url: field.api!.replace(
                                "{companyId}",
                                formData.__meta__.companyId
                            ),
                            page: 0,
                            search,
                            append: false,
                        })}
                        onLoadMore={() => {
                            if (!state || !state.hasMore || state.loading) return;

                            fetchOptions({
                                field,
                                url: field.api!.replace(
                                    "{companyId}",
                                    formData.__meta__.companyId
                                ),
                                page: state.page + 1,
                                search: state.search,
                                append: true,
                            });
                        }} placeholder={""}
                    />
                );
            }

            case "multi-select-dropdown":
                return (
                    <MultiSelectDropdownField
                        value={Array.isArray(value) ? value : []}
                        options={apiOptions[field.name] || []}
                        valueKey={field.valueKey!}
                        labelKey={field.labelKey!}
                        isOpen={openDropdown[field.name] || false}
                        onToggle={() =>
                            setOpenDropdown((p) => ({
                                ...p,
                                [field.name]: !p[field.name],
                            }))
                        }
                        onChange={(vals) =>
                            updateFieldValue(setFormData, section, field.name, vals)
                        }
                    />
                );



            default:
                return null;
        }
    };

    /* ======================================================
     * Submit
     * ====================================================== */

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(formData);
    }

    /* ======================================================
     * JSX
     * ====================================================== */

    return (
        <form className={styles.formWrapper} onSubmit={handleSubmit}>
            {sections.map((section) => (
                <div key={section.name} className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        {section.title}
                    </h2>

                    <div className={styles.grid}>
                        {section.fields.map((field) => (
                            <div
                                key={field.name}
                                className={styles.formGroup}
                            >
                                <label className={styles.label}>
                                    {field.label}
                                    {field.required && (
                                        <span className={styles.required}>
                                            {" "}
                                            *
                                        </span>
                                    )}
                                </label>

                                {renderField(section, field)}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className={styles.submitArea}>
                <button
                    className="btn btn-primary btn-md"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Create"}
                </button>
            </div>
        </form>
    );
}