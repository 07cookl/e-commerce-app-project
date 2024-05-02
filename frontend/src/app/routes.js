const ROUTES = {
    home: () => "/",
    checkout: () => "/checkout",
    error: () => "/error",
    login: () => "/login",
    product: (id) => `/product/${id}`,
    products: () => "/products",
    profile: () => `/profile`,
    register: () => "/register",
};

export default ROUTES;