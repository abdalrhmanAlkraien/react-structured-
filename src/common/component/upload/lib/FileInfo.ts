export function formatSize(bytes: number) {
    return (bytes / (1024 * 1024)).toFixed(2);
}

export function getFileType(name: string) {
    return name.split(".").pop()?.toUpperCase();
}