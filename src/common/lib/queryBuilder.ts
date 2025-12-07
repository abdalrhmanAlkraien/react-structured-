export function buildQueryParams(filters: Record<string, any>): string {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            params.append(key, String(value));
        }
    });

    return params.toString();
}
