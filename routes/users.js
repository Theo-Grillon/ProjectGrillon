const express = require('express');
const path = require('path');
const users = require(path.join(__dirname,'../model/User.js')); //Appel du modèle associé
const router = express.Router()

//Page /user/login, permettant la connexion et servant d'accueil si déconnecté
router.get('/login', function(req, res) {
    console.log("login");
    res.render("login", {title: "Connexion"});
});

//Page /user/login, via la méthode post, après avoir donné les informations de connexion
router.post('/login', async function(req, res) {
    //Usr remplit le rôle de check des autres routeurs, il sert à vérifier si l'utilisateur est dans la BDD
    let usr = await users.getByLoginPwd(req.body.login, req.body.password);
    if (usr!==undefined) { //Si l'utilisateur existe, le connecter et l'envoyer à l'accueil
        req.session.user = {firstname: usr.name, lastname: usr.surname, is_admin: usr.is_admin, login: usr.login};
        res.redirect("/home");
    }
    else{ //Sinon, erreur 401
        res.statusCode = 401;
        res.end()
    }
});

//Page /user/register, via la méthode 'get', utilisée en cas d'inscription d'un utilisateur déjà existant (voir plus bas)
router.get('/register', function(req, res){
    res.render("register", {title: "Erreur: identifiant déjà utilisé."})
})

//Page /user/register, via la méthode 'post', utilisée lorsque l'on demande à inscrire un nouvel utilisateur
router.post("/register", async function(req, res){
    res.render("register", {title: "Inscription"})
})

//Page /user/search, servant à rechercher les utilisateurs
router.post('/search', async function(req, res){
    res.render("usr_display", {title: "Recherche d'utilisateur:", user: req.session.user, usr_array: []})
})

//Page /user/display, servant à afficher les utilisateurs recherchés, tout en laissant la possibilité d'effectuer de nouvelles recherches
router.post('/display', async function(req, res){
    //Si on demande tous les utilisateurs, les afficher tous
    if(req.body.login==="All"){
        res.render("usr_display", {title: "Résultat de la recherche:", user: req.session.user, usr_array: await users.getAll()});
    }
    else{ // Sinon
        if(req.body.is_admin === "true"){ //Si l'administrateur a décidé d'élever les droits de l'utilisateur
            await users.makeAdmin(req.body.login, true); //Le passer admin
        }
        if(req.body.is_admin === "false"){ //Si l'administrateur a décidé de retirer les droits
            await users.makeAdmin(req.body.login, false); //Les retirer
        }//Afficher ensuite les utilisateurs avec le pseudo demandé
        res.render("usr_display", {title: "Résultat de la recherche:", user: req.session.user, usr_array: await users.getByLogin(req.body.login)});
    }
})

//Page /user/new, appelée après envoi du formulaire d'inscription
router.post('/new', async function(req, res){
    //Vérification de l'existence préalable de l'utilisateur
    let check = await users.getByLogin(req.body.login);
    if(check !== undefined){ //S'il existe déjà, retour à l'inscription
        res.redirect('/user/register');
    }
    else{ //Sinon, envoyer à la page de connexion
        users.insert(req.body.login, req.body.password, req.body.name, req.body.surname, false);
        res.redirect('/user/login');
    }
})

module.exports = router;