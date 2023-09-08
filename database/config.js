const mongoose = require('mongoose');

const conexionDB = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://campusricardo2023:12345@cluster0.1iuecvf.mongodb.net/farmaciaCampus", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database Online');
    } catch (error) {
        console.log(error);
        throw new Error(`database can't launch`);
    }
}

module.exports = {
    conexionDB
}