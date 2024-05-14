import React, { useState, useEffect } from "react";
import ROUTES from "../../app/routes";
import styles from "./Checkout.module.css";
import { getUserCart, placeOrder, stripeCheckout } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function Checkout ({ cartData, setCartData }) {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getCart = async () => {
            try {
                const cart = await getUserCart();

                if (cart.authenticated === false) {
                    navigate(ROUTES.login());
                    return;
                };

                setCartData(cart);
            } catch (err) {
                console.log(err);
            };
        };
        getCart();
    }, []);

    const ProductDisplay = () => (
        <section>
            {cartData ? 
            cartData.map((item) => (
                <div className="product">
                    <div className="description">
                    <h3>{item.name}</h3>
                    <h5>{item.price}</h5>
                    </div>
                </div>
            ))
        :
        <p>retrieving cart data...</p>}

            <form onSubmit={handleCheckout}>
                <button type="submit">
                Checkout
                </button>
            </form>
        </section>
    );

    const Message = ({ message }) => (
        <section>
        <p>{message}</p>
        </section>
    );

    const handleCheckout = async (e) => {
        e.preventDefault();

        const stripeUrl = await stripeCheckout(cartData);

        window.location = stripeUrl.redirectUrl;
    };

    useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
        setMessage("Order placed, enjoy!");
        placeOrder();
    }

    if (query.get("cancelled")) {
        setMessage(
        "Order cancelled -- continue to shop around and checkout when you're ready."
        );
    }
    }, []);

    return message ? (
    <Message message={message} />
    ) : (
    <ProductDisplay />
    );
};