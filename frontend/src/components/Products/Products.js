import React, { useState, useEffect } from "react";
import styles from "./Products.module.css";
import { getProducts } from "../../api/api";

export default function Products () {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const productsData = await getProducts();
            console.log(productsData);
            setProducts(productsData);
        };
        fetchData();
    }, []);

    return (
        <div>
            <p>This is the Products page.</p>
            {products.map((product) => {
                return <p>{product.name}</p>
            })}
        </div>
    )
};