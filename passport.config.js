const LocalStrategy = require('passport-local');
const { pool } = require('./db/queries');
const bcrypt = require('bcrypt');
const { getUserById } = require('./db/customers/functions_customers');

function passportInitialize(passport) {
    const authenticateUser = async (email, password, done) => {

        try {
            const user = await new Promise((resolve, reject) => {
                pool.query(
                    'SELECT * FROM customers WHERE email = $1',
                    [email],
                    (error, results) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(results.rows[0]);
                        };
                    }
                );
            });
            
            if (user == undefined) {
                return done(null, false, { message: 'No user with that email' });
            };

            const comparePassword = await bcrypt.compare(password, user.password)

            if (comparePassword) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (err) {
            return done(err);
        };
    }

    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        return done(null, user);
    })
};

const authCheck = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({
            authenticated: false,
            message: "user has not been authenticated"
        });
    };
};

module.exports = {
    passportInitialize,
    authCheck
};