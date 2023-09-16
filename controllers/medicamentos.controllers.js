// traemos el modulo de Medicamentos
const { conexionDB } = require("./../database/config.js");

// 1. Obtener todos los medicamentos con menos de 50 unidades en stock.
const getMedicamentos = async (req, res) => {
  try {
    const Medicamentos = (await conexionDB()).medicamentos;
    const getMedicamentos = await Medicamentos.find({
      stock: { $lt: 50 },
    }).toArray();

    res.send({ getMedicamentos });
  } catch (error) {
    throw new Error();
  }
};

// 2. Listar los proveedores con su información de contacto en medicamentos.

const getProveedoresMedicamentos = async (req, res) => {  
  try {
    const Medicamentos = (await conexionDB()).medicamentos;

const uniqueProveedores = await Medicamentos.distinct("proveedor");

res.json(uniqueProveedores);

  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

// 6. Medicamentos que caducan antes del 1 de enero de 2024.

const medicamentosCa1 = async (req, res) => {
  try {
    const Medicamentos = (await conexionDB()).medicamentos;

const resultado = await Medicamentos.aggregate([
  {
    $match: {
      fechaExpiracion: {
        $lt: new Date("2024-01-01T00:00:00.000+00:00")
      }
    }
  }
]).toArray();

res.json(resultado);

  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

// 10. Obtener el medicamento más caro.
const getExpensivest = async (req, res) => {
  try {
    const Medicamentos = (await conexionDB()).medicamentos;

const resultado = await Medicamentos.aggregate([
  {
    $sort: {
      precio: -1
    }
  },
  {
    $limit: 1
  }
]).toArray();

res.json({
  expensivest: resultado
});

  } catch (error) {
    throw new Error();
  }
};
// 9. Medicamentos que no han sido vendidos.
const medicamentosNVen = async (req, res) => {
  try {
    const Ventas = (await conexionDB()).ventas;
const Medicamentos = (await conexionDB()).medicamentos;

const resultado = await Medicamentos.aggregate([
  {
    $lookup: {
      from: "ventas",
      localField: "nombre",
      foreignField: "medicamentosVendidos.nombreMedicamento",
      as: "ventas"
    }
  },
  {
    $match: {
      ventas: { $size: 0 }
    }
  },
  {
    $project: {
      _id: 0,
      medicamentoNoVendido: "$nombre"
    }
  }
]).toArray();

const medicamentosNoVendidos = resultado.map(item => item.medicamentoNoVendido);

res.json({
  medicamentosNoVendidos
});

  } catch (error) {
    console.log(error);
  }
};


// 11. Número de medicamentos por proveedor.

const medicamentosPproveedor = async(req , res) => {
  const Medicamentos = (await conexionDB()).medicamentos;

  const proveedorA = await Medicamentos
  .find({ "proveedor.nombre": "ProveedorA" })
  .toArray();

  const proveedorB = await Medicamentos
  .find({ "proveedor.nombre": "ProveedorB" })
  .toArray();


  const proveedorC = await Medicamentos
  .find({ "proveedor.nombre": "ProveedorC" })
  .toArray();

  res.json({
    proveedorA: proveedorA.length,
    proveedorB: proveedorB.length,
    proveedorC: proveedorC.length,
  });
};

// 19. Obtener todos los medicamentos que expiren en 2024.

const expM2024 = async(req, res ) => {
  const Medicamentos = (await conexionDB()).medicamentos;
  const medicamentos = (await Medicamentos.find({$and: [{fechaExpiracion: {$gte: new Date("2024-01-10T00:00:00.000+00:00")}}, {fechaExpiracion: {$lt: new Date("2025-01-10T00:00:00.000+00:00")}}]}).toArray()).map((e)=> e.nombre);

res.json(medicamentos)
};

// 29. Proveedores de los medicamentos con menos de 50 unidades en stock.

const proveedoresStock = async (req, res) => {
  const Medicamentos = (await conexionDB()).medicamentos;

  const proveedoresMedicamentos50 = await Medicamentos.aggregate([
    {
      $match: {
        "stock": { $lt: 50 }
      }
    },
    {
      $group: {
        _id: "$proveedor.nombre"
      }
    }
  ])
  .toArray();
  res.json(proveedoresMedicamentos50)

};

// 38. Medicamentos con un precio mayor a 50 y un stock menor a 100.

const medicamentosPrecioStock = async (req, res) => {
const Medicamentos = (await conexionDB()).medicamentos;

const medicamentos = await Medicamentos.aggregate([
  {
    $match: {
      precio: {$gt: 50},
      stock: {$lt: 100}
    }
  }
]).toArray();
res.json(medicamentos);
};

module.exports = {
  getMedicamentos,
  getProveedoresMedicamentos,
  medicamentosCa1,
  getExpensivest,
  medicamentosNVen,
  medicamentosPproveedor,
  expM2024,
  proveedoresStock,
  medicamentosPrecioStock
};
