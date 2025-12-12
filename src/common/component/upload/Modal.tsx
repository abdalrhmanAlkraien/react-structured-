import React from "react";
import styles from "./style/Modal.module.css";

interface Props {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal({ open, title, onClose, children }: Props) {
    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {title && (
                    <div className={styles.header}>
                        <h3 className={styles.title}>{title}</h3>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
}
