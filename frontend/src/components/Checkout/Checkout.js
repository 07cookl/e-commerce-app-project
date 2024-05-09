import React, { useState, useEffect } from "react";
import styles from "./Checkout.module.css";
import { getUserCart } from "../../api/api";

export default function Checkout () {
    const [cartData, setCartData] = useState({});
    const id = JSON.parse(localStorage.getItem("user")).id;

    useEffect(() => {
        const getCart = async () => {
            try {
                const cart = await getUserCart(id);
                console.log('checkout: ', cart);
                setCartData(cart);
            } catch (err) {
                console.log(err);
            };
        };
        getCart();
    }, [id]);

    const handleCheckout = () => {
        return;
    };

    return (
        <div>
            {cartData.length > 0 ?
            cartData.map((item) => (
                <p>{item.name}</p>
            ))
        :
        'retrieving cart...'}
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    )
};