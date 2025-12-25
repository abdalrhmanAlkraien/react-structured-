/**
 * Converts date / datetime-local values into ISO-8601 Instant
 *
 * Supported inputs:
 * - "2025-12-17"
 * - "2025-12-17T14:30"
 * - ISO string
 * - Date
 */
export function toInstant(
    value?: string | Date | null
): string | null {
    if (!value) return null;

    // Already a Date
    if (value instanceof Date) {
        return value.toISOString();
    }

    // String handling
    const str = value.trim();

    // date-only: "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        // Default time = start of day (local)
        return new Date(`${str}T00:00`).toISOString();
    }

    // datetime-local: "YYYY-MM-DDTHH:mm"
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) {
        return new Date(str).toISOString();
    }

    // Already ISO or anything Date can parse
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
    }

    console.warn("[toInstant] Invalid date value:", value);
    return null;
}

export function toDateTimeLocal(value?: string | null): string {
    if (!value) return "";

    const date = new Date(value);
    if (isNaN(date.getTime())) return "";

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        `${date.getFullYear()}-` +
        `${pad(date.getMonth() + 1)}-` +
        `${pad(date.getDate())}T` +
        `${pad(date.getHours())}:` +
        `${pad(date.getMinutes())}`
    );
}