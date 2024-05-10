import React from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function CheckoutForm () {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        };

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/checkout",
            },
        });

        if (result.error) {
            console.log(result.error.message);
        } else {
            
        }
    }
    return (
        <form>
            <PaymentElement />
            <button>Submit</button>
        </form>
    )
};
