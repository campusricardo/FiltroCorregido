const { conexionDB } = require("./../database/config.js");

// 3. Medicamentos comprados al ‘Proveedor A’.

const medicamentosA = async (req, res) => {
  const compras = (await conexionDB()).compras;
  const getCompras = await compras
    .find({ "proveedor.nombre": "ProveedorA" })
    .toArray();
  const showCompras = getCompras.map((c) => c.medicamentosComprados);
  console.log(showCompras);
  res.json(showCompras);
};

// 7. Total de medicamentos vendidos por cada proveedor

const proveedorVentas = async (req, res) => {
  const compras = (await conexionDB()).compras;
  const proveedorA = await compras
    .find({ "proveedor.nombre": "ProveedorA" })
    .toArray();
  const proveedorAcantidad = proveedorA.map(
    (e) => e.medicamentosComprados[0].cantidadComprada
  );
  const proveedorB = await compras
    .find({ "proveedor.nombre": "ProveedorB" })
    .toArray();
  const proveedorBcantidad = proveedorB.map(
    (e) => e.medicamentosComprados[0].cantidadComprada
  );
  const proveedorC = await compras
    .find({ "proveedor.nombre": "ProveedorC" })
    .toArray();
  const proveedorCcantidad = proveedorC.map(
    (e) => e.medicamentosComprados[0].cantidadComprada
  );
  let totalA = proveedorAcantidad.reduce((a, b) => a + b, 0);
  let totalB = proveedorBcantidad.reduce((a, b) => a + b, 0);
  let totalC = proveedorCcantidad.reduce((a, b) => a + b, 0);

  res.json({
    totalVentasA: totalA,
    totalVentasB: totalB,
    totalVentasC: totalC,
  });
};

// 13. Proveedores que no han vendido medicamentos en el último año.

const proveeNMA = async(req , res) => {
  const Compras = (await conexionDB()).compras;

  const comprasM2023 = await Compras.find({fechaCompra:{$lt: new Date("2023-01-00T00:00:00.000+00:00")}}).toArray();

  res.json({proveedoresNoVentas2023:comprasM2023})
 
};

module.exports = {
  medicamentosA,
  proveedorVentas,
  proveeNMA
};
