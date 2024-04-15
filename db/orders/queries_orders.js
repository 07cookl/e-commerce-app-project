const express = require('express');
const db = require('./functions_orders');
const ordersRouter = express.Router();

ordersRouter.get('/', db.getAllOrders);

ordersRouter.get('/:id', db.getOrderByOrderId);

module.exports = ordersRouter;