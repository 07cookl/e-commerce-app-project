const express = require('express');
const router = express.Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const GoogleStrategy = require('passport-google-oidc');
const FacebookStrategy = require('passport-facebook');
const { pool } = require('../db/queries');
require('dotenv').config();

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(404).json({
        success: false,
        message: "user failed to authenticate."
    });
});

router.post("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
    });
    res.send({ logout: true });
});

// router.get("/facebook", passport.authenticate("facebook"));

router.get('/login', function(req, res, next) {
    res.send({ user: req.user });
});

router.get('/login/federated/google', passport.authenticate('google'));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/oauth2/redirect/google',
    scope: [ 'profile', 'https://www.googleapis.com/auth/userinfo.email' ]
}, function verify(issuer, profile, cb) {
    console.log('googleStrategy', issuer, profile, cb);
    pool.query('SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2', [
        issuer,
        profile.id
    ], function (err, row) {
        if (err) {
            return cb(err);
        };
        if (row.rowCount < 1) {
            pool.query('INSERT INTO customers (id, username, email) VALUES ($1, $2, $3)', [
                profile.id,
                profile.displayName,
                profile.emails[0].value
            ], function(err) {
                console.log('googleStrategy no row in federated credentials', profile.id, profile.displayName);
                if (err) {
                    console.log('googleStrategy no row first error', err);
                    return cb(err);
                };
                pool.query('INSERT INTO federated_credentials (provider, subject) VALUES ($1, $2)', [
                    issuer,
                    profile.id
                ], function (err) {
                    console.log('googleStrategy inserting row into federated credentials');
                    if (err) {
                        return cb(err);
                    };
                    const user = {
                        id: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    };
                    console.log('googleStrategy no row created user ', user);
                    return cb(null, user);
                })
            })
        } else {
            pool.query('SELECT * FROM customers WHERE id = $1', [ profile.id ], function(err, row) {
                console.log('googleStrategy selecting user from customers using credentials id');
                if (err) {
                    return cb(err);
                };
                if (!row) {
                    return cb(null, false);
                };
                return cb(null, row.rows[0]);
            });
        }
    });
}));

router.get('/login/federated/facebook', passport.authenticate('facebook', { scope: ['email'] }));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/oauth2/redirect/facebook',
    profileFields: ['id', 'displayName']
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log('facebookStrategy', profile, cb);
        pool.query('SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2',
        ['https://www.facebook.com', profile.id],
        function (err, row) {
            if (err) {
                return cb(err);
            };
            if (row.rowCount < 1) {
                // The Facebook account has not logged into this app before. Create a new user record and link it to the Facebook account.
                pool.query('INSERT INTO customers (id, username) VALUES ($1, $2)',
                [profile.id, profile.displayName],
                function (err) {
                    console.log('facebookStrategy no row in federated credentials', profile.id, profile.displayName);
                    if (err) {
                        console.log('facebookStrategy no row first error', err);
                        return cb(err);
                    };
                    pool.query('INSERT INTO federated_credentials (provider, subject) VALUES ($1, $2)',
                    ['https://www.facebook.com', profile.id],
                    function (err) {
                        console.log('facebookStrategy inserting row into federated credentials');
                        if (err) {
                            return cb(err);
                        };
                        var user = {
                            id: profile.id,
                            name: profile.displayName,
                        };
                        console.log('facebookStrategy no row created user ', user);
                        return cb(null, user);
                    });
                });
            } else {
                // The Facebook account has previously logged into the app. Get the user record linked to the Facebook account and log the user in.
                pool.query('SELECT * FROM customers WHERE id = $1',
                [profile.id],
                function (err, row) {
                    console.log('facebookStrategy selecting user from customers using credentials id');
                    if (err) {
                        return cb(err);
                    };
                    if (!row) {
                        return cb(null, false);
                    };
                    return cb(null, row.rows[0]);
                });
            }
        }
    )}
))

module.exports = router;