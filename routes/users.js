const express = require('express');
const path = require('path');
const users = require(path.join(__dirname,'../model/User.js'));
const router = express.Router()

router.get('/', function(req, res) {
    console.log("login");
    res.render("login", {title: "Connexion"});
});

router.post('/', async function(req, res) {

    let usr = await users.getByLoginPwd(req.body.login, req.body.password);
    req.session.user = { firstname : usr[0].name, lastname : usr[0].surname};
    res.redirect("/home");
});

module.exports = router;