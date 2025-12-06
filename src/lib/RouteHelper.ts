export function getHomeRedirect(roles: string[]) {

    if (!roles || roles.length === 0) return "/login";

    if (roles.includes("PLATFORM_ADMIN")) {
        return "/platform/dashboard";
    }

    if (roles.includes("COMPANY_ADMIN")) {
        return "/company/dashboard";
    }

    return "/company/dashboard"; // default for normal users
}