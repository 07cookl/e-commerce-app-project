const API_ENDPOINT = "http://localhost:4001";

export const registerUser = async (email, username, password) => {
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

    return newUser;
}

export const getProducts = async () => {
    const response = await fetch(`${API_ENDPOINT}/products`);

    const allProducts = await response.json();

    return allProducts;
};