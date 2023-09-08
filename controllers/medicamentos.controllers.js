// traemos el modulo de Medicamentos
const Medicamentos = require('../models/medicamentos.js');

const getMedicamentos = async(req,res)=> {
    const getMedicamentos = await Medicamentos.find({stock:{$lt: 50} });    

    res.send({getMedicamentos});
};

const getProveedoresMedicamentos = async(req, res) =>{
    try {
        const getMedicamentos = await Medicamentos.find();
        const getProveedores = getMedicamentos.map((e)=> {
            return e.proveedor
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
        // No hay  ningun medicamento que se caduque antes del uno de enero
        const medicamentosCa = await Medicamentos.find({ fechaExpiracion: { $lt: new Date("2024-01-10T00:00:00.000+00:00") } });
        res.json(medicamentosCa);


    } catch (error) {
        console.log(error);
        throw new Error;
    }
};



module.exports = {
    getMedicamentos,
    getProveedoresMedicamentos,
    medicamentosCa1
}