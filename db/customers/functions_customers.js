const { pool } = require('../queries');
const bcrypt = require('bcrypt');

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
    pool.query(
        'SELECT * FROM customers WHERE id = $1',
        [req.params.id],
        (error, results) => {
            if (error) {
                throw error;
            };
            res.status(200).json(results.rows[0]);
        }
    );
};

const serializeCustomer = (id, callback) => {
    pool.query(
        'SELECT * FROM customers WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                return callback(error, null);
            };
            const user = results.rows[0];
            return callback(null, user);
        }
    );
};

const getCustomerByEmail = (email) => {
    return new Promise ((resolve, reject) => {
        pool.query(
            'SELECT * FROM customers WHERE email = $1',
            [email],
            (error, results) => {
                if (error) {
                    reject(error);
                };
                resolve(results.rows);
            }
        );
    })
};

const createNewCustomer = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await getCustomerByEmail(email);

        if (user.length > 0) {
            console.log('User already exists');
            return res.redirect('login');
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        pool.query(
            'INSERT INTO customers (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword],
            (error, results) => {
                if (error) {
                    throw error;
                } else if (!Array.isArray(results.rows) || results.rowCount < 1) {
                    throw error;
                };
                res.status(201).send(results.rows[0]);
            }
        );
    } catch (err) {
        res.status(500).json({ message: err });
    };
};

const updateCustomerById = async (req, res) => {
    const { username, email, password } = req.body;
    const id = req.params.id;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        pool.query(
            'UPDATE customers SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
            [username, email, hashedPassword, id],
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
    } catch (err) {
        res.status(500).json({ message: err });
    }
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
    const customer_id = req.user.id;

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
    serializeCustomer,
    getCustomerByEmail,
    createNewCustomer,
    updateCustomerById,
    deleteCustomerById,
    getOrdersByCustomerId,
    createNewOrder
};