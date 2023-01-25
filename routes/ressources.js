const express = require('express');
const path = require('path');
const ress = require(path.join(__dirname,'../model/Ressource.js'));
const router = express.Router()

router.post('/', function(req, res) {
    res.render("ressource.pug", {title: "Création de Ressource", user: req.session.user});
});

router.post('/created', async function(req, res){
    let check = await ress.getResByName(req.body.name);
    console.log(check);
    if (check==null){
        await ress.insert(req.body.name, req.body.type);
        res.render("ress_conf", {title: "Création réussie.", user: req.session.user, name: req.body.name, type: req.body.type});
    }
    else{
        res.render("ress_fail", {title: "Création échouée.", user:req.session.user, name: req.body.name});
    }
})

module.exports = router;