require('dotenv').config()

//Récupération des informations de BDD et connection
const { MongoClient, ObjectID} = require('mongodb');
const url = process.env.MONGODB_URI;
const dbName = "Project_DB";
const client = new MongoClient(url);
const db = client.db(dbName);
const resaColl = db.collection('Reservations');
const userColl = db.collection('Users');

const Reservation = {
    getResaByOwner: async function(owner){ // Donne toutes les réservations d'un utilisateur donné, pour le moment inutilisé
        await client.connect();
        let usr = await userColl.find({surname: owner}).toArray();
        return await resaColl.find({owner: usr[0]._id}).toArray();
    },

    getResaByRessources: async function(ress){ // Donne toutes les réservations utilisant une ressource donnée
        await client.connect();
        return await resaColl.find({ressources: ress}).toArray();
    },

    getAll: async function(){ // Donne toutes les réservations
        await client.connect();
        return await resaColl.find().toArray();
    },

    insert: async function(start, end, ressources, owner){ // Ajoute une réservation à la BDD
        await client.connect();
        resaColl.insertOne({
            _id: new ObjectID,
            start_date: new Object(start),
            end_date: new Object(end),
            ressources: ressources,
            owner: owner
        })
            .then(
                res => {

                    console.log(`New reservation created !`);
                }
            )
    }
}

module.exports = Reservation