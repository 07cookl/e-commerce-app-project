const express = require('express');
const db = require('./functions_customers');
const customersRouter = express.Router();

customersRouter.get('/', db.getAllCustomers);

customersRouter.get('/:id', db.getCustomerById);

customersRouter.post('/register', db.createNewCustomer);

customersRouter.put('/:id', db.updateCustomerById);

customersRouter.delete('/:id', db.deleteCustomerById);

customersRouter.get('/:id/orders', db.getOrdersByCustomerId);

customersRouter.post('/:id/createOrder', db.createNewOrder);

module.exports = customersRouter;