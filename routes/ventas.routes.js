const { Router } = require("express");

const {
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
  pacientesNoCompras2023,
  medicamentosVendidosMes,
  empleadosDistintos,
  pacientesGastos,
  medicamentosNoVendidos2023,
  medicamentosTrimestre,
  medicamentosAbril
} = require("../controllers/ventas.controllers.js");

const router = Router();

router.get("/ventas/1", recetas1Enero);
router.get("/ventas/paracetamol", ventasParacetamol);
router.get("/ventas/total", ventasTotal);
router.get("/ventas/pacientes/paracetamol", pacientesCparacetamol);
router.get("/ventas/marzo", medicamentosMarzo);
router.get("/ventas/2023", ObtMmenosVendido);
router.get("/ventas/promedio", promedioMedicamentos);
router.get("/ventas/empleados", ventasEmpleados);
router.get("/ventas/5", ventasEmpleados5);
router.get("/ventas/nunca", nuncaVendidos);
router.get("/ventas/mas", pacienteMasDinero);
router.get("/ventas/empleados/no", empleadosNoVentas);
router.get("/ventas/pacientes/paracetamol/2023", pacientesParacetamol);
router.get("/ventas/empleados/5", empleadosmenos5);
router.get("/ventas/por/mes", getMedicamentosPORmes);
router.get("/ventas/pacientes/no", pacientesNoCompras2023);
router.get("/ventas/medicamentos/mes", medicamentosVendidosMes);
router.get("/ventas/empleados/disc", empleadosDistintos);
router.get("/ventas/pacientes/gastos", pacientesGastos);
router.get("/ventas/medicamentos/no", medicamentosNoVendidos2023);
router.get("/ventas/medicamentos/trimestre", medicamentosTrimestre);
router.get("/ventas/medicamentos/abril", medicamentosAbril);

module.exports = router;
