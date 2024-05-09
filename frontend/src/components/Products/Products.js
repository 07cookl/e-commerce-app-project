import React, { useState, useEffect } from "react";
import ROUTES from "../../app/routes";
import styles from "./Products.module.css";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/api";

export default function Products () {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const productsData = await getProducts();
            setProducts(productsData);
        };
        fetchData();
    }, []);

    return (
        <div>
            <p>This is the Products page.</p>
            {products.map((product, index) => (
                <Link to={ROUTES.product(product.id)} key={index}>
                    {product.name}
                </Link>
            ))}
        </div>
    )
};