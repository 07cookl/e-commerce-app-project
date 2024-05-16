const ROUTES = {
    home: () => "/",
    checkout: () => "/checkout",
    login: () => "/login",
    product: (id) => `/product/${id}`,
    products: () => "/products",
    profile: () => `/profile`,
    register: () => "/register",
};

export default ROUTES;