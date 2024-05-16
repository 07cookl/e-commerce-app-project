import React from "react";
import styles from "./LandingPage.module.css";

export default function LandingPage () {
    return (
        <section className={styles.container}>
            <h1>Welcome!</h1>
            <h3>Thanks for visiting my project.</h3>
            <p>This is a simply-styled, fully-functional e-commerce site built with PostgreSQL, Express, React and Node.</p>
            <p>You can create an account, or sign in with Google or Facebook, then add products to your basket before checking out. Your order history can then be viewed on your profile page. Test card details are provided for the checkout process.</p>
            <p>Please take a look around the site and feel free to get in touch at <a href="mailto:laurencecook80@hotmail.co.uk">laurencecook80@hotmail.co.uk</a> or reach out on <a href="https://www.linkedin.com/in/laurence-cook-626bb725b">LinkedIn</a>.</p>
        </section>
    )
};