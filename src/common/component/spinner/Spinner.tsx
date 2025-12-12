
import styles from './style/Spinner.module.css';

interface Props {
    size?: number;
}

export function Spinner({ size = 16 }: Props) {
    return (
        <div
            className={styles.spinner}
            style={{ width: size, height: size }}
        />
    );
}