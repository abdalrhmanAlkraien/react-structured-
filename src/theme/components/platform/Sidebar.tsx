import {NavLink} from "react-router-dom";
import styles from "../../style/Sidebar.module.css";

export function PlatformSidebar() {

  return (
      <aside className={styles.sidebar}>
        <div className={styles.logo}>NexAi</div>

        <nav>
          <NavLink
              to="dashboard"
              className={({isActive}) =>
                  isActive ? styles.activeLink : styles.link
              }
          >
            Dashboard
          </NavLink>

          <NavLink
              to="company"
              className={({isActive}) =>
                  isActive ? styles.activeLink : styles.link
              }
          >
            Company
          </NavLink>

          <NavLink
              to="/settings"
              className={({isActive}) =>
                  isActive ? styles.activeLink : styles.link
              }
          >
            Settings
          </NavLink>
        </nav>
      </aside>
  );
}
