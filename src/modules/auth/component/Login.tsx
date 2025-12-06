import React, {useState} from "react";
import styles from "../style/Login.module.css";
import {useAuth} from "../../../context/auth/useAuth";
import {loginApi} from "../service/LoginApi.ts";

export function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {login} = useAuth();


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        try {
            const res = await loginApi({
                username: email,
                password
            });

            console.log(res);
            const {accessToken, user} = res;

            login({
                token: accessToken,
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    companyName: user.companyName,
                    fullname: user.fullname,
                    roles: user.roles,
                    companyId: user.companyId
                }
            });

            // navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Invalid credentials");
        }
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>

                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                        type="text"
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