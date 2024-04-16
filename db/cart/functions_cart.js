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
            'SELECT carts.id, products.name, COUNT(*) AS quantity, products.price, product_id FROM carts JOIN carts_products ON carts.id = carts_products.cart_id JOIN products ON carts_products.product_id = products.id WHERE customer_id = $1 GROUP BY products.name, carts.id, products.price, product_id',
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

const updateCart = async (customerId, productId) => {
    try {
    const cartResults = await pool.query(
        'SELECT * FROM carts WHERE customer_id = $1',
        [customerId]
    );
    const updateResults = await pool.query(
            'INSERT INTO carts_products (cart_id, product_id) VALUES ($1, $2) RETURNING *',
            [cartResults.rows[0].id, productId]
        );
    return updateResults.rows[0];
    } catch (error) {
        throw error;
    };
};

const getTotalPrice = (orderArray) => {
    if (orderArray.length < 1) {
        return 0;
    } else {
        let prices = [];
        orderArray.forEach(row => {
            prices.push(row.price * row.count);
        });
        const totalPrice = prices.reduce((a, b) => a + b);
        return totalPrice;
    }
};

const validatePayment = (totalPrice) => {
    if (totalPrice == 0) {
        resolve('Cart Empty.');
    };

    let checkValidPaymentDetails = true;

    if (!checkValidPaymentDetails) {
        return 'Invalid Payment Details.';
    };
    return;
}

const checkout = async (customerId) => {
    try {
        const rows = await getCartById(customerId);
        const totalPrice = getTotalPrice(rows);
        validatePayment(totalPrice);

        const date = Date.now();
        let orderId;
        const orderInsertResult = await pool.query(
            'INSERT INTO orders (date, customer_id) VALUES (to_timestamp($1 / 1000.0), $2) RETURNING *',
            [date, customerId]
        );
        orderId = orderInsertResult.rows[0].id;

        const orderProductsInsertPromises = rows.map(async (row) => {
            await pool.query(
                'INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
                [orderId, row.product_id, row.quantity]
            );
        });
        await Promise.all(orderProductsInsertPromises);

        await pool.query(
            'DELETE FROM carts WHERE customer_id = $1',
            [customerId]
        );

        return `Order ${orderId} successfully placed.`;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    createCart,
    updateCart,
    getCartById,
    checkout
}