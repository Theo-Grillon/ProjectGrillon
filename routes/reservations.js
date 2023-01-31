const express = require('express');
const path = require('path');
const resa = require(path.join(__dirname,'../model/Reservation.js')); // Appel aux fichiers de modèle
const ress = require(path.join(__dirname, '../model/Ressource.js'));
const usr = require(path.join(__dirname, '../model/User.js'));
const router = express.Router();

//Page /reservation via la méthode 'get', actuellement inutilisée
router.get('/', async function (req, res){
    res.render("reservation", {user: req.session.user, res_array: await ress.getAllRes(), owner: req.session.user});
})

//Page /reservation via la méthode 'post', obtenue via bouton, envoie sur la page de réservation
router.post('/', async function(req, res){
    res.render("reservation", {title: "Réservation", user: req.session.user, res_array: await ress.getAllRes(), owner: req.session.user});
});

//Page /reservation/reserved, via la méthode 'post', accédée après remplissage du formulaire de réservation
router.post('/reserved', async function(req, res){
    //définition des variables utiles
    let owner = await usr.getByNameSurname(req.session.user.firstname, req.session.user.lastname); //Le propriétaire
    let ressources = []; //les ressources
    let used_res = [];
    let check = [] //La variable check permet de vérifier si la réservation est possible
    let start = new Date(req.body.start) //Conversion en objet Date pour être sûr du bon format
    let end = new Date(req.body.end)
    for (let i=0; i<req.body.res.length; i++){ //Pour chaque ressource donnée dans le formulaire
        check.push(await resa.getResaByRessources(req.body.res[i])) //On ajoute les réservations qui les utilisent dans check
        ressources.push(req.body.res[i]); //On les ajoute également dans le futur tableau de ressources à réserver
    }
    for (let i = 0; i<check.length; i++){ //Pour chaque réservation utilisant les mêmes ressources
        for (let j = 0; j<check[i].length; j++){
            if ((check[i][j].start_date<=start && check[i][j].end_date >= start) || (check[i][j].start_date<=end && check[i][j].end_date >= end)){ //On vérifie si la date de fin de réservation arrive après la date à laquelle la nouvelle réservation doit commencer
                used_res = check[i][j].ressources; //Si c'est le cas, on indique les ressources utilisées par la réservation existante
                //Avant d'envoyer sur la page d'échec de réservation
                return res.render("resa_fail", {title: "Echec de la réservation", user: req.session.user, res_array: used_res})
            } //Sinon rien ne se passe
        }
    }
    //Insertion de la réservation dans la BDD
    await resa.insert(start, end, ressources, owner.login);
    await usr.addReservation(owner.login) //Incrémentation du nombre de réservations par l'utilisateur à l'origine
    let date_start = req.body.start.split('-'); //Ces dates servent à calculer le temps de réservation
    let date_end = req.body.end.split('-');
    let day_span = new Date(new Date(date_end[0], date_end[1], date_end[2]).getTime() - new Date(date_start[0], date_start[1], date_start[2]).getTime())
    //Envoi sur la page de confirmation de réservation
    res.render("reservation_conf", {title: "Confirmation de Réservation",user: req.session.user, nb_res: ressources.length, days: (day_span.getUTCDate()-1)});
})

//Page /reservation/display, via la méthode 'post', affiche les réservations existantes
router.post("/display", async function(req, res){
    res.render("resa_display", {title: "Liste des réservations", user: req.session.user, resa_array: await resa.getAll()});
})

module.exports = router;