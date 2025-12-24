import styles from "./style/StatusBadge.module.css";

interface Props {
    status: string;
}

export function StatusBadge({ status }: Props) {
    const normalized = status.toUpperCase();

    return (
        <span className={`${styles.badge} ${styles[normalized] || styles.DEFAULT}`}>
            {normalized}
        </span>
    );
}