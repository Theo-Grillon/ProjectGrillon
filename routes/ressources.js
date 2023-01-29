const express = require('express');
const path = require('path');
const ress = require(path.join(__dirname,'../model/Ressource.js')); //Appel au modèle associé
const router = express.Router()

//Page /ressource, permet d'ajouter une ressource
router.post('/', function(req, res) {
    res.render("ressource.pug", {title: "Création de Ressource", user: req.session.user});
});

//Page /ressource/created, permet de confirmer la création d'une ressource après envoi du formulaire
router.post('/created', async function(req, res){
    //La variable check vérifie à nouveau la présence de la ressource
    let check = await ress.getResByName(req.body.name);
    if (check[0]==null){ //Si check n'existe pas, ajouter la ressource en BDD
        await ress.insert(req.body.name, req.body.type);
        //Et envoyer sur la page de confirmation
        res.render("ress_conf", {title: "Création réussie.", user: req.session.user, name: req.body.name, type: req.body.type});
    }
    else{ //Sinon envoyer sur la page d'échec de création de ressource
        res.render("ress_fail", {title: "Création échouée.", user:req.session.user, name: req.body.name});
    }
})

//Page /ressource/search, permet la recherche et l'affichage des ressources disponibles
router.post('/search', async function(req, res){
    if(req.body.name==="All"){ // Si on demande toutes les ressources, les afficher toutes
        res.render("res_display", {title: "Résultat de la recherche:", user: req.session.user, res_array: await ress.getAllRes()});
    }
    else { // Sinon, afficher seulement celle recherchée
        res.render("res_display", {
            title: "Ressources enregistrées:",
            user: req.session.user,
            res_array: await ress.getResByName(req.body.name)
        });
    }
})

//Page /ressource/display, permettant l'affichage et la recherche des ressources
router.post('/display', async function(req, res){
    res.render("res_display", {title: "Ressources enregistrées:", user: req.session.user, res_array: await ress.getAllRes()});
})

module.exports = router;