import styles from "./style/GenericDetailsComponent.module.css";
import React from "react";
import type {DetailField, DetailSection} from "../../lib/DataField.ts";


interface Props {
    title: string;
    data: Record<string, any>;
    fields?: DetailField[];      // 👈 existing
    sections?: DetailSection[];  // 👈 new
    icon?: React.ReactNode | string;
}

export function GenericDetailsComponent({
                                            title,
                                            icon = "default",
                                            data,
                                            sections
                                        }: Props) {

    function resolveValue(obj: any, path: string) {
        return path.split(".").reduce((acc, key) => acc?.[key], obj);
    }

    return (
        <div className={styles.container}>
            {/* ================= HEADER ================= */}
            <div className={styles.header}>
                <div className={styles.headerIcon}>{icon}</div>
                <h2 className={styles.title}>{title}</h2>
            </div>

            {/* ================= SECTIONS ================= */}
            {sections?.map(section => {
                const sectionData = section.accessor
                    ? resolveValue(data, section.accessor)
                    : data;

                if (!sectionData) return null;

                return (
                    <div key={section.title} className={styles.card}>
                        {/* 🔹 Section title */}
                        <h3 className={styles.sectionTitle}>
                            {section.title}
                        </h3>

                        {/* 🔁 Repeatable */}
                        {section.repeatable ? (
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    {section.columns!.map(col => (
                                        <th key={col.accessor}>{col.label}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {sectionData.map((row: any, i: number) => (
                                    <tr key={i}>
                                        {section.columns!.map(col => (
                                            <td key={col.accessor}>
                                                {resolveValue(row, col.accessor) ?? "—"}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className={styles.grid}>
                                {section.fields?.map(field => (
                                    <div key={field.accessor} className={styles.gridItem}>
                    <span className={styles.label}>
                      {field.label}
                    </span>
                                        <span className={styles.value}>
                      {resolveValue(sectionData, field.accessor) ?? "—"}
                    </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
