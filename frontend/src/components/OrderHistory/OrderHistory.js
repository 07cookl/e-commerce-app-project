import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrderHistory } from "../../api/api";
import styles from "./OrderHistory.module.css";
import ROUTES from "../../app/routes";
import { productImages } from "../../resources/images/products/images";

export default function OrderHistory () {
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        const getOrderData = async () => {
            try {
                const orderData = await getOrderHistory();
                setOrderHistory(orderData);
            } catch (err) {
                console.log(err);
            };
        };
        getOrderData();
    }, []);

    return (
        <section className={styles.container}>
            <h1>Your past orders:</h1>
            { orderHistory.length > 0 ? 
                orderHistory.map((product, index) => (
                    <div>
                        <Link className={styles.product} to={ROUTES.product(product.product_id)} key={index}>
                            <img src={productImages[product.product_id - 1]} alt={`image of ${product.name}`}/>
                            <div className={styles.productInfo}>
                                <h3>{product.name}</h3>
                                <h5>Quantity: {product.quantity}</h5>
                                <h5>Price: {'£' + product.price_per_unit.slice(1)}</h5>
                                <h5>Ordered on: {product.date.slice(0, 10).split("-").reverse().join("/")}</h5>
                            </div>
                        </Link>
                    </div>
                ))
                :
                    <h5>No order history to display... yet!</h5>
            }
        </section>
        
    )
};