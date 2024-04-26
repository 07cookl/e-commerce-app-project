import React, { useState } from "react";
import styles from "./Register.module.css";
import { registerUser } from "../../api/api";

export default function Register () {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');

    const onRegister = async (e) => {
        e.preventDefault();

        if (password !== checkPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        };

        const newUser = await registerUser(email, username, password);

        alert(`New user ${newUser.username} created!`);
        return;
    };

    return (
        <section id="register">
            <form onSubmit={onRegister}>
                <label for="email">Email Address: </label>
                <input type="email" name="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}} required/>
                <label for="username">Username: </label>
                <input type="text" name="username" id="username" value={username} onChange={(e) => {setUsername(e.target.value)}} required/>
                <label for="password">Password: </label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}} required/>
                <label for="retype-password">Re-type Password: </label>
                <input type="password" name="retype-password" id="retype-password" value={checkPassword} onChange={(e) => {setCheckPassword(e.target.value)}} required/>
                <input type="submit"/>
            </form>
        </section>
    )
};