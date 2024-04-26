import React from "react";
import styles from "./Home.module.css";
import { NavLink, Outlet } from "react-router-dom";
import ROUTES from "../../app/routes";

export default function Home () {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <NavLink to={ROUTES.home()} >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.register()} >
                            Register
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.login()} >
                            Login
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.checkout()} >
                            Checkout
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.error()} >
                            Error
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.product(1)} >
                            Product
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.products()} >
                            Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.profile()} >
                            Profile
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <Outlet/>
        </div>
    )
};