const { conexionDB } = require("./../database/config.js");

// 3. Medicamentos comprados al ‘Proveedor A’.

const medicamentosA = async (req, res) => {
  const compras = (await conexionDB()).compras;
  const showCompras = await compras.aggregate([
    {
      $match: {
        "proveedor.nombre": "ProveedorA"
      }
    },
    {
      $project: {
        _id: 0,
        medicamentosComprados: 1
      }
    }
  ]).toArray();
  
  res.json(showCompras);
};

// 7. Total de medicamentos vendidos por cada proveedor

const proveedorVentas = async (req, res) => {
  const compras = (await conexionDB()).compras;

const resultado = await compras.aggregate([
  {
    $unwind: "$medicamentosComprados"
  },
  {
    $group: {
      _id: "$proveedor.nombre",
      totalCantidadComprada: {
        $sum: "$medicamentosComprados.cantidadComprada"
      }
    }
  },
  {
    $project: {
      _id: 0,
      proveedor: "$_id",
      totalCantidadComprada: 1
    }
  }
]).toArray();

res.json(resultado);

  
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
  const compras = (await conexionDB()).compras;

  const resultado = await compras.aggregate([
    {
      $unwind: "$medicamentosComprados"
    },
    {
      $group: {
        _id: "$proveedor.nombre",
        totalCompras: {
          $sum: {
            $multiply: ["$medicamentosComprados.cantidadComprada", "$medicamentosComprados.precioCompra"]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        proveedor: "$_id",
        totalCompras: 1
      }
    }
  ]).toArray();
  
  res.json(resultado);
  
};
// 24. Proveedor que ha suministrado más medicamentos en 2023

const proveedor2023 = async (req, res) => {
  const compras = (await conexionDB()).compras;

  const resultado = await compras.aggregate([
    {
      $unwind: "$medicamentosComprados"
    },
    {
      $group: {
        _id: "$proveedor.nombre",
        totalCantidadComprada: {
          $sum: "$medicamentosComprados.cantidadComprada"
        }
      }
    },
    {
      $project: {
        _id: 0,
        proveedor: "$_id",
        totalCantidadComprada: 1
      }
    }
  ]).toArray();

  const result = Math.max(...resultado.map(e=> e.totalCantidadComprada));
  const result2 = resultado.filter(x=> x.totalCantidadComprada===result)
  res.json(result2);
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
