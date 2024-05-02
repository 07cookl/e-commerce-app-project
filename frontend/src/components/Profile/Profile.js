import React, { useEffect } from "react";
import { logout } from "../../api/api";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../app/routes";
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
            <p>This is the Profile page for {user.username}.</p>
            <br/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
};