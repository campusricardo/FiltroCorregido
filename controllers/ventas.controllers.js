const { conexionDB } = require("./../database/config.js");

// 4. Obtener recetas médicas emitidas después del 1 de enero de 2023.

const recetas1Enero = async (req, res) => {
  try {
    const Ventas = (await conexionDB()).ventas;
    const getVentas = await Ventas.find({
      fechaVenta: { $gt: new Date("2023-01-10T00:00:00.000+00:00") },
    }).toArray();
    res.json(getVentas);
  } catch (error) {}
};

// 5. Total de ventas del medicamento Paracetamol.

const ventasParacetamol = async (req, res) => {
  try {
    const Ventas = (await conexionDB()).ventas;

const resultado = await Ventas.aggregate([
  {
    $unwind: "$medicamentosVendidos"
  },
  {
    $match: {
      "medicamentosVendidos.nombreMedicamento": "Paracetamol"
    }
  },
  {
    $group: {
      _id: null,
      cantidad: {
        $sum: "$medicamentosVendidos.cantidadVendida"
      }
    }
  },
  {
    $project: {
      _id: 0,
      cantidad: 1
    }
  }
]).toArray();

res.json({
  cantidad: resultado.length > 0 ? resultado[0].cantidad : 0
});

  } catch (error) {
    console.log(error);
    throw new Error;
  }
};

// 8. Cantidad total de dinero recaudado por las ventas de medicamentos.

const ventasTotal = async (req, res) => {
  try {
    const Ventas = (await conexionDB()).ventas;

const resultado = await Ventas.aggregate([
  {
    $unwind: "$medicamentosVendidos"
  },
  {
    $group: {
      _id: null,
      totalVenta: {
        $sum: { $multiply: ["$medicamentosVendidos.cantidadVendida", "$medicamentosVendidos.precio"] }
      }
    }
  },
  {
    $project: {
      _id: 0,
      totalVenta: 1
    }
  }
]).toArray();

res.json({
  totalVenta: resultado[0].totalVenta 
});

  } catch (error) {
    throw new Error;
  }
};

// 12. Pacientes que han comprado Paracetamol.

const pacientesCparacetamol = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;

  const resultado = await Ventas.aggregate([
    {
      $match: {
        "medicamentosVendidos.nombreMedicamento": "Paracetamol"
      }
    },
    {
      $project: {
        _id: 0,
        paciente: 1
      }
    }
  ]).toArray();
  
  res.json(resultado);
  
};

// 14. Obtener el total de medicamentos vendidos en marzo de 2023.

const medicamentosMarzo = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;
  const ventasMarzo = (
    await Ventas.find({
      $and: [
        { fechaVenta: { $gte: new Date("2023-03-10T00:00:00.000+00:00") } },
        { fechaVenta: { $lt: new Date("2023-04-10T00:00:00.000+00:00") } },
      ],
    }).toArray()
  ).map((e) => e.medicamentosVendidos[0].cantidadVendida);

  const ventas = ventasMarzo.reduce((inicial, final) => inicial + final, 0);

  res.json({
    ventasMarzo: ventas,
  });
};

// 15. Obtener el medicamento menos vendido en 2023.

const ObtMmenosVendido = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;

  const resultado = await Ventas.aggregate([
    {
      $unwind: "$medicamentosVendidos"
    },
    {
      $group: {
        _id: "$medicamentosVendidos.nombreMedicamento",
        totalCantidadVendida: {
          $sum: "$medicamentosVendidos.cantidadVendida"
        }
      }
    },
    {
      $sort: {
        totalCantidadVendida: 1
      }
    },
    {
      $limit: 1
    },
    {
      $project: {
        _id: 0,
        nombreMedicamento: "$_id",
        totalCantidadVendida: 1
      }
    }
  ]).toArray();
  
  res.json(resultado[0]);
  
};

// 17. Promedio de medicamentos comprados por venta.

const promedioMedicamentos = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;

  const resultado = await Ventas.aggregate([
    {
      $unwind: "$medicamentosVendidos"
    },
    {
      $group: {
        _id: null,
        totalVenta: {
          $sum: { $multiply: ["$medicamentosVendidos.precio", "$medicamentosVendidos.cantidadVendida"] }
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        _id: 0,
        averageVenta: {
          $divide: ["$totalVenta", "$count"]
        }
      }
    }
  ]).toArray();
  
  res.json(resultado[0]);
  

};

// 18. Cantidad de ventas realizadas por cada empleado en 2023.

const ventasEmpleados = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;

  const resultado = await Ventas.aggregate([
    {
      $unwind: "$medicamentosVendidos"
    },
    {
      $group: {
        _id: "$empleado.nombre",
        totalCantidadVendida: {
          $sum: "$medicamentosVendidos.cantidadVendida"
        }
      }
    },
    {
      $project: {
        _id: 0,
        empleado: "$_id",
        totalCantidadVendida: 1
      }
    }
  ]).toArray();
  
  res.json(resultado);
  
};

// 20. Empleados que hayan hecho más de 5 ventas en total.

const ventasEmpleados5 = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;

const resultado = await Ventas.aggregate([
  {
    $unwind: "$medicamentosVendidos"
  },
  {
    $group: {
      _id: "$empleado.nombre",
      totalCantidadVendida: {
        $sum: "$medicamentosVendidos.cantidadVendida"
      }
    }
  },
  {
    $match: {
      totalCantidadVendida: {
        $gt: 5 // Filter for empleados with at least 5 cantidadVendida
      }
    }
  },
  {
    $project: {
      _id: 0,
      empleado: "$_id",
      totalCantidadVendida: 1
    }
  }
]).toArray();

res.json(resultado);

};

// 21. Medicamentos que no han sido vendidos nunca.

const nuncaVendidos = async (req, res) => {
  const Medicamentos = (await conexionDB()).medicamentos;
const Ventas = (await conexionDB()).ventas;

const medicamentosVendidos = await Ventas.distinct("medicamentosVendidos.nombreMedicamento");

const medicamentosNoVendidos = await Medicamentos.aggregate([
  {
    $match: {
      nombre: {
        $nin: medicamentosVendidos
      }
    }
  },
  {
    $project: {
      _id: 0,
      nombre: 1
    }
  }
]).toArray();

res.json(medicamentosNoVendidos);

};

// 22. Paciente que ha gastado más dinero en 2023.

const pacienteMasDinero = async (req, res) => {
  
  const Ventas = (await conexionDB()).ventas;
  const ventas = await Ventas.aggregate([
    {
      $unwind: "$medicamentosVendidos"
    },
    {
      $group: {
        _id: "$paciente",
        totalVenta: {
          $sum: { $multiply: ["$medicamentosVendidos.cantidadVendida", "$medicamentosVendidos.precio"] }
        }
      }
    },
    {
      $sort: { totalVenta: -1 }
    },
    {
      $limit: 1
    },
    {
      $project: {
        _id: 0,
        paciente: "$_id",
        totalVenta: 1
      }
    }
  ]).toArray();
  res.json(ventas);

};

// 23. Empleados que no han realizado ninguna venta en 2023.
const empleadosNoVentas = async (req, res) => {
  const Empleados = (await conexionDB()).empleados;
const Ventas = (await conexionDB()).ventas;

const empleadosSinVentas2023 = await Empleados.aggregate([
  {
    $lookup: {
      from: "ventas",
      localField: "nombre",
      foreignField: "empleado.nombre",
      as: "ventas"
    }
  },
  {
    $match: {
      "ventas": {
        $not: {
          $elemMatch: {
            fechaVenta: {
              $gte: new Date("2023-01-01"),
              $lte: new Date("2023-12-31")
            }
          }
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      nombre: 1,
      cargo: 1,
      fechaContratacion: 1
    }
  }
]).toArray();

res.json(empleadosSinVentas2023);

};

// 26. Total de medicamentos vendidos por mes en 2023.

const getMedicamentosPORmes = async(req, res) => {
 const Ventas = (await conexionDB()).ventas;

 const pipeline = [
  {
    $unwind: "$medicamentosVendidos"
  },
  {
    $project: {
      _id: 0,
      mes: { $month: "$fechaVenta" },
      nombreMedicamento: "$medicamentosVendidos.nombreMedicamento"
    }
  },
  {
    $group: {
      _id: {
        mes: "$mes",
        nombreMedicamento: "$nombreMedicamento"
      },
      totalCantidadVendida: { $sum: 1 }
    }
  },
  {
    $sort: { "_id.mes": 1 }
  }
];

const result = await Ventas.aggregate(pipeline).toArray();

res.json(result);

};

// 25. Pacientes que compraron el medicamento “Paracetamol” en 2023.

const pacientesParacetamol = async(req, res) => {
  const Ventas = (await conexionDB()).ventas;
    const query = {
      "fechaVenta": {
        $gte: new Date("2023-01-01T00:00:00.000Z"),
        $lt: new Date("2024-01-01T00:00:00.000Z")
      },
      "medicamentosVendidos.nombreMedicamento": "Paracetamol"
    };

    // Projection to exclude _id and include paciente
    const projection = { _id: 0, paciente: 1 };

    // Execute the find query
    const result = await Ventas.find(query).project(projection).toArray();

  res.json(result);

};


// 27. Empleados con menos de 5 Ventas

const empleadosmenos5 = async (req ,res ) => {

  const Ventas = (await conexionDB()).ventas;

  const ventas = await Ventas.aggregate([
    {
      $match: {
        "empleado.cargo": "Vendedor",
        "medicamentosVendidos.cantidadVendida": { $lt: 5 }
      }
    },
    {
      $group: {
        _id: "$empleado.nombre",
      }
    },
    {
      $sort: { totalCantidadVendida: 1 }
    }
  ]).toArray();
  
res.json(ventas);
};

// 30. Pacientes que no han comprado ningún medicamento en 2023.

const pacientesNoCompras2023 = async (req, res) => {
  const Pacientes = (await conexionDB()).pacientes;
  const Ventas = (await conexionDB()).ventas;
  const pacientes = await Pacientes.aggregate([
    {
      $project: {
        _id: 0,
        nombre: 1
      }
    }
  ])
  .toArray();

  const searchPacientes = await Ventas.aggregate([
    {
      $match: {
        "fechaVenta": {
          $gte: new Date("2023-01-01T00:00:00.000Z"),
          $lt: new Date("2024-01-01T00:00:00.000Z")
        }
      }
    },
    {
      $lookup: {
        from: "pacientes",
        localField: "paciente.nombre",
        foreignField: "nombre",
        as: "matching_pacientes"
      }
    },
    {
      $project: {
        _id: 0,
        "nombre": "$paciente.nombre",
        "existsInPacientes": {
          $in: ["$paciente.nombre", pacientes.map(n => n.nombre)]
        }
      }
    },
    {
      $match: {
        "existsInPacientes": false
      }
    }
  ])
  .toArray();
  res.json(searchPacientes);
};

module.exports = {
  recetas1Enero,
  ventasParacetamol,
  ventasTotal,
  pacientesCparacetamol,
  medicamentosMarzo,
  ObtMmenosVendido,
  promedioMedicamentos,
  ventasEmpleados,
  ventasEmpleados5,
  nuncaVendidos,
  pacienteMasDinero,
  empleadosNoVentas,
  pacientesParacetamol,
  empleadosmenos5,
  getMedicamentosPORmes,
  pacientesNoCompras2023
};
