const express = require('express');
const db = require('./functions_orders');
const ordersRouter = express.Router();
const { authCheck } = require('../../passport.config');

ordersRouter.get('/', db.getAllOrders);

ordersRouter.get('/:id', db.getOrderByUserId);

module.exports = ordersRouter;