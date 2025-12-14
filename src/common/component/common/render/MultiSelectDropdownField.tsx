import styles from "./style/render.module.css"

interface Props {
    value: any[];
    options: any[];
    valueKey: string;
    labelKey: string;
    isOpen: boolean;
    onToggle: () => void;
    onChange: (values: any[]) => void;
}

export function MultiSelectDropdownField({
                                             value = [],
                                             options,
                                             valueKey,
                                             labelKey,
                                             isOpen,
                                             onToggle,
                                             onChange,
                                         }: Props) {
    return (
        <div
            className={styles.dropdownContainer}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className={styles.dropdownHeader}
                onClick={onToggle}
            >
                {value.length === 0
                    ? "Select"
                    : `${value.length} selected`}
            </div>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {options.map((opt) => {
                        const optionValue = opt[valueKey];
                        const optionLabel = opt[labelKey];
                        const checked = value.includes(optionValue);

                        return (
                            <label
                                key={optionValue}
                                className={styles.dropdownItem}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                        const updated = e.target.checked
                                            ? [...value, optionValue]
                                            : value.filter((v) => v !== optionValue);

                                        onChange(updated);
                                    }}
                                />
                                <span>{optionLabel}</span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
