const ROUTES = {
    home: () => "/",
    checkout: () => "/checkout",
    error: () => "/error",
    login: () => "/login",
    product: (id) => `/product/${id}`,
    products: () => "/products",
    profile: (id) => `/profile/${id}`,
    register: () => "/register",
};

export default ROUTES;