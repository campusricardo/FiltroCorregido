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

module.exports = {
  recetas1Enero,
  ventasParacetamol,
  ventasTotal,
};
