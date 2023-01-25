const express = require('express');
const path = require('path');
const resa = require(path.join(__dirname,'../model/Reservation.js'));
const ress = require(path.join(__dirname, '../model/Ressource.js'));
const usr = require(path.join(__dirname, '../model/User.js'));
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/', async function (req, res){
    res.render("reservation", {user: req.session.user, res_array: await ress.getAllRes(), owner: req.session.user});
})

router.post('/', async function(req, res){
    res.render("reservation", {title: "Réservation", user: req.session.user, res_array: await ress.getAllRes(), owner: req.session.user});
});

router.post('/reserved', async function(req, res){
    let owner = await usr.getByNameSurname(req.session.user.firstname, req.session.user.lastname);
    let ressources = [];
    let used_res = [];
    let check = []
    let start = new Date(req.body.start)
    let end = new Date(req.body.end)
    for (let i=0; i<req.body.res.length; i++){
        check.push(await resa.getResaByRessources(req.body.res[i]))
        ressources.push(req.body.res[i]);
    }
    for (let i = 0; i<check.length; i++){
        for (let j = 0; j<check[i].length; j++){
            console.log(`${i}, ${j}: ${check[i][j]}`);
            if (check[i][j].end_date >= start){
                used_res = check[i][j].ressources;
                console.log(used_res);
                return res.render("resa_fail", {title: "Echec de la réservation", user: req.session.user, res_array: used_res})
            }
        }
    }
    await resa.insert(start, end, ressources, owner.login);
    await usr.addReservation(owner.login)
    let date_start = req.body.start.split('-');
    let date_end = req.body.end.split('-');
    let day_span = new Date(new Date(date_end[0], date_end[1], date_end[2]).getTime() - new Date(date_start[0], date_start[1], date_start[2]).getTime())
    res.render("reservation_conf", {title: "Confirmation de Réservation",user: req.session.user, nb_res: ressources.length, days: (day_span.getUTCDate()-1)});
})

router.post("/display", async function(req, res){
    res.render("resa_display", {title: "Liste des réservations", user: req.session.user, resa_array: await resa.getAll()});
})

module.exports = router;