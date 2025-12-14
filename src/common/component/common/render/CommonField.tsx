import styles from "./style/render.module.css"

interface Props {
    type: "text" | "email" | "password" | "number" | "date";
    value: any;
    required?: boolean;
    onChange: (value: string) => void;
}

export function CommonField({
                                type,
                                value,
                                required,
                                onChange,
                            }: Props) {
    return (
        <input
            type={type}
            className={styles.input}
            required={required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}