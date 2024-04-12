const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db/queries');
const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express and PostgreSQL API'})
});

app.get('/customers', db.getAllCustomers);
app.get('/customers/:id', db.getCustomerById);
app.post('/customers/register', db.createNewCustomer);
app.put('/customers/:id', db.updateCustomerById);
app.delete('/customers/:id', db.deleteCustomerById);

app.get('/products', db.getAllProducts);
app.get('/products/:id', db.getProductById);
app.post('/products/register', db.createNewProduct);
app.put('/products/:id', db.updateProductById);
app.delete('/products/:id', db.deleteProductById);

app.get('/orders', db.getAllOrders);
app.get('/orders/:id', db.getOrderByOrderId);
app.get('/customers/:id/orders', db.getOrdersByCustomerId);
app.post('/customers/:id/createOrder', db.createNewOrder);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});