const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const store = new session.MemoryStore();
const morgan = require('morgan');
const CORS = require('cors');
const db = require('./db/customers/functions_customers');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.set("view engine", "ejs");

app.use(morgan('dev'));
app.use(CORS());

app.use(
    session ({
        secret: 'secret',
        cookie: { maxAge: 1000*60*60, secure: false },
        saveUninitialized: false,
        resave: false,
        store,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.getCustomerById(id, function(err, user) {
        if (err) {
            return done(err);
        };
        done(null, user);
    });
});

passport.use(
    new LocalStrategy(function(email, password, done) {
        db.getCustomerByEmail(email, function(err, user) {
            if (err) {
                return done(err);
            };
            if (!user) {
                return done(null, false);
            };
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    })
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post(
    '/login',
    passport.authenticate("local", { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect("profile");
    }
);

app.get('/profile', (req, res) => {
    res.render('profile', { user: req.user });
});

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express and PostgreSQL API'})
});

const customersRouter = require('./db/customers/queries_customers');
app.use('/customers', customersRouter);

const productsRouter = require('./db/products/queries_products');
app.use('/products', productsRouter);

const ordersRouter = require('./db/orders/queries_orders');
app.use('/orders', ordersRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});