import {useRef, useState} from "react";
import styles from "./style/FileUpload.module.css";
import {Modal} from "./Modal.tsx";
import {validateFile} from "./lib/Validation.ts";
import {FaFileAlt} from "react-icons/fa";
import {formatSize, getFileType} from "./lib/FileInfo.ts";


interface Props {
    label: string;
    allowedTypes?: string[];
    maxSizeMB?: number;

    onFileSelected?: (file: File) => void;
}

export function FileUpload({
                               label,
                               allowedTypes = ["json", "csv", "sql"],
                               maxSizeMB = 10,
                               onFileSelected,
                           }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [openInfo, setOpenInfo] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    function handleFileChange(file: File) {
        validateFile(file, allowedTypes, maxSizeMB);

        setSelectedFile(file);
        onFileSelected?.(file);

        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <div className={styles.fileUploadWrapper}>
            <input
                ref={inputRef}
                type="file"
                accept={allowedTypes.map((t) => `.${t}`).join(",")}
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file);
                }}
            />

            <button
                className={`btn btn-outline btn-md ${styles.uploadButton}`}
                onClick={() => inputRef.current?.click()}
            >
                {label}
            </button>

            {selectedFile && (
                <div className={styles.fileInfo}>
                    <div className={styles.fileRow}>
                        <span className={styles.fileIcon}>
                            <FaFileAlt size={18} />
                        </span>

                        <div className={styles.fileMeta}>
                            <div className={styles.fileName}>
                                {selectedFile.name}
                            </div>
                            <div className={styles.fileDetails}>
                                Type: {getFileType(selectedFile.name)} ·
                                Size: {formatSize(selectedFile.size)} MB
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button
                className={styles.infoButton}
                onClick={() => setOpenInfo(true)}
                title="Import rules"
            >
                ℹ
            </button>

            <Modal
                open={openInfo}
                title="Import File Rules"
                onClose={() => setOpenInfo(false)}
            >
                <ul style={{ paddingLeft: 16 }}>
                    <li><strong>Allowed file types:</strong> {allowedTypes.join(", ")}</li>
                    <li><strong>Max file size:</strong> {maxSizeMB}MB</li>
                    <li>
                        <strong>Process:</strong>
                        <ol style={{ paddingLeft: 16 }}>
                            <li>Upload file</li>
                            <li>Validate file structure</li>
                            <li>Import data</li>
                        </ol>
                    </li>
                </ul>
            </Modal>
        </div>
    );
}
