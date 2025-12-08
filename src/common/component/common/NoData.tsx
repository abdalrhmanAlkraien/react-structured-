import styles from "./style/NoData.module.css";

export function NoData({ message = "No data found" }: { message?: string }) {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>📭</div>
            <h3 className={styles.title}>{message}</h3>
            <p className={styles.subtitle}>There is nothing to display right now.</p>
        </div>
    );
}