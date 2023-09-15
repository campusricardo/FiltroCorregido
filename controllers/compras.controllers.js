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

const proveeNMA = async (req, res) => {
  const Compras = (await conexionDB()).compras;

  const comprasM2023 = await Compras.find({
    fechaCompra: { $lt: new Date("2023-01-00T00:00:00.000+00:00") },
  }).toArray();

  res.json({ proveedoresNoVentas2023: comprasM2023 });
};

// 16 .Ganancia total por proveedor en 2023 (asumiendo un campo precioCompra en Compras).

const ganaciasProveedores = async (req, res) => {
  const Compras = (await conexionDB()).compras;

  const proveedorA = (
    await Compras.find({ "proveedor.nombre": "ProveedorA" }).toArray()
  ).map((e) => e.medicamentosComprados[0]);
  const ganaciaProveedorA = proveedorA
    .map((e) => e.cantidadComprada * e.precioCompra)
    .reduce((a, b) => a + b, 0);

  const proveedorB = (
    await Compras.find({ "proveedor.nombre": "ProveedorB" }).toArray()
  ).map((e) => e.medicamentosComprados[0]);
  const ganaciaProveedorB = proveedorB
    .map((e) => e.cantidadComprada * e.precioCompra)
    .reduce((a, b) => a + b, 0);

  const proveedorC = (
    await Compras.find({ "proveedor.nombre": "ProveedorC" }).toArray()
  ).map((e) => e.medicamentosComprados[0]);
  const ganaciaProveedorC = proveedorC
    .map((e) => e.cantidadComprada * e.precioCompra)
    .reduce((a, b) => a + b, 0);
  res.json({
    ganaciaProveedorA,
    ganaciaProveedorB,
    ganaciaProveedorC,
  });
};
// 24. Proveedor que ha suministrado más medicamentos en 2023

const proveedor2023 = async (req, res) => {
  const Compras = (await conexionDB()).compras;
  const Proveedores = (await conexionDB()).proveedores;

  const proveedores = (
    await Proveedores.aggregate([
      {
        $project: { nombre: 1, _id: 0 },
      },
    ]).toArray()
  ).map((e) => {
    return { nombre: e.nombre, medicamentos: 0 };
  });

  const compras = await Compras.find().toArray();

  compras.forEach((e) => {
    for (let i = 0; i < proveedores.length; i++) {
      if (e.proveedor.nombre === proveedores[i].nombre) {
        proveedores[i].medicamentos +=
          e.medicamentosComprados[0].cantidadComprada;
        break;
      }
    }
  });

  let maxMedicamentos = -Infinity; // Inicializar con un valor muy bajo

  for (let i = 0; i < proveedores.length; i++) {
    if (proveedores[i].medicamentos > maxMedicamentos) {
      maxMedicamentos = proveedores[i];
    }
  }

  res.json(maxMedicamentos);
};

// 28. Número total de proveedores que suministraron medicamentos en 2023.

const proveedoresMedicamentos2023 = async (req , res) => {
  const Compras = (await conexionDB()).compras;

  const comprasProveedores = await Compras.aggregate([
    {
      $match: {
        "fechaCompra": {
          $gte: new Date("2023-01-01T00:00:00.000Z"),
          $lt: new Date("2024-01-01T00:00:00.000Z")
        }
      }
    },
    {
      $group: {
        _id: "$proveedor.nombre",
        proveedor: { $first: "$proveedor" }
      }
    },
    {
      $replaceRoot: { newRoot: "$proveedor" }
    }
  ]).toArray();

  res.json(comprasProveedores);
  
};




module.exports = {
  medicamentosA,
  proveedorVentas,
  proveeNMA,
  ganaciasProveedores,
  proveedor2023,
  proveedoresMedicamentos2023
};
