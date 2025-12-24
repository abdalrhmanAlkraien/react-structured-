import React, {useEffect, useState} from "react";
import styles from "../create/style/DynamicCreateForm.module.css"; // reuse same styles
import type {FormSection} from "../../lib/FormSection";
import type {FormField} from "../../lib/FormField.ts";
import {getFieldValue, getSectionData, updateFieldValue} from "../../lib/DynamicForm.ts";
import {useDynamicForm} from "../common/hook/useDynamicForm.ts";
import {CommonField} from "../common/render/CommonField.tsx";
import {SelectField} from "../common/render/SelectField.tsx";
import {ApiSelectField} from "../common/render/ApiSelectField.tsx";
import {MultiSelectDropdownField} from "../common/render/MultiSelectDropdownField.tsx";
import {TextareaField} from "../common/render/TextareaField.tsx";
import {PageableApiSelectionField} from "../common/render/PageableApiSelectinoField.tsx";


interface Props {
    sections: FormSection[];
    initialValues: Record<string, any> | null;
    onSubmit: (data: any) => void;
    loading?: boolean;
}

export function DynamicUpdateForm({
                                      sections,
                                      initialValues,
                                      onSubmit,
                                      loading = false,
                                  }: Props) {
    const {formData, setFormData, apiOptions, fetchOptions, ensureSelectedOptionLoaded} = useDynamicForm({
        sections,
        initialData: initialValues || {},
    });
    const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});


    // ------------------------------
    // Sync initial values (UPDATE)
    // ------------------------------
    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
        }
    }, [initialValues, setFormData]);


    // 🔥 ADD THIS useEffect HERE
    useEffect(() => {
        function handleClickOutside() {
            setOpenDropdown({});
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);


    useEffect(() => {
        sections.forEach(section => {
            section.fields.forEach(field => {
                if (field.type !== "page-api-select") return;

                const value = getSectionData(formData, section)[field.name];
                if (!value) return;

                let url = field.apiById!;
                const companyId = formData.__meta__?.companyId;

                if (companyId) {
                    url = url.replace("{companyId}", companyId);
                }

                url = url.replace("{id}", value);

                ensureSelectedOptionLoaded(field, url, value);
            });
        });
    }, [sections, formData, ensureSelectedOptionLoaded]);

    // ------------------------------
    // Render Field
    // ------------------------------
    function renderField(section: FormSection, field: FormField) {
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
                    />);

            case "api-select": {
                const state = apiOptions[field.name];
                const options = state?.items ?? [];
                const value = getFieldValue(formData, section, field);

                const hasOption = options.some(
                    (opt) => opt[field.valueKey!] === value
                );

                const showLabel =
                    field.updateShowField && formData[field.updateShowField];

                const dependencyMissing =
                    field.dependsOn &&
                    field.dependsOn !== "__company__" &&
                    !getSectionData(formData, section)[field.dependsOn];

                return (
                    <ApiSelectField
                        value={value}
                        required={field.required}
                        options={options}          // ✅ always array
                        valueKey={field.valueKey!}
                        labelKey={field.labelKey!}
                        fallbackLabel={showLabel}
                        disabled={dependencyMissing}
                        onChange={(val) =>
                            updateFieldValue(setFormData, section, field.name, val)
                        }
                    />
                );
            }

            case "page-api-select": {
                const state = apiOptions[field.name];
                const value = getFieldValue(formData, section, field);

                return (
                    <PageableApiSelectionField
                        value={value}
                        optionsState={state}
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
                        onSearch={(search) =>
                            fetchOptions({
                                field,
                                url: field.api!.replace(
                                    "{companyId}",
                                    formData.__meta__.companyId
                                ),
                                page: 0,
                                search,
                                append: false,
                            })
                        }
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
                        }}
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
    }

    // ------------------------------
    // Submit
    // ------------------------------
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(formData);
    }

    return (
        <form className={styles.formWrapper} onSubmit={handleSubmit}>
            {sections.map((section) => (
                <div key={section.name} className={styles.card}>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>

                    <div className={styles.grid}>
                        {section.fields.map((field) => (
                            <div key={field.name} className={styles.formGroup}>
                                <label className={styles.label}>{field.label}</label>
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
                    {loading ? "Submitting..." : "Update"}
                </button>
            </div>
        </form>
    );
}