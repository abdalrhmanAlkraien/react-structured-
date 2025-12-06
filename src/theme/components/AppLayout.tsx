import {CompanyNavbar} from "./company/Navbar.tsx";
import {CompanySidebar} from "./company/Sidebar.tsx";
import styles from "../style/AppLayout.module.css"
import {useAuth} from "../../context/auth/useAuth.ts";
import {PlatformSidebar} from "./platform/Sidebar.tsx";
import {PlatformNavbar} from "./platform/Navbar.tsx";
import {isCompanyAdmin, isPlatformAdmin} from "../../lib/roleHelpers.ts";

export function AppLayout({children}: { children: React.ReactNode }) {

    const {user} = useAuth()
    const roles = user?.roles || [];

    const isPlatform = isPlatformAdmin(roles);
    const isCompany = isCompanyAdmin(roles);

    return (
        <div className={styles.layout}>
            {isPlatform && <PlatformSidebar />}
            {isCompany && <CompanySidebar />}

            <div className={styles.content}>
                {isPlatform && <PlatformNavbar />}
                {isCompany && <CompanyNavbar />}
                <main className={styles.main}>{children}</main>
            </div>
        </div>
    )
}