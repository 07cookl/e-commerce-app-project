import React, { useState, useEffect } from "react";
import ROUTES from "../../app/routes";
import styles from "./Products.module.css";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/api";
import { productImages } from "../../resources/images/products/images";
import Loader from "../../resources/styles/Loader";

export default function Products () {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            // await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds to test loader
            // console.log('delayed');
            const productsData = await getProducts();
            setProducts(productsData);
        };
        fetchData();
    }, []);

    return (
        <>
        {products.length > 0 ? 
        <section className={styles.container}>
            {products.map((product, index) => (
                <Link className={styles.product} to={ROUTES.product(product.id)} key={index}>
                    <img src={productImages[product.id - 1]}/>
                    <div className={styles.productInfo}>
                        <h3>{product.name}</h3>
                        <h5>{'£' + product.price.slice(1)}</h5>
                    </div>
                </Link>
            ))}
            <p className={styles.imageCredits}>Iron Man photo by <a href="https://unsplash.com/@igorbumba?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Igor Bumba</a> on <a href="https://unsplash.com/photos/a-close-up-of-a-hand-with-a-light-on-it-rkaahInFlBg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
            Captain America photo by <a href="https://unsplash.com/@niftyartofficial1_?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">N I F T Y A R T ✍🏻</a> on <a href="https://unsplash.com/photos/captain-america-shield-9HnSQn4TVEg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
            Thor photo by <a href="https://unsplash.com/@wacalke?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Mateusz Wacławek</a> on <a href="https://unsplash.com/photos/Tu5cVkWhZXQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
            LARPing photo by <a href="https://unsplash.com/@joetara?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Joseph Ogbonnaya</a> on <a href="https://unsplash.com/photos/a-woman-holding-a-bow-and-arrow-in-a-park-Y0O__TFDOCw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
            Hulk photo by <a href="https://unsplash.com/@gabrielrana?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Gabriel Tovar</a> on <a href="https://unsplash.com/photos/green-and-black-action-figure-oTKanDGugaA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
            Loading icon from Uiverse.io by Nawsome</p>
        </section>
        :
        <section className={styles.container}>
            <h2>The free database feature on Render, where this site is hosted, takes up to a minute to spin up. Please be patient whilst it starts, and enjoy the project once it's done!</h2>
            <Loader />
        </section>}
        </>
    )
};