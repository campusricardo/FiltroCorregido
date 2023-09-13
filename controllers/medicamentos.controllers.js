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
    const getMedicamentos = await Medicamentos.find().toArray();
    const getProveedores = getMedicamentos.map((e) => {
      return e.proveedor;
    });
    console.log(getProveedores);
    res.json(getProveedores);
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

// 6. Medicamentos que caducan antes del 1 de enero de 2024.

const medicamentosCa1 = async (req, res) => {
  try {
    const Medicamentos = (await conexionDB()).medicamentos;
    // No hay  ningun medicamento que se caduque antes del uno de enero
    const medicamentosCa = await Medicamentos.find({
      fechaExpiracion: { $lt: new Date("2024-01-10T00:00:00.000+00:00") },
    }).toArray();

    res.json(medicamentosCa);
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

// 10. Obtener el medicamento más caro.
const getExpensivest = async (req, res) => {
  try {
    const Medicamentos = (await conexionDB()).medicamentos;
    const medicamentoMax = await Medicamentos.find()
      .sort({ precio: -1 })
      .limit(1)
      .toArray();
    res.json({
      expensivest: medicamentoMax,
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

    const getVentas = await Ventas.distinct(
      "medicamentosVendidos.nombreMedicamento"
    );

    const medicamentos = await Medicamentos.distinct("nombre");

    const verficarMedicamentos = medicamentos.map((m) => {
      for (let i = 0; i > getVentas.length; i++) {
        if (m === getVentas[i]) {
          return "xd";
        }
      }
      return "x";
    });

    res.send("xd");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getMedicamentos,
  getProveedoresMedicamentos,
  medicamentosCa1,
  getExpensivest,
  medicamentosNVen,
};
