const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const store = new session.MemoryStore();
const morgan = require('morgan');
const path = require('path');
const CORS = require('cors');
const passport = require('passport');
const PORT = process.env.PORT || 4001;
const {passportInitialize} = require('./passport.config');
const flash = require('express-flash');
const YOUR_DOMAIN = "http://localhost:3000";

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripe = require('stripe')(process.env.REACT_APP_STRIPE_CLIENT_SECRET);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(morgan('dev'));

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(CORS(corsOptions));

passportInitialize(passport);

app.use(
    session ({
        secret: process.env.SECRET_KEY,
        cookie: { maxAge: 1000*60*60, secure: false },
        saveUninitialized: false,
        resave: false,
        store,
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.post('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
    });
    res.send({ logout: true });
});

app.get('/login', (req, res) => {
    const errorMessage = req.flash('error')[0];
    console.log(errorMessage);
    res.send({ error: errorMessage })
})

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
    }),
    (req, res) => {
        if (req.user) {
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            const user = req.user;
            res.json({ user: user });
        }
    }
);

app.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
    failureRedirect: '/login',
    scope: ['email']
    }),
    function(req, res) {
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
        responseHTML = responseHTML.replace('%value%', JSON.stringify({
            user: req.user
        }));
        res.status(200).send(responseHTML);
    }
);

app.get('/oauth2/redirect/google', passport.authenticate('google', {
    failureRedirect: '/login'
    }),
    function(req, res) {
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
        responseHTML = responseHTML.replace('%value%', JSON.stringify({
            user: req.user
        }));
        res.status(200).send(responseHTML);
    }
);

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express and PostgreSQL API'})
});

const authRouter = require("./routes/auth-routes");
app.use('/auth', authRouter);
const authCheck = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            authenticated: false,
            message: "user has not been authenticated"
        });
    } else {
        next();
    };
};

app.post('/create-checkout-session', async (req, res) => {
    try {
        const stripeSession = await stripe.checkout.sessions.create({
            line_items: req.body,
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/checkout?success=true`,
            cancel_url: `${YOUR_DOMAIN}/checkout?cancelled=true`,
        });

        res.send({ redirectUrl: stripeSession.url });
    } catch (err) {
        console.log(err);
    }
});

app.get("/", authCheck, (req, res) => {
    res.status(200).json({
        authenticated: true,
        message: "user successfully authenticated",
        user: req.user,
        cookies: req.cookies
    });
});

const customersRouter = require('./db/customers/queries_customers');
app.use('/customers', customersRouter);

const productsRouter = require('./db/products/queries_products');
app.use('/products', productsRouter);

const ordersRouter = require('./db/orders/queries_orders');
app.use('/orders', ordersRouter);

// serve swagger
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');

// Serves Swagger API documentation to /docs url
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});