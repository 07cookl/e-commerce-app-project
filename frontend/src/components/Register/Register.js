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
        <section id="register">
            <form onSubmit={onRegister}>
                <label htmlFor="email">Email Address: </label>
                <input type="email" name="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}} required/>
                <label htmlFor="username">Username: </label>
                <input type="text" name="username" id="username" value={username} onChange={(e) => {setUsername(e.target.value)}} required/>
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}} required/>
                <label htmlFor="retype-password">Re-type Password: </label>
                <input type="password" name="retype-password" id="retype-password" value={checkPassword} onChange={(e) => {setCheckPassword(e.target.value)}} required/>
                <input type="submit"/>
            </form>
        </section>
    )
};