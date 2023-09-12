// traemos el modulo de Medicamentos
const {conexionDB} = require('./../database/config.js');


const getMedicamentos = async(req,res)=> {
    try {
        const Medicamentos = (await conexionDB()).medicamentos;
        const getMedicamentos = await Medicamentos.find({stock:{$lt: 50} }).toArray();    
    
        res.send({getMedicamentos});
        
    } catch (error) {
        throw new Error;
    }

};

const getProveedoresMedicamentos = async(req, res) =>{
    try {
        const Medicamentos = (await conexionDB()).medicamentos;
        const getMedicamentos = await Medicamentos.find().toArray();
        const getProveedores = getMedicamentos.map((e)=> {
            return e.proveedor;
        })
        console.log(getProveedores);
        res.json(getProveedores);
    } catch (error) {
        console.log(error);
        throw new Error;
    }

}

const medicamentosCa1 = async(req, res) => {
    try {
    const Medicamentos = (await conexionDB()).medicamentos;
        // No hay  ningun medicamento que se caduque antes del uno de enero
        const medicamentosCa = await Medicamentos.find({ fechaExpiracion: { $lt: new Date("2024-01-10T00:00:00.000+00:00") } }).toArray();
        res.json(medicamentosCa);


    } catch (error) {
        console.log(error);
        throw new Error;
    }
};


// 10
const getExpensivest = async(req, res) => {
    try {
    const Medicamentos = (await conexionDB()).medicamentos;
        const medicamentoMax = await Medicamentos.find().sort({precio: -1}).limit(1).toArray();
        res.json({
            expensivest: medicamentoMax
        })
    } catch (error) {
        throw new Error;
    }
}



module.exports = {
    getMedicamentos,
    getProveedoresMedicamentos,
    medicamentosCa1,
    getExpensivest
}