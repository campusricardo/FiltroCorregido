const Medicamentos = require('../models/compras.js');

const medicamentosA = async(req, res) => {
    const getCompras = await Medicamentos.find({"proveedor.nombre": "ProveedorA"});
    const showCompras = getCompras.map((c)=> c.medicamentosComprados);
    console.log(showCompras);
    res.json(
        showCompras
    
        )
}

const proveedorVentas = async(req, res) => {
    const proveedorA = await Medicamentos.find({"proveedor.nombre": "ProveedorA"});
    const proveedorAcantidad = proveedorA.map((e)=> e.medicamentosComprados[0].cantidadComprada);
    const proveedorB = await Medicamentos.find({"proveedor.nombre": "ProveedorB"});
    const proveedorBcantidad = proveedorB.map((e)=> e.medicamentosComprados[0].cantidadComprada);
    const proveedorC = await Medicamentos.find({"proveedor.nombre": "ProveedorC"});
    const proveedorCcantidad = proveedorC.map((e)=> e.medicamentosComprados[0].cantidadComprada);

    let totalA = proveedorAcantidad.reduce((a, b) => a + b, 0);
    let totalB = proveedorBcantidad.reduce((a, b) => a + b, 0);
    let totalC = proveedorCcantidad.reduce((a, b) => a + b, 0);


    res.json({
        totalVentasA: totalA,
        totalVentasB: totalB,
        totalVentasC: totalC
    });
    
}   

module.exports = {
    medicamentosA,
    proveedorVentas
}