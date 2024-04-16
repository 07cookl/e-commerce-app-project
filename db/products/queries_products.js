const express = require('express');
const db = require('./functions_products');
const productsRouter = express.Router();

productsRouter.get('/', db.getProducts);

productsRouter.get('/:id', db.getProductById);

module.exports = productsRouter;