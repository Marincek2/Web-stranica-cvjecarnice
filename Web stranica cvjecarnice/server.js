//uvoz modula
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg')
const db = require('./db')
const fs = require('fs');
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const cart = require('./models/CartModel')
const userData = require('./models/UserData.js')

//uvoz modula s definiranom funkcionalnosti ruta
const homeRouter = require('./routes/home.routes');
const orderRouter = require('./routes/order.routes');
const loginRoute = require('./routes/login.routes');
const logoutRoute = require('./routes/logout.routes');
const signupRoute = require('./routes/signup.routes');
const cartRoute = require('./routes/cart.routes');
const userRoute = require('./routes/user.routes');
const checkoutRoute = require('./routes/checkout.routes');

//middleware - predlošci (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware - statički resursi
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.json());

//middleware - dekodiranje parametara
app.use(express.urlencoded({ extended: true }));

//middleware - upravljanje sjednicama (+ trajne sjednice u bazi podataka)
//ZADATAK: postaviti express-sessions midlleware, trajnost sjedničkog kolačića 1 dan,
//pohrana sjednica u postgres bazu korštenjem connect-pg-simple modula
app.use(session({
    store: new pgSession( { pool: db.pool } ),
    secret: "tajna",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 dan
    }
  })
);

app.users = new userData('users.json');
app.users.initialize(true);

// middleware za mapiranje kosarice usera
app.use(function(req, res, next){
    if(req.session.user != undefined){
        if(!req.app.users.userExists(req.session.user.user_name)){
            req.app.users.createUser(req.session.user.user_name);
            req.app.users.store();
        }
        req.session.cart = req.app.users.getUser(req.session.user.user_name).cart;
    }
    next();
});

//definicija ruta
app.use('/', homeRouter);
app.use('/order', orderRouter);
app.use('/login', loginRoute)
app.use('/logout', logoutRoute)
app.use('/signup', signupRoute)
app.use('/cart', cartRoute)
app.use('/user', userRoute)
app.use('/checkout', checkoutRoute)

//pokretanje poslužitelja na portu 3000
app.listen(3000);
