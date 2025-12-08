import React, { useEffect, useState } from "react";
import styles from "./style/DynamicCreateForm.module.css";
import {api} from "../../../config/axios.config.ts";
import type {FormField} from "../../lib/FormField.ts";
import type {FormSection} from "../../lib/FormSection.ts";

interface Props {
    sections: FormSection[];
    onSubmit: (data: any) => void;
    loading?: boolean;
}

export function DynamicCreateForm({
                                      sections,
                                      onSubmit,
                                      loading = false,
                                  }: Props) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [apiOptions, setApiOptions] = useState<Record<string, any[]>>({});
    const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});

    // ------------------------------
    // Load API data for api-select fields (no dependency)
    // ------------------------------
    useEffect(() => {
        sections.forEach((section) => {
            section.fields.forEach(async (field) => {
                if ((field.type === "api-select" || field.type === "multi-select")
                    && !field.dependsOn
                    && field.api)
                {
                    const res = await api.get(field.api);

                    // FIX: store array only
                    const list = Array.isArray(res.data?.data) ? res.data.data : [];

                    setApiOptions(prev => ({
                        ...prev,
                        [field.name]: list
                    }));
                } else if (field.type === "multi-select-dropdown" && field.api) {
                    const res = await api.get(field.api);

                    // If API returns { success, data }, extract correctly:
                    const list = Array.isArray(res.data.data)
                        ? res.data.data
                        : Array.isArray(res.data)
                            ? res.data
                            : [];

                    setApiOptions(prev => ({
                        ...prev,
                        [field.name]: list
                    }));
                }
            });
        });
    }, [sections]);

    // ------------------------------
    // Load dependent api-select (if dependsOn is set)
    // Example: city depends on country
    // ------------------------------
    useEffect(() => {
        sections.forEach((section) => {
            section.fields.forEach(async (field) => {
                if (
                    field.type === "api-select" &&
                    field.dependsOn &&
                    field.api
                ) {
                    const parentSectionKey = section.objectKey;
                    const parentValue =
                        formData[parentSectionKey]?.[field.dependsOn];

                    if (parentValue) {
                        const url = field.api.replace("{countryId}", parentValue);
                        const res = await api.get(url);
                        setApiOptions((prev) => ({
                            ...prev,
                            [field.name]: res.data,
                        }));
                    }
                }
            });
        });
    }, [formData, sections]);

    // ------------------------------
    // Update field helper
    // ------------------------------
    function updateField(
        sectionKey: string,
        fieldName: string,
        value: any
    ) {
        setFormData((prev) => ({
            ...prev,
            [sectionKey]: {
                ...(prev[sectionKey] || {}),
                [fieldName]: value,
            },
        }));
    }

    // ------------------------------
    // Render a single field
    // ------------------------------
    function renderField(sectionKey: string, field: FormField) {
        const sectionValues = formData[sectionKey] || {};
        const value = sectionValues[field.name] ?? (field.type === "multi-select" ? [] : "");

        switch (field.type) {
            case "text":
            case "email":
            case "password":
            case "number":
            case "date":
                return (
                    <input
                        type={field.type === "textarea" ? "text" : field.type}
                        className={styles.input}
                        required={field.required}
                        value={value}
                        onChange={(e) =>
                            updateField(sectionKey, field.name, e.target.value)
                        }
                    />
                );

            case "textarea":
                return (
                    <textarea
                        className={styles.textarea}
                        required={field.required}
                        value={value}
                        onChange={(e) =>
                            updateField(sectionKey, field.name, e.target.value)
                        }
                    />
                );

            case "select":
                return (
                    <select
                        className={styles.select}
                        required={field.required}
                        value={value}
                        onChange={(e) =>
                            updateField(sectionKey, field.name, e.target.value)
                        }
                    >
                        <option value="">Select</option>
                        {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );

            case "api-select":
                return (
                    <select
                        className={styles.select}
                        required={field.required}
                        value={value}
                        disabled={field.dependsOn && !sectionValues[field.dependsOn]}
                        onChange={(e) =>
                            updateField(sectionKey, field.name, e.target.value)
                        }
                    >
                        <option value="">Select</option>
                        {(apiOptions[field.name] || []).map((opt) => (
                            <option
                                key={opt[field.valueKey!]}
                                value={opt[field.valueKey!]}
                            >
                                {opt[field.labelKey!]}
                            </option>
                        ))}
                    </select>
                );

            case "multi-select-dropdown": {
                const sectionData = formData[sectionKey] || {};
                const selectedValues = Array.isArray(sectionData[field.name])
                    ? sectionData[field.name]
                    : [];

                const list = Array.isArray(apiOptions[field.name])
                    ? apiOptions[field.name]
                    : [];

                return (
                    <div className={styles.dropdownContainer}>
                        <div
                            className={styles.dropdownHeader}
                            onClick={() =>
                                setOpenDropdown(prev => ({
                                    ...prev,
                                    [field.name]: !prev[field.name]
                                }))
                            }
                        >
                            {selectedValues.length === 0
                                ? "Select roles..."
                                : `${selectedValues.length} selected`}
                        </div>

                        {openDropdown[field.name] && (
                            <div className={styles.dropdownMenu}>
                                {list.map(opt => {
                                    const optionValue =
                                        opt[field.valueKey!] || opt.id;

                                    const optionLabel =
                                        opt[field.labelKey!] || opt.role;

                                    const isChecked = selectedValues.includes(optionValue);

                                    return (
                                        <div
                                            key={optionValue}
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                let updatedValues = [...selectedValues];

                                                if (isChecked) {
                                                    updatedValues = updatedValues.filter(v => v !== optionValue);
                                                } else {
                                                    updatedValues.push(optionValue);
                                                }

                                                // 🔥 FIX: field.name must be passed
                                                updateField(sectionKey, field.name, updatedValues);
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                readOnly
                                            />
                                            <span>{optionLabel}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            }


            case "multi-select": {
                const sectionData = formData[sectionKey] || {};
                const selectedValues = Array.isArray(sectionData[field.name])
                    ? sectionData[field.name]
                    : [];

                const list = Array.isArray(apiOptions[field.name])
                    ? apiOptions[field.name]
                    : [];

                return (
                    <div className={styles.multiCheckWrapper}>
                        {list.map(opt => {
                            const optionValue = opt[field.valueKey!] || opt.id;
                            const optionLabel = opt[field.labelKey!] || opt.role;

                            return (
                                <label key={optionValue} className={styles.multiCheckItem}>
                                    <input
                                        type="checkbox"
                                        checked={selectedValues.includes(optionValue)}
                                        onChange={(e) => {
                                            let updated = [...selectedValues];

                                            if (e.target.checked) {
                                                updated.push(optionValue);
                                            } else {
                                                updated = updated.filter(v => v !== optionValue);
                                            }

                                            updateField(sectionKey, field.name, updated); // ✅ FIXED
                                        }}
                                    />
                                    <span>{optionLabel}</span>
                                </label>
                            );
                        })}
                    </div>
                );
            }


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

    // ------------------------------
    // JSX
    // ------------------------------
    return (
        <form className={styles.formWrapper} onSubmit={handleSubmit}>
            {sections.map((section) => (
                <div key={section.name} className={styles.card}>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>

                    <div className={styles.grid}>
                        {section.fields.map((field) => (
                            <div className={styles.formGroup} key={field.name}>
                                <label className={styles.label}>
                                    {field.label}
                                    {field.required && (
                                        <span className={styles.required}> *</span>
                                    )}
                                </label>

                                {renderField(section.objectKey, field)}
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
                    {loading ? "Submitting..." : "Create Company"}
                </button>
            </div>
        </form>
    );
}
