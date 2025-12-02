import { useAuth } from "../../context/auth/useAuth";
import styles from "../style/Navbar.module.css";

export function Navbar() {
      const { user, logout } = useAuth();


  return (
    <header className={styles.navbar}>
      <div className={styles.left}></div>

      <div className={styles.right}>
        <span className={styles.userName}>{user.username}</span>

        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
