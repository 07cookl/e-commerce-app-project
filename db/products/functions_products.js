const { pool } = require('../queries');

const getProducts = (req, res) => {
    const categoryId = parseInt(req.query.category);

    if (categoryId) {
        pool.query(
            'SELECT * FROM products WHERE category_id = $1',
            [categoryId],
            (error, results) => {
                if (error) {
                    throw error;
                };
                res.status(200).json(results.rows);
            }
        );
        return;
    };

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

module.exports = {
    getProducts,
    getProductById,
};