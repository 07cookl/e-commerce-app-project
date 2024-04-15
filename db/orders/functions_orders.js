const { pool } = require('../queries');

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

module.exports = {
    getAllOrders,
    getOrderByOrderId
};