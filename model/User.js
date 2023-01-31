require('dotenv').config()
//Récupération des informations de BDD et connection
const { MongoClient, ObjectID} = require('mongodb');
const url = process.env.MONGODB_URI;
const dbName = "Project_DB";
const client = new MongoClient(url);
const db = client.db(dbName);
const usersColl = db.collection('Users');

const User = {
    getByLoginPwd : async function(log, pass){ // Donne l'utilisateur unique ayant le couple login/mot de passe
        await client.connect()
        return await usersColl.findOne({login: log, pwd: pass});
    },

    getByLogin: async function(log){ // Donne l'utilisateur unique ayant l'identifiant donné
        await client.connect()
        return await usersColl.findOne({login: log});
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
