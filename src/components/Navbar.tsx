import styles from "./Navbar.module.css";

export function Navbar() {
  const userName = "User";

  return (
    <header className={styles.navbar}>
      <div className={styles.left}></div>

      <div className={styles.right}>
        <span className={styles.userName}>{userName}</span>

        <button className={styles.logoutButton} onClick={() => {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }}>
          Logout
        </button>
      </div>
    </header>
  );
}
