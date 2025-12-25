import React from "react";
import styles from "../../create/style/DynamicCreateForm.module.css";
import type { FormSection } from "../../../lib/FormSection";
import { RepeatableFieldRenderer } from "./RepeatableFieldRenderer";

interface Props {
    section: FormSection;
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    apiOptions: Record<string, any>;
    fetchOptions: Function;
}

export function RepeatableSection({
                                      section,
                                      formData,
                                      setFormData,
                                      apiOptions,
                                      fetchOptions,
                                  }: Props) {
    const items = Array.isArray(formData[section.name])
        ? formData[section.name]
        : [];

    function addItem() {
        setFormData((prev) => ({
            ...prev,
            [section.name]: [...(prev[section.name] || []), {}],
        }));
    }

    function removeItem(index: number) {
        setFormData((prev) => ({
            ...prev,
            [section.name]: prev[section.name].filter(
                (_: any, i: number) => i !== index
            ),
        }));
    }

    return (
        <div className={styles.card}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>

            {items.map((item, index) => (
                <div key={index} style={{ marginBottom: 24 }}>
                    <strong>Item #{index + 1}</strong>

                    <div className={styles.grid}>
                        {section.fields.map((field) => (
                            <div key={field.name} className={styles.formGroup}>
                                <label className={styles.label}>
                                    {field.label}
                                    {field.required && (
                                        <span className={styles.required}> *</span>
                                    )}
                                </label>

                                <RepeatableFieldRenderer
                                    section={section}
                                    field={field}
                                    value={item[field.name]}
                                    onChange={(val) =>
                                        setFormData((prev) => {
                                            const next = [...(prev[section.name] || [])];
                                            next[index] = {
                                                ...next[index],
                                                [field.name]: val,
                                            };
                                            return {
                                                ...prev,
                                                [section.name]: next,
                                            };
                                        })
                                    }
                                    apiOptions={apiOptions}
                                    fetchOptions={fetchOptions}
                                    formData={formData}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        style={{ marginTop: 8, color: "red" }}
                    >
                        Remove Item
                    </button>
                </div>
            ))}

            <button type="button" onClick={addItem}>
                + Add Item
            </button>
        </div>
    );
}
