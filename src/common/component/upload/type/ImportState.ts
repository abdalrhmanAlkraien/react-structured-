type ImportStepStatus = "idle" | "processing" | "success" | "error";

interface ImportState {
    file?: File;
    fileUrl?: string;

    validation: ImportStepStatus;
    import: ImportStepStatus;

    errorMessage?: string;
}