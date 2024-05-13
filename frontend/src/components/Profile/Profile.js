import React, { useEffect } from "react";
import { logout } from "../../api/api";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../app/routes";
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
            <p>{user ? `This is the Profile page for ${user.username}.` : "collecting user data..."}</p>
            <br/>
            <button onClick={handleLogout}>Logout</button>
            <br/>
            <OrderHistory />
        </div>
    )
};