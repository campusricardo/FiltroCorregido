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

const pacientesCparacetamol = async(req ,res) => {
  const Ventas = (await conexionDB()).ventas;
  const ventasParacetamol = (await Ventas.find( {'medicamentosVendidos.nombreMedicamento': 'Paracetamol'}).toArray()).map((e)=> e.paciente);
  console.log('xd');
  res.json(ventasParacetamol);
}

// 14. Obtener el total de medicamentos vendidos en marzo de 2023.

const medicamentosMarzo = async(req ,res ) => {
  const Ventas = (await conexionDB()).ventas;
  const ventasMarzo = (await Ventas.find({$and:[{fechaVenta:{$gte: new Date("2023-03-10T00:00:00.000+00:00")}}, {fechaVenta:{$lt: new Date("2023-04-10T00:00:00.000+00:00")}}]}).toArray()).map((e)=> e.medicamentosVendidos[0].cantidadVendida);

  const ventas = ventasMarzo.reduce((inicial, final) => inicial + final, 0)


  res.json({
    ventasMarzo: ventas
  });

};

// 15. Obtener el medicamento menos vendido en 2023.

const ObtMmenosVendido = async(req ,res ) => {
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
    Loratadina: 0


  }
  const Ventas = (await conexionDB()).ventas;
  const ventas2023 = (await Ventas.find({$and:[{fechaVenta:{$gte: new Date("2023-01-10T00:00:00.000+00:00")}}, {fechaVenta:{$lt: new Date("2024-01-10T00:00:00.000+00:00")}}]}).toArray()).map((e)=> e.medicamentosVendidos);

  ventas2023.forEach((v)=> {
    if (v.length > 1) {
      v.forEach((e)=> {
        medicinas[`${e.nombreMedicamento}`] += e.cantidadVendida;
      });
      
    }
    medicinas[`${v[0].nombreMedicamento}`] += v[0].cantidadVendida;
  })
  const minNumber = Math.min(...(Object.values(medicinas)));

  const medicamentosArray = Object.entries(medicinas);

  const minMedicamentos = medicamentosArray.filter((e) => e[1] === 1)

  res.json(
   {medicina: minMedicamentos}
  )
}

module.exports = {
  recetas1Enero,
  ventasParacetamol,
  ventasTotal,
  pacientesCparacetamol,
  medicamentosMarzo,
  ObtMmenosVendido
};
