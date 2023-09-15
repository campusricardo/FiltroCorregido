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

    const getVentas = await Ventas.find().toArray();
    let vendidos = 0;
    const ventas = getVentas.map((e) => e.medicamentosVendidos);
    const buscandoParacetamol = ventas.map((e) => {
      const a = e[0].nombreMedicamento == "Paracetamol" ? e : "x";
      return a[0];
    });
    const getX = buscandoParacetamol.filter((x) => x !== "x");
    getX.forEach((e) => {
      vendidos += e.cantidadVendida;
    });
    res.json({
      cantidad: vendidos,
    });
  } catch (error) {}
};

// 8. Cantidad total de dinero recaudado por las ventas de medicamentos.

const ventasTotal = async (req, res) => {
  try {
    const Ventas = (await conexionDB()).ventas;

    let totalVentas = 0;
    let arrayWithinanArray = 0;
    const getVentas = await Ventas.find().toArray();
    const ventas = getVentas.map((e) => {
      const xd = e.medicamentosVendidos;
      const mapventas = xd.map((x) => {
        return x.cantidadVendida * x.precio;
      });

      return mapventas;
    });

    ventas.forEach((e) => {
      if (e.length === 1) {
        console.log(e);
        totalVentas += e[0];
      }
      if (e.length > 1) {
        e.forEach((e) => {
          arrayWithinanArray += e;
        });
      }
    });

    res.json({
      totalVentas: totalVentas + arrayWithinanArray,
    });
  } catch (error) {}
};

// 12. Pacientes que han comprado Paracetamol.

const pacientesCparacetamol = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;
  const ventasParacetamol = (
    await Ventas.find({
      "medicamentosVendidos.nombreMedicamento": "Paracetamol",
    }).toArray()
  ).map((e) => e.paciente);
  console.log("xd");
  res.json(ventasParacetamol);
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
  const medicinas = {
    Paracetamol: 0,
    Ibuprofeno: 0,
    Aspirina: 0,
    Amoxicilina: 0,
    Cetirizina: 0,
    Losartan: 0,
    Metformina: 0,
    Atorvastatina: 0,
    Clonazepam: 0,
    Loratadina: 0,
  };
  const Ventas = (await conexionDB()).ventas;
  const ventas2023 = (
    await Ventas.find({
      $and: [
        { fechaVenta: { $gte: new Date("2023-01-10T00:00:00.000+00:00") } },
        { fechaVenta: { $lt: new Date("2024-01-10T00:00:00.000+00:00") } },
      ],
    }).toArray()
  ).map((e) => e.medicamentosVendidos);

  ventas2023.forEach((v) => {
    if (v.length > 1) {
      v.forEach((e) => {
        medicinas[`${e.nombreMedicamento}`] += e.cantidadVendida;
      });
    }
    medicinas[`${v[0].nombreMedicamento}`] += v[0].cantidadVendida;
  });
  const minNumber = Math.min(...Object.values(medicinas));

  const medicamentosArray = Object.entries(medicinas);

  const minMedicamentos = medicamentosArray.filter((e) => e[1] === 1);

  res.json({ medicina: minMedicamentos });
};

// 17. Promedio de medicamentos comprados por venta.

const promedioMedicamentos = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;
  const precioMedicamentos = (
    await Ventas.aggregate([
      { $project: { medicamentosVendidos: 1, _id: 0 } },
    ]).toArray()
  )
    .map((e) => {
      return e.medicamentosVendidos.map((e) => e.precio);
    })
    .flat(Infinity);

  const promedioMedicamentos =
    precioMedicamentos.reduce((a, b) => a + b, 0) / precioMedicamentos.length;
  res.json({ precioPromedio: promedioMedicamentos });
};

// 18. Cantidad de ventas realizadas por cada empleado en 2023.

const ventasEmpleados = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;
  const Empleados = (await conexionDB()).empleados;
  const empleados = (await Empleados.find().toArray()).map((e) => {
    return { nombre: e.nombre, ventas: 0 };
  });

  const ventas = await Ventas.find({
    $and: [
      { fechaVenta: { $gte: new Date("2023-01-10T00:00:00.000+00:00") } },
      { fechaVenta: { $lt: new Date("2024-01-10T00:00:00.000+00:00") } },
    ],
  }).toArray();

  ventas.forEach((e) => {
    for (let i = 0; i < empleados.length; i++) {
      if (e.empleado.nombre === empleados[i].nombre) {
        empleados[i].ventas += e.medicamentosVendidos
          .map((e) => e.cantidadVendida)
          .reduce((a, b) => a + b, 0);
      }
    }
  });

  res.json(empleados);
};

// 20. Empleados que hayan hecho más de 5 ventas en total.

const ventasEmpleados5 = async (req, res) => {
  const Ventas = (await conexionDB()).ventas;
  const Empleados = (await conexionDB()).empleados;
  const empleados = (await Empleados.find().toArray()).map((e) => {
    return { nombre: e.nombre, ventas: 0 };
  });

  const ventas = await Ventas.find().toArray();

  ventas.forEach((e) => {
    for (let i = 0; i < empleados.length; i++) {
      if (e.empleado.nombre === empleados[i].nombre) {
        empleados[i].ventas += 1;
      }
    }
  });

  const empleados5 = empleados.filter((e) => e.ventas >= 5);
  res.json(empleados5);
};

// 21. Medicamentos que no han sido vendidos nunca.

const nuncaVendidos = async (req, res) => {
  const medicinas = {
    Paracetamol: 0,
    Ibuprofeno: 0,
    Aspirina: 0,
    Amoxicilina: 0,
    Cetirizina: 0,
    Losartan: 0,
    Metformina: 0,
    Atorvastatina: 0,
    Clonazepam: 0,
    Loratadina: 0,
  };
  const Ventas = (await conexionDB()).ventas;
  const ventas = await Ventas.aggregate([
    { $project: { medicamentosVendidos: 1, _id: 0 } },
  ]).toArray();
  console.log(ventas);

  ventas.forEach((v) => {
    if (v.medicamentosVendidos.length > 1) {
      v.medicamentosVendidos.forEach((e) => {
        medicinas[`${e.nombreMedicamento}`] += e.cantidadVendida;
      });
    }
    medicinas[`${v.medicamentosVendidos[0].nombreMedicamento}`] +=
      v.medicamentosVendidos[0].cantidadVendida;
  });

  const arrayMedicinas = Object.entries(medicinas);

  const medicinasNoVendidas = arrayMedicinas.filter((e) => e[1] == 0);

  res.json(medicinasNoVendidas);
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
  const Ventas = (await conexionDB()).ventas;
  const Empleados = (await conexionDB()).empleados;
  const ventasEmpleados = (
    await Ventas.aggregate([
      { $project: { "empleado.nombre": 1, _id: 0 } },
    ]).toArray()
  ).map((e) => e.empleado.nombre);

  const empleadosqueVendieron = Array.from(new Set(ventasEmpleados));
  const empleados = await Empleados.find({
    nombre: { $nin: empleadosqueVendieron },
  }).toArray();
  res.json(empleados);
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
