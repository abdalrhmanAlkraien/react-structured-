import styles from "./style/GenericDetailsComponent.module.css";
import React from "react";


interface DetailField {
    label: string;
    accessor: string;
}

interface Props {
    title: string;
    data: Record<string, any>;
    fields: DetailField[];
    icon?: React.ReactNode | string; // ✨ support both
}

export function GenericDetailsComponent({ title, icon = "default", data, fields }: Props) {


    // Determine icon rendering
    const renderIcon = () => {
        // React element? render directly
        if (typeof icon !== "string") {
            return <div className={styles.headerIcon}>{icon}</div>;
        }

        // String? use CSS class
        return <div className={`${styles.headerIcon} ${styles["icon-" + icon]}`}></div>;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {renderIcon()}
                <h2 className={styles.title}>{title}</h2>
            </div>

            <div className={styles.card}>
                <div className={styles.grid}>
                    {fields.map((field) => (
                        <div key={field.accessor} className={styles.gridItem}>
                            <span className={styles.label}>{field.label}</span>
                            <span className={styles.value}>
                                {data[field.accessor] ?? "—"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}