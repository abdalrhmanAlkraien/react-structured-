import React, { useEffect, useState } from "react";
import styles from "./style/DynamicCreateForm.module.css";
import {api} from "../../../config/axios.config.ts";
import type {FormField} from "../../lib/FormField.ts";
import type {FormSection} from "../../lib/FormSection.ts";
import {getFieldValue, getSectionData, updateFieldValue} from "../../lib/DynamicForm.ts";

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
                if (
                    field.type === "api-select" &&
                    field.dependsOn &&
                    field.api
                ) {
                    const sectionData = getSectionData(formData, section);
                    const parentValue = sectionData[field.dependsOn];

                    if (!parentValue) return;

                    const url = field.api.replace("{countryId}", parentValue);
                    const res = await api.get(url);

                    const list = Array.isArray(res.data?.data)
                        ? res.data.data
                        : Array.isArray(res.data)
                            ? res.data
                            : [];

                    setApiOptions((prev) => ({
                        ...prev,
                        [field.name]: list,
                    }));
                }
            });
        });
    }, [formData, sections]);

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

    function renderField(section: FormSection, field: FormField) {
        const value = getFieldValue(formData, section, field);
        const sectionData = getSectionData(formData, section);

        switch (field.type) {
            case "text":
            case "email":
            case "password":
            case "number":
            case "date":
                return (
                    <input
                        type={field.type}
                        className={styles.input}
                        required={field.required}
                        value={value}
                        onChange={(e) =>
                            updateFieldValue(
                                setFormData,
                                section,
                                field.name,
                                e.target.value
                            )
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
                            updateFieldValue(
                                setFormData,
                                section,
                                field.name,
                                e.target.value
                            )
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
                            updateFieldValue(
                                setFormData,
                                section,
                                field.name,
                                e.target.value
                            )
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
                        disabled={field.dependsOn && !sectionData[field.dependsOn]}
                        onChange={(e) =>
                            updateFieldValue(
                                setFormData,
                                section,
                                field.name,
                                e.target.value
                            )
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
                const selectedValues = Array.isArray(value) ? value : [];
                const list = apiOptions[field.name] || [];

                return (
                    <div className={styles.dropdownContainer}>
                        <div
                            className={styles.dropdownHeader}
                            onClick={() =>
                                setOpenDropdown((prev) => ({
                                    ...prev,
                                    [field.name]: !prev[field.name],
                                }))
                            }
                        >
                            {selectedValues.length === 0
                                ? field.label
                                : `${selectedValues.length} selected`}
                        </div>

                        {openDropdown[field.name] && (
                            <div className={styles.dropdownMenu}>
                                {list.map((opt) => {
                                    const optionValue =
                                        opt[field.valueKey!] || opt.id;
                                    const optionLabel =
                                        opt[field.labelKey!] || opt.role;
                                    const isChecked =
                                        selectedValues.includes(optionValue);

                                    return (
                                        <div
                                            key={optionValue}
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                const updated = isChecked
                                                    ? selectedValues.filter(
                                                        (v) => v !== optionValue
                                                    )
                                                    : [...selectedValues, optionValue];

                                                updateFieldValue(
                                                    setFormData,
                                                    section,
                                                    field.name,
                                                    updated
                                                );
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
                const selectedValues = Array.isArray(value) ? value : [];
                const list = apiOptions[field.name] || [];

                return (
                    <div className={styles.multiCheckWrapper}>
                        {list.map((opt) => {
                            const optionValue =
                                opt[field.valueKey!] || opt.id;
                            const optionLabel =
                                opt[field.labelKey!] || opt.role;

                            return (
                                <label
                                    key={optionValue}
                                    className={styles.multiCheckItem}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedValues.includes(optionValue)}
                                        onChange={(e) => {
                                            const updated = e.target.checked
                                                ? [...selectedValues, optionValue]
                                                : selectedValues.filter(
                                                    (v) => v !== optionValue
                                                );

                                            updateFieldValue(
                                                setFormData,
                                                section,
                                                field.name,
                                                updated
                                            );
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
                    {loading ? "Submitting..." : "Create Customer"}
                </button>
            </div>
        </form>
    );
}
