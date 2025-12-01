import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import styles from "./AppLayout.module.css"

export function AppLayout({ children }: { children: React.ReactNode }) {

    return(
        <div className={styles.layout}>
            <Sidebar />
        <div className={styles.content}>
            <Navbar />
            <main className={styles.main}>{children}</main>
        </div>
    </div>
    )
}