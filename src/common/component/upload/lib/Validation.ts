export function validateFile(file: File, allowedTypes: string[]) {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !allowedTypes.includes(ext)) {
        throw new Error(
            `Invalid file type. Allowed: ${allowedTypes.join(", ")}`
        );
    }
}