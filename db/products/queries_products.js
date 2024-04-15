const express = require('express');
const db = require('./functions_products');
const productsRouter = express.Router();

productsRouter.get('/', db.getAllProducts);

productsRouter.get('/:id', db.getProductById);

productsRouter.post('/register', db.createNewProduct);

productsRouter.put('/:id', db.updateProductById);

productsRouter.delete('/:id', db.deleteProductById);

module.exports = productsRouter;