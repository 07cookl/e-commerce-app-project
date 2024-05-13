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

const getOrderByUserId = (req, res) => {
    const id = req.params.id;

    pool.query(
        'SELECT customers.id, orders.id, orders.date, orders.customer_id, customers.email, orders_products.product_id, products.name, orders_products.quantity, products.price AS price_per_unit FROM orders JOIN customers ON orders.customer_id = customers.id JOIN orders_products ON orders.id = orders_products.order_id JOIN products ON orders_products.product_id = products.id WHERE customers.id = $1',
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
    getOrderByUserId
};