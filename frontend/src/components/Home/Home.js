import React from "react";
import styles from "./Home.module.css";
import { NavLink, Outlet } from "react-router-dom";
import ROUTES from "../../app/routes";

export default function Home ({ user }) {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <NavLink to={ROUTES.register()} >
                            Register
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.checkout()} >
                            Checkout
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.products()} >
                            Products
                        </NavLink>
                    </li>
                    {localStorage.getItem("user") && localStorage.getItem("user") !== "undefined" ?
                    <li>
                        <NavLink to={ROUTES.profile()} >
                            Profile
                        </NavLink>
                    </li>
                    :
                    <li>
                        <NavLink to={ROUTES.login()} >
                            Login
                        </NavLink>
                    </li>
}
                </ul>
            </nav>
            <section className={styles.outlet}>
                <Outlet/>
            </section>
        </div>
    )
};