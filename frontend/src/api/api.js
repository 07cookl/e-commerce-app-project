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

export const facebookLogin = async () => {
    try {
        const response = await fetch(`${API_ENDPOINT}/login/facebook`);
        console.log(response);
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (err) {
        console.log(err);
    };
};

export const googleLogin = () => {
    return new Promise((resolve, reject) => {
        window.open('http://localhost:4001/auth/login/federated/google',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
        window.addEventListener('message', (message) => {
            const data = message.data.user;
            const jsonData = JSON.stringify(message.data.user);
            localStorage.setItem("user", jsonData);
            resolve(data);
        });

    })
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