const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');
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

function facebookInitialize(passport) {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/auth/facebook/redirect'
        },
        function(accessToken, refreshToken, profile, cb) {
            pool.query('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?',
            ['https://www.facebook.com', profile.id],
            function (err, cred) {
                if (err) {
                    return cb(err);
                };
                if (!cred) {
                    // The Facebook account has not logged into this app before. Create a new user record and link it to the Facebook account.
                    pool.query('INSERT INTO customers (name, email) VALUES (?, ?)',
                    [profile.displayName, profile.emails.value],
                    function (err) {
                        if (err) {
                            return cb(err);
                        };

                        var id = this.lastID;
                        pool.query('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)',
                        [id, 'https://www.facebook.com', profile.id],
                        function (err) {
                            if (err) {
                                return cb(err);
                            };
                            var user = {
                                id: id.toString(),
                                name: profile.displayName
                            };
                            return cb(null, user);
                        });
                    });
                } else {
                    // The Facebook account has previously logged into the app. Get the user record linked to the Facebook account and log the user in.
                    pool.query('SELECT * FROM customers WHERE id = ?',
                    [cred.user_id],
                    function (err, user) {
                        if (err) {
                            return cb(err);
                        };
                        if (!user) {
                            return cb(null, false);
                        };
                        return cb(null, user);
                    });
                }
            }
        )}
    ))
};

module.exports = {
    passportInitialize,
    facebookInitialize,
};