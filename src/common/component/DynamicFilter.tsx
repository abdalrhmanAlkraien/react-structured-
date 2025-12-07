import { useEffect, useState } from "react";
import styles from "./style/DynamicFilter.module.css";
import {api} from "../../config/axios.config.ts";
import type {FilterField} from "./type/filter.ts";

interface Props {
    fields: FilterField[];
    onChange: (filters: Record<string, any>) => void;
}

export function DynamicFilter({ fields, onChange }: Props) {
    const [values, setValues] = useState<Record<string, any>>({});
    const [options, setOptions] = useState<Record<string, any[]>>({});
    const [apiOptions, setApiOptions] = useState({});

    // Load initial API select options
    useEffect(() => {
        fields.forEach(async (field) => {
            if (field.type === "api-select" && !field.dependsOn) {
                const res = await api.get(field.api);
                setApiOptions((prev) => ({ ...prev, [field.name]: res.data }));
            }
        });
    }, []);

    // Load dependent (city) when parent changes (country)
    useEffect(() => {
        fields.forEach(async (field) => {
            if (field.dependsOn && values[field.dependsOn]) {
                const url = field.api.replace(
                    "{countryId}",
                    values[field.dependsOn]
                );

                const res = await api.get(url);
                setApiOptions((prev) => ({ ...prev, [field.name]: res.data }));
            }
        });
    }, [values]);

    // ----------------------
    // Handle input change
    // ----------------------
    function handleChange(name: string, value: any) {
        const newState = { ...values, [name]: value };

        // Reset dependent fields automatically
        fields.forEach((field) => {
            if (field.dependsOn === name) {
                newState[field.name] = ""; // reset city when country changes
            }
        });

        setValues(newState);
        onChange(newState);
    }

    // ----------------------
    // Render input fields dynamically
    // ----------------------
    function renderField(field: FilterField) {
        switch (field.type) {
            case "text":
                return (
                    <input
                        key={field.name}
                        type="text"
                        placeholder={field.label}
                        value={values[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                );

            case "select":
                return (
                    <select
                        key={field.name}
                        value={values[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                    >
                        <option value="">{field.label}</option>
                        {field.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );

            case "boolean":
                return (
                    <select
                        key={field.name}
                        value={values[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                    >
                        <option value="">{field.label}</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                );

            case "date":
                return (
                    <input
                        key={field.name}
                        type="datetime-local"
                        value={values[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                );

            case "api-select":
                return (
                    <select
                        key={field.name}
                        value={values[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        disabled={field.dependsOn && !values[field.dependsOn]}
                    >
                        <option value="">{field.label}</option>
                        {(options[field.name] || []).map((opt) => (
                            <option
                                key={opt.value || opt.id}
                                value={opt.value || opt.id}
                            >
                                {opt.label || opt.name}
                            </option>
                        ))}
                    </select>
                );

            default:
                return null;
        }
    }

    return (
        <div className={styles.filterContainer}>
            {fields.map((field) => renderField(field))}
        </div>
    );
}
