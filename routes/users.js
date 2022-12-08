const express = require('express');
const path = require('path');
const users = require(path.join(__dirname,'../model/User.js'));
const router = express.Router()

router.get('/', function(req, res) {
    console.log("login");
    res.render("login", {title: "Connexion"});
});

router.post('/', async function(req, res) {

    // Utilisateur fake ici
    // TODO : aller chercher l'utilisateur en base de données à partir du login et du (hash du) mot de passe

    let usrs = users.getByLoginPwd(req.body.login, req.body.password);
    console.log(usrs)
    req.session.user = { firstname : "Jean", lastname : "Dupond"};
    res.redirect("/home");
});

module.exports = router;