const API_ENDPOINT = "http://localhost:4001";

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
            }
        });

        const newUser = await response.json();

        const jsonResponse = JSON.stringify(newUser.user);

        localStorage.setItem('user', jsonResponse);

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

        return user.user;
    } catch (err) {
        console.log(err);
    };
};

// export const facebookLogin = () => {
//     return new Promise((resolve, reject) => {
//         const authWindow = window.open('http://localhost:4001/auth/login/federated/facebook',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
//         window.addEventListener('message', (message) => {
//             const data = message.data.user;
//             const jsonData = JSON.stringify(message.data.user);
//             localStorage.setItem("user", jsonData);
//             // if (authWindow.closed) {
//                 console.log(data);
//                 resolve(data);
//             // };
//         });
//     })
// };

export const facebookLogin = () => {
    return new Promise((resolve, reject) => {
        const handleMessage = (message) => {
            let data = message.data.user;
            if (data) {
                if (data.name) {
                    data = {
                        ...data,
                        username: data.name
                    };
                };
                const jsonData = JSON.stringify(data);
                localStorage.setItem("user", jsonData);
                resolve(data);
            } else {
                reject("User data not received from Facebook login.");
            }
        };

        const authWindow = window.open('http://localhost:4001/auth/login/federated/facebook',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
        
        // Add event listener
        window.addEventListener('message', handleMessage);

        // Function to remove event listener
        const removeEventListener = () => {
            window.removeEventListener('message', handleMessage);
        };

        // Check if the window is closed
        const checkWindowClosed = setInterval(() => {
            if (authWindow.closed) {
                clearInterval(checkWindowClosed); // Stop checking
                removeEventListener(); // Remove the event listener
            }
        }, 500); // Check every second
    });
};

export const googleLogin = () => {
    return new Promise((resolve, reject) => {
        const handleMessage = (message) => {
            let data = message.data.user;
            if (data) {
                if (data.name) {
                    data = {
                        ...data,
                        username: data.name
                    };
                };
                const jsonData = JSON.stringify(data);
                localStorage.setItem("user", jsonData);
                resolve(data);
            } else {
                reject("User data not received from Google login.");
            }
        };

        const authWindow = window.open('http://localhost:4001/auth/login/federated/google',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
        
        // Add event listener
        window.addEventListener('message', handleMessage);

        // Function to remove event listener
        const removeEventListener = () => {
            window.removeEventListener('message', handleMessage);
        };

        // Check if the window is closed
        const checkWindowClosed = setInterval(() => {
            if (authWindow.closed) {
                clearInterval(checkWindowClosed); // Stop checking
                removeEventListener(); // Remove the event listener
            }
        }, 500); // Check every second
    });
};

export const logout = async () => {
    const response = await fetch(`${API_ENDPOINT}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    });

    const jsonResponse = await response.json();
    return jsonResponse;
};

export const getProducts = async () => {
    const response = await fetch(`${API_ENDPOINT}/products`);

    const allProducts = await response.json();

    return allProducts;
};