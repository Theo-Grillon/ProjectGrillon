require('dotenv').config()
const { MongoClient, ObjectID} = require('mongodb');

const args = process.argv.slice(2);
const url = process.env.MONGODB_URI;
const dbName = "Project_DB";
const client = new MongoClient(url);
const db = client.db(dbName);
const usersColl = db.collection('Users');

const User = {
    getByLoginPwd : async function(login, pwd){
        return await usersColl.find({login: login, mdp: pwd}).toArray();
    },

    getAll : async function(){
        return await usersColl.find().toArray();
    },

    insert : async function(login, pwd, name, surname){
        usersColl.insertOne({_id: new ObjectID, login: new Object(login), mdp: new Object(pwd), name : new Object(name), surname: new Object(surname)})
            .then(
                res => {
                    console.log(`User '${name}' '${surname}' created`);
                }
            )
    }
}

module.exports = User;
