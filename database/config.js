const {MongoClient} = require('mongodb');
require('dotenv').config();
const url = process.env.MONGO_URI;
const dbName = 'farmaciaCampus';
const client = new MongoClient(url);
const conexionDB = async ()=>{
    try {
       await client.connect();
       const db = await client.db(dbName);
       const collections =  {
        compras : db.collection('compras'),
        empleados: db.collection('empleados'),
        medicamentos: db.collection('medicamentos'),
        pacientes: db.collection('pacientes'),
        proveedores: db.collection('proveedores'),
        ventas: db.collection('ventas')

       };
       console.log('database connected');
       return collections;
    } catch (error) {
        console.log(error);
        throw new Error(`database can't launch`);
    }
}

module.exports = {
    conexionDB
}
