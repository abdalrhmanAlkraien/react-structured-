import styles from "./style/Pagination.module.css";

interface Props {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) return null;

    return (
        <div className={styles.pagination}>
            <button
                disabled={page === 0}
                onClick={() => onPageChange(page - 1)}
            >
                Prev
            </button>

            <span>Page {page + 1} of {totalPages}</span>

            <button
                disabled={page + 1 === totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
}
