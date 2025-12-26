import styles from "./style/render.module.css"

interface Props {
    value: any;
    required?: boolean;
    options: any[];
    valueKey: string;
    labelKey: string;
    fallbackLabel?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}

export function ApiSelectField({
                                   value,
                                   required,
                                   options,
                                   valueKey,
                                   labelKey,
                                   fallbackLabel,
                                   disabled,
                                   onChange,
                               }: Props) {
    const hasOption = options.some(
        (opt) => opt[valueKey] === value
    );

    const isDisabled =
        disabled ?? (!options.length && !value);

    return (
        <select
            className={styles.select}
            required={required}
            disabled={isDisabled}
            value={value ?? ""}
            onChange={(e) => {
                const selected = options.find(
                    o => o[valueKey] === e.target.value
                );
                console.log("selected", selected);
                console.log("valueKey", labelKey);
                onChange(selected); // 🔥 FULL OBJECT
            }}
        >
            <option value="">Select</option>

            {/* ✅ UPDATE fallback */}
            {value && !hasOption && fallbackLabel && (
                <option value={value}>{fallbackLabel}</option>
            )}

            {options.map((opt) => (

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