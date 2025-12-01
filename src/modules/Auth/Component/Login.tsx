import React, { useState } from "react";
import styles from "../Style/Login.module.css";

export function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e: React.FormEvent)=> {

        e.preventDefault()

        // Call login api
    };

    return (
    <>
        <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.formGroup}>
                <label>Email</label>
                <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Password</label>
                <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button className={styles.loginButton} type="submit">
                Login
            </button>
        </form>
    </>
    );

    
}