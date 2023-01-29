require('dotenv').config()

//Récupération des informations de BDD et connection
const { MongoClient, ObjectID} = require('mongodb');
const url = process.env.MONGODB_URI;
const dbName = "Project_DB";
const client = new MongoClient(url);
const db = client.db(dbName);
const resColl = db.collection('Ressources');

const Ressource = {
    getResByName: async function(name){ //Donne toutes les ressources possédant un nom donné
        await client.connect();
        return await resColl.find({name: name}).toArray();
    },

    getAllRes: async function(){ //Donne toutes les ressources
        await client.connect();
        return await resColl.find().toArray();
    },

    insert: async function(n, t){ //Ajoute une ressource à la BDD
        await client.connect();
        return await resColl.insertOne({_id: new ObjectID, name: n, architecture: t})
    }
}

module.exports = Ressource;