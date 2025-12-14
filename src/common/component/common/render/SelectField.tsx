import styles from "./style/render.module.css"

interface Props {
    value: any;
    required?: boolean;
    options: string[];
    onChange: (value: string) => void;
}

export function SelectField({
                                value,
                                required,
                                options,
                                onChange,
                            }: Props) {
    return (
        <select
            className={styles.select}
            required={required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Select</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    );
}
