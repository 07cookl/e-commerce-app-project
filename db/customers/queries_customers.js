const express = require('express');
const db = require('./functions_customers');
const cartDb = require('../cart/functions_cart');
const { authCheck } = require('../../passport.config');
const customersRouter = express.Router();

customersRouter.get('/', db.getAllCustomers);

customersRouter.get('/:id', db.getCustomerById);

customersRouter.post('/register', db.createNewCustomer);

customersRouter.put('/:id', db.updateCustomerById);

customersRouter.delete('/:id', db.deleteCustomerById);

customersRouter.post('/:id/cart', authCheck, (req, res) => {
    const newCart = cartDb.createCart(req.params.id);
    res.status(201).send(newCart);
});

customersRouter.put('/:id/cart', authCheck, async (req, res) => {
    const updatedCart = await cartDb.updateCart(req.params.id, req.body.productId);
    res.status(201).json(updatedCart);
});

customersRouter.get('/:id/cart', authCheck, (req, res) => {
    cartDb.getCartById(req.params.id)
        .then(cart => {
            res.status(200).json(cart);
        })
        .catch(error => {
            res.send({ cartExists: false });
        });
});

customersRouter.post('/:id/cart/checkout', authCheck, async (req, res) => {
    const orderPlaced = await cartDb.checkout(req.params.id);
    res.status(201).json(orderPlaced);
});

module.exports = customersRouter;