export function isPlatformAdmin(roles: string[] = []) {
    return roles.includes("PLATFORM_ADMIN");
}

export function isCompanyAdmin(roles: string[] = []) {
    return roles.includes("COMPANY_ADMIN");
}

export function hasRole(roles: string[] = [], required: string[]) {
    return required.some((r) => roles.includes(r));
}