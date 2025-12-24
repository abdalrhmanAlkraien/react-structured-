import styles from "./style/render.module.css"
import {useEffect, useRef, useState} from "react";

interface Props {
    value: any;
    required?: boolean;

    optionsState?: {
        items: any[];
        hasMore: boolean;
        loading: boolean;
        search?: string;
        page?: number;
    };

    valueKey: string;
    labelKey: string;

    fallbackLabel?: string;
    disabled?: boolean;

    onChange: (value: string) => void;
    onSearch: (query: string) => void;
    onLoadMore: () => void;
    placeholder: string;
}

export function PageableApiSelectionField({
                                   value,
                                   optionsState,
                                   valueKey,
                                   labelKey,
                                   placeholder = "Select customer",
                                   onChange,
                                   onSearch,
                               }: Props) {
    const [open, setOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const ref = useRef<HTMLDivElement>(null);
    const items = optionsState?.items ?? [];

    /* -----------------------------
     * Close on outside click
     * ----------------------------- */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedItem = items.find(
        (item) => item[valueKey] === value
    );

    return (
        <div className={styles.wrapper} ref={ref}>
            {/* ===============================
             * Trigger
             * =============================== */}
            <div
                className={styles.dropdownInput}
                onClick={() => setOpen((p) => !p)}
            >
                <span className={styles.inputText}>
                    {selectedItem ? selectedItem[labelKey] : placeholder}
                </span>

                <span
                    className={`${styles.arrow} ${open ? styles.open : ""}`}
                >
                    ▼
                </span>
            </div>

            {/* ===============================
             * Dropdown
             * =============================== */}
            {open && (
                <div className={styles.commonDropdown}>
                    {/* 🔍 SEARCH BAR */}
                    <div className={styles.searchRow}>
                        <input
                            type="text"
                            className={styles.search}
                            placeholder="Search customer..."
                            value={searchInput}
                            onChange={(e) =>
                                setSearchInput(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className={styles.applyBtn}
                            onClick={() => onSearch(searchInput)}
                        >
                            Apply
                        </button>
                    </div>

                    {/* LIST */}
                    <div className={styles.list}>
                        {items.length === 0 && (
                            <div className={styles.empty}>
                                No results
                            </div>
                        )}

                        {items.map((item) => {
                            const checked =
                                item[valueKey] === value;

                            return (
                                <label
                                    key={item[valueKey]}
                                    className={styles.option}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                            onChange(item[valueKey])
                                        }
                                    />
                                    <span>{item[labelKey]}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}