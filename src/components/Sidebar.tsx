import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>MyApp</div>

      <nav>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
