import styles from "./style/ActionButtons.module.css";
import {FiEdit, FiEye, FiTrash2} from "react-icons/fi";

interface ActionButtonsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function ActionButtons({ onView, onEdit, onDelete }: ActionButtonsProps) {
    return (
        <div className={styles.actions}>
            {onView && (
                <button className={styles.iconButton} onClick={onView} title="View details">
                    <FiEye />
                </button>
            )}

            {onEdit && (
                <button className={styles.iconButton} onClick={onEdit} title="Edit">
                    <FiEdit />
                </button>
            )}

            {onDelete && (
                <button className={styles.iconButtonDelete} onClick={onDelete} title="Delete">
                    <FiTrash2 />
                </button>
            )}
        </div>
    );
}