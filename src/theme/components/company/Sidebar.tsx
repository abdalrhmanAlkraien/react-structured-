import {NavLink} from "react-router-dom";
import styles from "../../style/Sidebar.module.css";

export function CompanySidebar() {

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>NexAi</div>

            <nav>
                <NavLink
                    to="/dashboard"
                    className={({isActive}) =>
                        isActive ? styles.activeLink : styles.link
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="customers"
                    className={({isActive}) =>
                        isActive ? styles.activeLink : styles.link
                    }
                >
                    Customers
                </NavLink>

                <NavLink
                    to="categories"
                    className={({isActive}) =>
                        isActive ? styles.activeLink : styles.link
                    }
                >
                    Categories
                </NavLink>

                <NavLink
                    to="products"
                    className={({isActive}) =>
                        isActive ? styles.activeLink : styles.link
                    }
                >
                    Products
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
