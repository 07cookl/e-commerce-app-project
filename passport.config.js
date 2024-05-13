const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');
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

            console.log(user);
            
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
        console.log('serializeUser', user, user.id);
        done(null, user.id)
    });

    passport.deserializeUser(async (id, done) => {
        console.log('deserializeUser');
        const user = await getUserById(id);
        return done(null, user);
    })
};

const authCheck = (req, res, next) => {
    console.log('auth check', req.user, req.isAuthenticated());
    if (req.isAuthenticated()) {
        next();
    } else {
        console.log('failed authentication, redirecting to login page');
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