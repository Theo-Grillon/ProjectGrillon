require('dotenv').config()
const { MongoClient, ObjectID} = require('mongodb');

const path = require('path');
const args = process.argv.slice(2);
const url = process.env.MONGODB_URI;
const dbName = "Project_DB";
const client = new MongoClient(url);
const db = client.db(dbName);
const resaColl = db.collection('Reservations');
const userColl = db.collection('Users');

const ress = require(path.join(__dirname, "Ressource.js"))

const Reservation = {
    getResaByOwner: async function(owner){
        await client.connect();
        let usr = await userColl.find({surname: owner}).toArray();
        return await resaColl.find({owner: usr[0]._id}).toArray();
    },

    getResaByRessources: async function(ress){
        await client.connect();
        return await resaColl.find({ressources: ress}).toArray();
    },

    getAll: async function(){
        await client.connect();
        return await resaColl.find().toArray();
    },

    insert: async function(start, end, ressources, owner){
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