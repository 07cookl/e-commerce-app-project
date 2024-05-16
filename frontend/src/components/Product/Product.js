import React, { useState, useEffect } from "react";
import { getProduct, addToCart } from "../../api/api";
import styles from "./Product.module.css";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../../app/routes";
import { productImages } from "../../resources/images/products/images";

export default function Product ({ user, setCartData }) {
    const [productData, setProductData] = useState([]);
    const { id } = useParams(); 
    const navigate = useNavigate();

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

    const handleAddToCart = async () => {
        const updatedCart = await addToCart(user.id, id);

        if (updatedCart.authenticated === false) {
            navigate(ROUTES.login());
            return;
        };

        setCartData(updatedCart);
        
        alert(`Added ${productData[0].name} to cart!`);
    };

    return (
        <div>
            {productData.length > 0 ? 
            <section className={styles.container}>
                <div className={styles.product}>
                    <img src={productImages[productData[0].id - 1]} alt={`image of ${productData[0].name}`}/>
                    <div className={styles.productInfo}>
                        <h3>{productData[0].name}</h3>
                        <h5>{'£' + productData[0].price.slice(1)}</h5>
                        <h5>{productData[0].description}</h5>
                    </div>
                </div>
                <button className={styles.cartBtn} onClick={handleAddToCart}>Add to cart</button>
            </section>
            :
            <p>retrieving product data...</p>}
        </div>
    )
};