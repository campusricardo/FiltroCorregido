const {MongoClient} = require('mongodb');
require('dotenv').config();
const url = process.env.MONGO_URI;
const dbName = 'farmaciaCampus';
const client = new MongoClient(url);
const conexionDB = async ()=>{
    try {
       await client.connect();
       const db = await client.db(dbName);
       const collection = db.collection('compras');
       console.log(collection);
       return collection;
    } catch (error) {
        console.log(error);
        throw new Error(`database can't launch`);
    }
}

module.exports = {
    conexionDB
}
