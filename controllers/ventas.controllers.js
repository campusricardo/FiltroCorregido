const Ventas = require('../models/ventas.js');

const recetas1Enero = async(req, res) => {
    
    const getVentas = await Ventas.find({ fechaVenta: { $gt: new Date("2023-01-10T00:00:00.000+00:00") } });
    res.json(getVentas);
}


const ventasParacetamol = async(req,res) => {

    const getVentas = await Ventas.find();
    let vendidos = 0;
    const ventas = getVentas.map((e)=> e.medicamentosVendidos);
    const buscandoParacetamol = ventas.map((e)=> { 
        const a = e[0].nombreMedicamento == "Paracetamol" ?  e :  "x";
        return a[0]});
    const getX = buscandoParacetamol.filter((x) => x !== "x");
    getX.forEach(e => {
        vendidos += e.cantidadVendida;
    });
    res.json({
        cantidad: vendidos
    })
}

const ventasTotal = async(req, res) => {
    let totalVentas = 0;
    let arrayWithinanArray = 0;
    const getVentas = await Ventas.find();
    const ventas = getVentas.map((e)=> {
        const xd = e.medicamentosVendidos;
        const mapventas = xd.map((x)=>{
            return x.cantidadVendida * x.precio;
        });

        return mapventas;
    });

    ventas.forEach((e)=> {
        if (e.length === 1){
            console.log(e);
            totalVentas += e[0];
        }
        if (e.length > 1) {
            e.forEach((e)=> {
                arrayWithinanArray += e;
            })
        }
    });

    res.json({
        totalVentas: totalVentas+ arrayWithinanArray
    })
}

module.exports = {
    recetas1Enero,
    ventasParacetamol,
    ventasTotal
}
