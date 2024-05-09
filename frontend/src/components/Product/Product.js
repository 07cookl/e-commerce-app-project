import React, { useState, useEffect } from "react";
import { getProduct } from "../../api/api";
import styles from "./Product.module.css";
import { useParams } from "react-router-dom";

export default function Product () {
    const [productData, setProductData] = useState({});
    const { id } = useParams(); 

    useEffect(() => {
        const getProductData = async () => {
            try {
                const product = await getProduct(id);
                setProductData(product);
            } catch (err) {
                console.log(err);
            };
        };
        getProductData();
    }, [id]);

    const handleAddToCart = () => {
        return;
    }

    return (
        <div>
            {productData ? 
            <section>
            <h1>{productData.name}</h1>
            <h3>{productData.price}</h3>
            <p>{productData.description}</p>
            <button onClick={handleAddToCart}>Add to cart</button>
            </section>
            :
            <p>retrieving product data...</p>}
        </div>
    )
};