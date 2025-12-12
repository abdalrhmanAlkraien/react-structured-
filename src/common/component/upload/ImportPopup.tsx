import {useEffect, useState} from "react";
import { FileUpload } from "./FileUpload";
import { Step } from "./Step";
import { Modal } from "./Modal";
import styles from "./style/ImportPopup.module.css";
import type {FileType} from "./type/FileType.ts";
import type {StepStatus} from "./type/StepStatus.ts";

type PipelineStep =
    | "idle"
    | "uploading"
    | "validating"
    | "importing"
    | "success"
    | "error";

interface Props {
    open: boolean;
    title: string;
    bucket: string;

    uploadService: (file: File, bucket: string) => Promise<string>;
    onValidate: (payload: { fileUrl: string; fileType: FileType }) => Promise<void>;
    onImport: (payload: { fileUrl: string; fileType: FileType }) => Promise<void>;
    onViewHistory: () => void;

    onClose: () => void;
}

export function ImportPopup({
                                open,
                                title,
                                bucket,
                                uploadService,
                                onValidate,
                                onImport,
                                onViewHistory,
                                onClose,
                            }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<FileType>("");

    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const [validation, setValidation] = useState<StepStatus>("idle");
    const [importing, setImporting] = useState<StepStatus>("idle");
    const [uploading, setUploading] = useState<StepStatus>("idle");

    const [step, setStep] = useState<PipelineStep>("idle");

    function reset() {
        setSelectedFile(null);
        setFileType("");
        setUploadedUrl(null);
        setUploading("idle");
        setValidation("idle");
        setImporting("idle");
        setStep("idle");
    }

    function handleImport() {
        if (!selectedFile || !fileType) return;

        setUploadedUrl(null);
        setUploading("idle");
        setValidation("idle");
        setImporting("idle");
        setStep("uploading");
    }

    // UPLOAD
    useEffect(() => {
        if (step !== "uploading" || !selectedFile) return;

        let cancelled = false;

        (async () => {
            try {
                setUploading("processing");
                const url = await uploadService(selectedFile, bucket);
                if (cancelled) return;

                setUploadedUrl(url);
                setUploading("success");
                setStep("validating");
            } catch {
                if (!cancelled) {
                    setUploading("error");
                    setStep("error");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [step, selectedFile, bucket, uploadService]);

    // VALIDATE
    useEffect(() => {
        if (step !== "validating" || !uploadedUrl || !fileType) return;

        let cancelled = false;

        (async () => {
            try {
                setValidation("processing");
                await onValidate({ fileUrl: uploadedUrl, fileType });
                if (cancelled) return;

                setValidation("success");
                setStep("importing");
            } catch {
                if (!cancelled) {
                    setValidation("error");
                    setStep("error");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [step, uploadedUrl, fileType, onValidate]);

    // IMPORT
    useEffect(() => {
        if (step !== "importing" || !uploadedUrl || !fileType) return;

        (async () => {
            try {
                setImporting("processing");
                await onImport({ fileUrl: uploadedUrl, fileType });
                setImporting("success");
                setStep("success");
            } catch {
                setImporting("error");
                setStep("error");
            }
        })();
    }, [step, uploadedUrl, fileType, onImport]);

    const validateStepStatus: StepStatus = useMemo(() => {
        if (step === "validating") return "processing";
        if (step === "importing" || step === "success" || step === "error") return validation;
        return "idle";
    }, [step, validation]);

    const importStepStatus: StepStatus = useMemo(() => {
        if (step === "importing") return "processing";
        if (step === "success" || step === "error") return importing;
        return "idle";
    }, [step, importing]);

    const isBusy = step === "uploading" || step === "validating" || step === "importing";

    return (
        <Modal open={open} title={title} onClose={() => { reset(); onClose(); }}>
            <div className={styles.container}>
                <FileUpload
                    label="Select File"
                    onFileSelected={(file) => {
                        setSelectedFile(file);
                        setFileType("");
                        setUploadedUrl(null);
                        setUploading("idle");
                        setValidation("idle");
                        setImporting("idle");
                        setStep("idle");
                    }}
                />

                <select
                    className={styles.fileTypeSelect}
                    disabled={!selectedFile || isBusy}
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as FileType)}
                >
                    <option value="">Select file type</option>
                    <option value="CSV">CSV</option>
                    <option value="JSON">JSON</option>
                    <option value="SQL">SQL</option>
                </select>

                <div className={styles.steps}>
                    <Step label="Validate file" status={validateStepStatus} />
                    <Step label="Import processing" status={importStepStatus} />
                </div>

                <div className={styles.actions}>
                    <button
                        className="btn btn-primary"
                        disabled={!selectedFile || !fileType || isBusy}
                        onClick={handleImport}
                    >
                        {isBusy ? "Processing..." : "Import"}
                    </button>

                    {step === "success" && importing === "success" && (
                        <button className="btn btn-outline" onClick={onViewHistory}>
                            View Import History
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
