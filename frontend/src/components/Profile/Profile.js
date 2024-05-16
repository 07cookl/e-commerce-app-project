import React from "react";
import { logout } from "../../api/api";
import { useNavigate } from "react-router-dom";
import OrderHistory from "../OrderHistory/OrderHistory";
import styles from "./Profile.module.css";

export default function Profile ({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await logout();
            if (response.logout) {
                localStorage.clear();
                setUser({});
                navigate('/');
            }
        } catch (err) {
            throw err;
        };
    };

    return (
        <div>
            {user ? 
            <section className={styles.container}>
                <h1>Welcome, {user.username}!</h1>
                <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </section>
            : 
            <p>collecting user data...</p>}
            <br/>
            <OrderHistory />
        </div>
    )
};