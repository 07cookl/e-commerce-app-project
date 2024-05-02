import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api";
import styles from "./Login.module.css";

export default function Login ({setUser}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (errorMessage) {
            alert(errorMessage);
            setErrorMessage('');
        };
    }, [errorMessage]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const user = await login(email, password);
        setUser(user);
        setEmail('');
        setPassword('');

        if (user.error) {
            setErrorMessage(user.error);
            return;
        }

        navigate("/profile");
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label htmlFor="email">Email Address: </label>
                <input type="text" id="email" name="email" value={email} onChange={(e) => {setEmail(e.target.value)}} required />
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => {setPassword(e.target.value)}} required />
                <button type="submit">Login</button>
            </form>
        </div>
    )
};