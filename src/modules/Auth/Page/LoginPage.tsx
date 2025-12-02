import { Login } from '../Component/Login';
import styles from '../Style/Login.module.css'

export function LoginPage() {

    return (
        <>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Welcome Back</h2>
                     <p className={styles.subtitle}>Please login to continue</p>
                     <Login/>
                </div>
            </div>
        </>
    );
}