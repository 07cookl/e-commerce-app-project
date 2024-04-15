const { pool } = require('../queries');

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

module.exports = {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProductById,
    deleteProductById
};