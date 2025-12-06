import {useNavigation} from "react-router-dom";
import {useAuth} from "../../../context/auth/useAuth.ts";
import styles from "../style/ForbiddenPage.module.css";
import {getHomeRedirect} from "../../../lib/RouteHelper.ts";

export function ForbiddenPage() {

    const navigate = useNavigation();
    const {user} = useAuth();

    const goHome = () => {
        const path = getHomeRedirect(user?.roles || []);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigate(path);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.code}>403</h1>
                <h2 className={styles.title}>Access Denied</h2>
                <p className={styles.subtitle}>
                    You do not have permission to view this page.
                </p>

                <button className={styles.button} onClick={goHome}>
                    Go Back to Dashboard
                </button>
            </div>
        </div>
    );


}