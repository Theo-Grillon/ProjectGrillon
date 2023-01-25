const express = require('express');
const path = require('path');
const users = require(path.join(__dirname,'../model/User.js'));
const router = express.Router()

router.get('/login', function(req, res) {
    console.log("login");
    res.render("login", {title: "Connexion"});
});

router.post('/login', async function(req, res) {

    let usr = await users.getByLoginPwd(req.body.login, req.body.password);
    if (usr[0]!==undefined) {
        req.session.user = {firstname: usr[0].name, lastname: usr[0].surname, is_admin: usr[0].is_admin};
        res.redirect("/home");
    }
    else{
        res.statusCode = 401;
        res.end()
    }
});

router.post('/display', async function(req, res){
    res.render("usr_display", {title: "Résultat de la recherche:", user: req.session.user, usr_array: await users.getByLogin(req.body.log)});
})

module.exports = router;