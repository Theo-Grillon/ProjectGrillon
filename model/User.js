require('dotenv').config()
const { MongoClient, ObjectID} = require('mongodb');

const args = process.argv.slice(2);
const url = process.env.MONGODB_URI;
const dbName = "Project_DB";
const client = new MongoClient(url);
const db = client.db(dbName);
const usersColl = db.collection('Users');

const User = {
    getByLoginPwd : async function(log, pass){
        await client.connect()
        return await usersColl.find({login: log, pwd: pass}).toArray();
    },

    getByLogin: async function(log){
        await client.connect()
        return await usersColl.find({login: log}).toArray();
    },

    getByNameSurname: async function(firstname, lastname){
        await client.connect();
        return await usersColl.findOne({name: firstname, surname: lastname});
    },

    getAll : async function(){
        await client.connect()
        return await usersColl.find().toArray();
    },

    addReservation: async function(user_login){
      await client.connect();
      await usersColl.updateOne({login: user_login}, {$inc: {nb_resa: 1}});
    },

    insert : async function(log, pwd, n, s, adm){
        usersColl.insertOne({_id: new ObjectID, login: log, pwd: pwd, name : n, surname: s, is_admin: adm})
            .then(
                res => {
                    console.log(`User '${name}' '${surname}' created`);
                }
            )
    }
}

module.exports = User;
