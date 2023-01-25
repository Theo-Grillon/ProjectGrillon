require('dotenv').config()
const { MongoClient, ObjectID} = require('mongodb');

const args = process.argv.slice(2);
const url = process.env.MONGODB_URI;
const dbName = "Project_DB";
const client = new MongoClient(url);
const db = client.db(dbName);
const resColl = db.collection('Ressources');

const Ressource = {
    getResByName: async function(name){
        await client.connect();
        return await resColl.find({name: name}).toArray();
    },

    getAllRes: async function(){
        await client.connect();
        return await resColl.find().toArray();
    },

    insert: async function(n, t){
        await client.connect();
        return await resColl.insertOne({_id: new ObjectID, name: n, architecture: t})
    }
}

module.exports = Ressource;