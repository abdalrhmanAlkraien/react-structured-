import styles from "./style/render.module.css"

interface Props {
    value: any;
    required?: boolean;
    onChange: (value: string) => void;
}

export function TextareaField({
                                  value,
                                  required,
                                  onChange,
                              }: Props) {
    return (
        <textarea
            className={styles.textarea}
            required={required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}