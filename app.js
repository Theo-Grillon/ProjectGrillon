// modules
require('dotenv').config()
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const session = require("express-session");
const app = express();
const port = process.env.PORT;

const userRouter = require(path.join(__dirname, "routes/users.js"))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'top secret',
    resave: true,
    saveUninitialized: true
}));

// middleware d'authentification
function auth(req, res, next) {
    if (req?.session?.user) {
        return next();
    }
    else {
        return res.sendStatus(401);
    }
}

app.get('/', function(req, res) {
    if(req?.session?.user){
        res.redirect("/home");
    }
    else{
        res.redirect("/login");
    }

});

app.use("/login", userRouter);

app.get('/home', auth, function(req, res) {
    res.render("layout", {title: "Page d'accueil", user : req.session.user});
});

app.post('/logout', function(req, res) {

    req.session.destroy();
    res.redirect("/login");
});

// server start
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
