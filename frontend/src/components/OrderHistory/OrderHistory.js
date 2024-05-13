import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrderHistory } from "../../api/api";
import styles from "./OrderHistory.module.css";
import ROUTES from "../../app/routes";

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
        <div>
            {orderHistory ?
            <div>
                {orderHistory.map((order) => (
                    <div>
                        <Link to={ROUTES.product(order.product_id)}>{order.name}</Link>
                        <h5>Quantity: {order.quantity}</h5>
                        <h5>Price: {order.price_per_unit}</h5>
                        <h5>Ordered on: {order.date.slice(0, 10).split("-").reverse().join("/")}</h5>
                    </div>
                ))}
            </div>
            :
            <p>retrieving order history...</p>
            }
        </div>
    )
};