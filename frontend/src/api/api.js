// const API_ENDPOINT = "http://localhost:4001";
const API_ENDPOINT = "https://zero7cookl-e-commerce.onrender.com";

export const registerUser = async (email, username, password) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/customers/register`, {
            method: "POST",
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const newUser = await response.json();

        const jsonResponse = JSON.stringify(newUser.user);

        localStorage.setItem('user', jsonResponse);

        await login(newUser.user.email, password);

        return newUser.user;
    } catch (err) {
        throw err;
    };
}

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/login`, {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            credentials: "include",
        });

        const user = await response.json();

        if (user.error) {
            console.log(user.error);
            return { error: user.error };
        }

        const jsonResponse = JSON.stringify(user.user);

        localStorage.setItem('user', jsonResponse);

        const id = user.user.id;

        await fetch(`${API_ENDPOINT}/customers/${id}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        return user.user;
    } catch (err) {
        console.log(err);
    };
};

export const facebookLogin = () => {
    return new Promise((resolve, reject) => {
        let data;
        const handleMessage = async (message) => {
            data = message.data.user;
            if (data) {
                if (data.name) {
                    data = {
                        ...data,
                        username: data.name
                    };
                };
            }
        };

        const authWindow = window.open(`${API_ENDPOINT}/auth/login/federated/facebook`,"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
        
        window.addEventListener('message', handleMessage);

        const removeEventListener = () => {
            window.removeEventListener('message', handleMessage);
        };

        const checkWindowClosed = setInterval(async () => {
            if (authWindow.closed) {
                clearInterval(checkWindowClosed);
                removeEventListener();
                if (data) {
                    const jsonData = JSON.stringify(data);
                    localStorage.setItem("user", jsonData);
    
                    await fetch(`${API_ENDPOINT}/customers/${data.id}/cart`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
                    resolve(data)
                } else {
                    reject("User data not received from Facebook Login");
                };
            }
        }, 500);
    });
};

export const googleLogin = () => {
    return new Promise((resolve, reject) => {
        let data;
        const handleMessage = async (message) => {
            data = message.data.user;
            if (data) {
                if (data.name) {
                    data = {
                        ...data,
                        username: data.name
                    };
                };
            }
        };

        const authWindow = window.open(`${API_ENDPOINT}/auth/login/federated/google`,"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
        
        window.addEventListener('message', handleMessage);

        const removeEventListener = () => {
            window.removeEventListener('message', handleMessage);
        };

        const checkWindowClosed = setInterval(async() => {
            if (authWindow.closed) {
                clearInterval(checkWindowClosed);
                removeEventListener();
                if (data) {
                    const jsonData = JSON.stringify(data);
                    localStorage.setItem("user", jsonData);
                    
                    await fetch(`${API_ENDPOINT}/customers/${data.id}/cart`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
                    resolve(data)
                } else {
                    reject("User data not received from Google Login");
                };
            }
        }, 500);
    });
};

export const logout = async () => {
    const response = await fetch(`${API_ENDPOINT}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const jsonResponse = await response.json();
    return jsonResponse;
};

export const getProducts = async () => {
    const response = await fetch(`${API_ENDPOINT}/products`);

    const allProducts = await response.json();
    return allProducts;
};

export const getProduct = async (id) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/products/${id}`);

        const productData = await response.json();

        const stringResponse = JSON.stringify(productData);
        localStorage.setItem("product", stringResponse);

        return productData;
    } catch (err) {
        console.log('Error retreving product data: ', err);
    };
};

export const getUserCart = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;

    try {
        const response = await fetch(`${API_ENDPOINT}/customers/${userId}/cart`, {
            credentials: "include",
        });
        const cartData = await response.json();

        const stringResponse = JSON.stringify(cartData);
        localStorage.setItem("cart", stringResponse);

        return cartData;
    } catch (err) {
        console.log('Error retrieving cart: ', err);
    }
};

export const addToCart = async (userId, productId) => {
    try {
        await fetch(`${API_ENDPOINT}/customers/${userId}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const response = await fetch(`${API_ENDPOINT}/customers/${userId}/cart`, {
            method: "PUT",
            body: JSON.stringify({
                productId: productId
            }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        });

        const jsonResponse = await response.json();
        const stringResponse = JSON.stringify(jsonResponse);
        localStorage.setItem("cart", stringResponse);

        return jsonResponse;
    } catch (err) {
        console.log('Error adding to cart: ', err)
    }
};

export const stripeCheckout = async (cartData) => {
    const stripeProductData = [];

    cartData.forEach(item => {
        stripeProductData.push({
            price: item.price_code,
            quantity: item.quantity
        })
    });

    try {
        const response = await fetch(`${API_ENDPOINT}/create-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(stripeProductData),
            credentials: "include",
        });

        const jsonResponse = response.json()

        return jsonResponse;
    } catch (err) {
        console.log('Error checking out: ', err);
    }
};

export const placeOrder = async () => {
    const id = JSON.parse(localStorage.getItem("user")).id;

    await fetch(`${API_ENDPOINT}/customers/${id}/cart/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
    });

    return;
};

export const getOrderHistory = async () => {
    const id = JSON.parse(localStorage.getItem("user")).id;

    const orderHistory = await fetch(`${API_ENDPOINT}/orders/${id}`, {
        credentials: "include",
    });

    const jsonOrderHistory = orderHistory.json();

    return jsonOrderHistory;
}
