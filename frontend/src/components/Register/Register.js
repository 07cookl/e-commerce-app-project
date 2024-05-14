import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { registerUser } from "../../api/api";

export default function Register ({ setUser }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const navigate = useNavigate();

    const onRegister = async (e) => {
        e.preventDefault();

        if (password !== checkPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        };

        const newUser = await registerUser(email, username, password);

        setUser(newUser);
        alert(`New user ${newUser.username} created!`);
        navigate('/profile');
    };

    return (
        <section className={styles.container} id="register">
            <form className={styles.loginForm} onSubmit={onRegister}>
                <div className={styles.formGroup} >
                    <label className={styles.formLabel} htmlFor="email">Email Address: </label>
                    <input className={styles.formField} type="email" name="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}} required/>
                </div>
                <div className={styles.formGroup} >
                    <label className={styles.formLabel} htmlFor="username">Username: </label>
                    <input className={styles.formField} type="text" name="username" id="username" value={username} onChange={(e) => {setUsername(e.target.value)}} required/>
                </div>
                <div className={styles.formGroup} >
                    <label className={styles.formLabel} htmlFor="password">Password: </label>
                    <input className={styles.formField} type="password" name="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}} required/>
                </div>
                <div className={styles.formGroup} >
                    <label className={styles.formLabel} htmlFor="retype-password">Re-type Password: </label>
                    <input className={styles.formField} type="password" name="retype-password" id="retype-password" value={checkPassword} onChange={(e) => {setCheckPassword(e.target.value)}} required/>
                </div>
                <button type="submit">Register</button>
            </form>
        </section>
    )
};