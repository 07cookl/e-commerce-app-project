import React, { useState, useEffect } from "react";
import ROUTES from "../../app/routes";
import styles from "./Checkout.module.css";
import { getUserCart, placeOrder, stripeCheckout } from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { productImages } from "../../resources/images/products/images";

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
        <section className={styles.container}>
            <h1>Your basket:</h1>
            {cartData.length > 0 ? 
            cartData.map((product) => (
                <Link className={styles.product} to={ROUTES.product(product.product_id)}>
                    <img src={productImages[product.product_id - 1]}/>
                    <div className={styles.productInfo}>
                        <h3>{product.name}</h3>
                        <h5>Quantity: {product.quantity}</h5>
                        <h5>{'£' + product.price.slice(1)}</h5>
                    </div>
                </Link>
            ))
            :
            <h5>Add products to your cart before checking out</h5>}

            <form onSubmit={handleCheckout}>
                <button className={styles.checkoutBtn} type="submit">
                Checkout
                </button>
            </form>

            <div className={styles.cardDetails}>
                <h1>Please use these fake details for purchases:</h1>
                <h5>Card Number: 4242 4242 4242 4242</h5>
                <h5>Expiry Date: Any future date</h5>
                <h5>Security Code: Any three digit number</h5>
                <h5>Address: Any valid address</h5>
            </div>
        </section>
    );

    const Message = ({ message }) => (
        <section className={styles.container}>
        <h1>{message}</h1>
        </section>
    );

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (cartData.length < 1) {
            return;
        }

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