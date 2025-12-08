import { useEffect, useState } from "react";
import styles from "./style/DynamicFilter.module.css";
import { api } from "../../../config/axios.config.ts";
import type { FilterField } from "./type/filter.ts";

interface Props {
    fields: FilterField[];
    onChange: (filters: Record<string, any>) => void; // called when user clicks Apply Filter
}

export function DynamicFilter({ fields, onChange }: Props) {
    const [values, setValues] = useState<Record<string, any>>({});
    const [apiOptions, setApiOptions] = useState<Record<string, any[]>>({});

    // Load initial API select options (countries)
    useEffect(() => {
        fields.forEach(async (field) => {
            if (field.type === "api-select" && !field.dependsOn) {
                const res = await api.get(field.api);
                setApiOptions((prev) => ({ ...prev, [field.name]: res.data }));
            }
        });
    }, []);

    // Load dependent (cities) when parent changes (country)
    useEffect(() => {
        fields.forEach(async (field) => {
            if (field.type === "api-select" && field.dependsOn && values[field.dependsOn]) {
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
    // Handle input change (NO API CALL HERE)
    // ----------------------
    function handleChange(name: string, value: any) {
        const newState = { ...values, [name]: value };

        // Reset dependent fields automatically (city when country changes)
        fields.forEach((field) => {
            if (field.dependsOn === name) {
                newState[field.name] = "";
            }
        });

        setValues(newState);
    }

    // ----------------------
    // Apply Filter button
    // ----------------------
    function handleApplyFilter() {
        onChange(values); // parent will use these values to refetch data
    }

    function handleReset() {
        setValues({});
        onChange({});
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

            case "api-select": {
                const opts = apiOptions[field.name] || [];
                const valueKey = field.valueKey || "id";
                const labelKey = field.labelKey || "name";

                return (
                    <select
                        key={field.name}
                        value={values[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        disabled={field.dependsOn && !values[field.dependsOn]}
                    >
                        <option value="">{field.label}</option>
                        {opts.map((opt: any) => (
                            <option
                                key={opt[valueKey]}
                                value={opt[valueKey]}
                            >
                                {opt[labelKey]}
                            </option>
                        ))}
                    </select>
                );
            }

            default:
                return null;
        }
    }

    return (
        <div className={styles.filterContainer}>
            {fields.map((field) => renderField(field))}

            <div className={styles.buttons}>
                <button
                    className="btn btn-primary btn-md"
                    onClick={handleApplyFilter}
                >
                    Apply Filter
                </button>

                <button
                    className="btn btn-outline btn-md"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
