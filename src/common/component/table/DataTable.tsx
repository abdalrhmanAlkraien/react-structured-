import React from "react";
import styles from "./style/DataTable.module.css";

export interface Column<T> {
    header: string;
    accessor: keyof T;
    width?: string;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
}

export function DataTable<T>({
                                 columns,
                                 data,
                                 loading = false,
                                 emptyMessage = "No records found"
                             }: DataTableProps<T>) {

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <table className={styles.table}>
            <thead>
            <tr>
                {columns.map((col, idx) => (
                    <th key={idx} style={{ width: col.width || "auto" }}>
                        {col.header}
                    </th>
                ))}
            </tr>
            </thead>

            <tbody>
            {data.length === 0 ? (
                <tr>
                    <td colSpan={columns.length} className={styles.empty}>
                        {emptyMessage}
                    </td>
                </tr>
            ) : (
                data.map((row: any, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col, colIndex) => (
                            <td key={colIndex}>
                                {col.render
                                    ? col.render(row)
                                    : (row[col.accessor] as any)}
                            </td>
                        ))}
                    </tr>
                ))
            )}
            </tbody>
        </table>
    );
}
