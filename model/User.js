require('dotenv').config()
//Récupération des informations de BDD et connection
const { MongoClient, ObjectID} = require('mongodb');
const url = process.env.MONGODB_URI;
const dbName = "Project_DB";
const client = new MongoClient(url);
const db = client.db(dbName);
const usersColl = db.collection('Users');

const User = {
    getByLoginPwd : async function(log, pass){ // Donne tous les utilisateurs ayant un certain login et mot de passe
        await client.connect()
        return await usersColl.find({login: log, pwd: pass}).toArray();
    },

    getByLogin: async function(log){ // Donne tous les utilisateurs ayant un login donné
        await client.connect()
        return await usersColl.find({login: log}).toArray();
    },

    getByNameSurname: async function(firstname, lastname){ // Donne le premier utilisateur ayant un certain nom et prénom
        await client.connect();
        return await usersColl.findOne({name: firstname, surname: lastname});
    },

    getAll : async function(){ // Donne tous les utilisateurs
        await client.connect()
        return await usersColl.find().toArray();
    },

    makeAdmin: async function(log, adm_status){ // Permet de modifier le statut administrateur d'un utilisateur
        await client.connect();
        await usersColl.updateOne({login: log}, {$set: {is_admin: adm_status}});
    },

    addReservation: async function(user_login){ // Incrémente le nombre de réservation d'un utilisateur
      await client.connect();
      await usersColl.updateOne({login: user_login}, {$inc: {nb_resa: 1}});
    },

    insert : async function(log, pwd, n, s, adm){ // Permet d'ajouter un utilisateur
        usersColl.insertOne({_id: new ObjectID, login: log, pwd: pwd, name : n, surname: s, nb_resa: 0, is_admin: adm})
            .then(
                res => {
                    console.log(`User ${n} ${s} created`);
                }
            )
    }
}

module.exports = User;
