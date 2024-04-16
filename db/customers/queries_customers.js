const express = require('express');
const db = require('./functions_customers');
const cartDb = require('../cart/functions_cart');
const customersRouter = express.Router();

customersRouter.get('/', db.getAllCustomers);

customersRouter.get('/:id', db.getCustomerById);

customersRouter.post('/register', db.createNewCustomer);

customersRouter.put('/:id', db.updateCustomerById);

customersRouter.delete('/:id', db.deleteCustomerById);

customersRouter.get('/:id/orders', db.getOrdersByCustomerId);

customersRouter.post('/:id/createOrder', db.createNewOrder);

customersRouter.post('/:id/cart', (req, res) => {
    cartDb.createCart(req.params.id);
    res.status(201).send('Cart created.');
});

customersRouter.put('/:id/cart', (req, res) => {
    const updatedCart = cartDb.updateCart(req.params.id, req.query.productId);
    res.status(201).json(updatedCart);
});

customersRouter.get('/:id/cart', (req, res) => {
    cartDb.getCartById(req.params.id)
        .then(cart => {
            console.log('Cart:', cart);
            res.status(200).json(cart);
        })
        .catch(error => {
            console.log(error.message);
        });
});

module.exports = customersRouter;