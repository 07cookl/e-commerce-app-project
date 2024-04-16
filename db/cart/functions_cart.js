const { pool } = require('../queries');

const createCart = (customerId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM carts WHERE customer_id = $1',
            [customerId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(results.rows);
                    resolve(results.rows);
                }
            }
        );
    }).then(rows => {
        if (rows.length < 1) {
            pool.query(
                'INSERT INTO carts (customer_id) VALUES ($1) RETURNING *',
                [customerId],
                (error, results) => {
                    if (error) {
                        throw error;
                    };
                    console.log(`New cart created for customer ${results.rows[0].customer_id}`)
                }
            );
        } else {
            console.log('Customer already has a cart.');
        }
    }).catch(error => {
        console.log(error.message);
    })
};

const getCartById = (customerId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM carts JOIN carts_products ON carts.id = carts_products.cart_id JOIN products ON carts_products.product_id = products.id WHERE customer_id = $1',
            [customerId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows);
                }
            }
        );
    });
}

const updateCart = (customerId, productId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM carts WHERE customer_id = $1',
            [customerId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(results.rows);
                    resolve(results.rows);
                }
            }
        );
    }).then(rows => {
        pool.query(
            'INSERT INTO carts_products (cart_id, product_id) VALUES ($1, $2) RETURNING *',
            [rows[0].id, productId],
            (error, results) => {
                if (error) {
                    throw error;
                };
                console.log(`Added product ${productId} to cart`);
            }
        );
    })
};

module.exports = {
    createCart,
    updateCart,
    getCartById
}