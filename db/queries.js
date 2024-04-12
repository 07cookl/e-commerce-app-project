require('dotenv').config();

const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

const getAllCustomers = (req, res) => {
    pool.query(
        'SELECT * FROM customers ORDER BY id ASC',
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).json(results.rows);
        }
    );
};

const getCustomerById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(
        'SELECT * FROM customers WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).json(results.rows);
        }
    );
};

const createNewCustomer = (req, res) => {
    const { username, email, password } = req.body;

    pool.query(
        'INSERT INTO customers (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, password],
        (error, results) => {
            if (error) {
                throw error;
            } else if (!Array.isArray(results.rows) || results.rowCount < 1) {
                throw error;
            };
            res.status(201).send(`New User ${username} created with ID: ${results.rows[0].id}`);
        }
    )
};

const updateCustomerById = (req, res) => {
    const { username, email, password } = req.body;
    const id = req.params.id;

    pool.query(
        'UPDATE customers SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
        [username, email, password, id],
        (error, results) => {
            if (error) {
                throw error;
            };
            if (typeof results.rows == 'undefined') {
                res.status(404).send('Resource not found.');
            } 
            else if (Array.isArray(results.rows) && results.rowCount < 1) {
                res.status(404).send('User Not Found.');
            } else {
                res.status(200).send(`Succesfully updated customer ${username} with ID ${results.rows[0].id}`);
            }
        }
    );
};

const deleteCustomerById = (req, res) => {
    const id = req.params.id;

    pool.query(
        'DELETE FROM customers WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).send(`User ${id} successfully deleted.`)
        }
    );
};

const getAllProducts = (req, res) => {
    pool.query(
        'SELECT * FROM products ORDER BY id ASC',
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).json(results.rows);
        }
    );
};

const getProductById = (req, res) => {
    const id = req.params.id;

    pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).json(results.rows);
        }
    );
};

const createNewProduct = (req, res) => {
    const { name, description, quantity_in_stock, price } = req.body;

    pool.query(
        'INSERT INTO products (name, description, quantity_in_stock, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, quantity_in_stock, price],
        (error, results) => {
            if (error) {
                throw error;
            } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
                throw error;
            };
            res.status(201).send(`Product ${results.rows[0].name} successfully created with id ${results.rows[0].id}`);
        }
    );
};

const updateProductById = (req, res) => {
    const { name, description, quantity_in_stock, price } = req.body;
    const id = req.params.id;

    pool.query(
        'UPDATE products SET name = $1, description = $2, quantity_in_stock = $3, price = $4 WHERE id = $5 RETURNING *',
        [name, description, quantity_in_stock, price, id],
        (error, results) => {
            if (error) {
                throw error;
            };
            if (typeof results.rows == 'undefined') {
                res.status(404).send('Resource not found.');
            } else if (Array.isArray(results.rows) && results.rows.length < 1) {
                res.status(404).send('Product not found.')
            } else {
                res.status(201).send(`Product ${results.rows[0].name} with id ${results.rows[0].id} successfully updated.`)
            };
        }
    );
};

const deleteProductById = (req, res) => {
    const id = req.params.id;

    pool.query(
        'DELETE FROM products WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).send(`Successfully deleted product with ID ${id}`);
        }
    );
};

const getAllOrders = (req, res) => {
    pool.query(
        'SELECT * FROM orders ORDER BY id ASC',
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).json(results.rows);
        }
    );
};

const getOrderByOrderId = (req, res) => {
    const id = req.params.id;

    pool.query(
        'SELECT * FROM orders WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).json(results.rows);
        }
    );
};

const getOrdersByCustomerId = (req, res) => {
    const id = req.params.id;

    pool.query(
        'SELECT * FROM orders WHERE customer_id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).json(results.rows);
        }
    );
};

const createNewOrder = (req, res) => {
    const date = Date.now();
    const customer_id = req.params.id;

    pool.query(
        'INSERT INTO orders (date, customer_id) VALUES ($1, $2) RETURNING *',
        [date, customer_id],
        (error, results) => {
            if (error) {
                throw error;
            } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
                throw error;
            };
            res.status(201).send(`Order successfully placed.`);
        }
    );
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createNewCustomer,
    updateCustomerById,
    deleteCustomerById,
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProductById,
    deleteProductById,
    getAllOrders,
    getOrderByOrderId,
    getOrdersByCustomerId,
    createNewOrder
};