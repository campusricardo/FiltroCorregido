const {Router} = require('express');

const {recetas1Enero, ventasParacetamol,ventasTotal, pacientesCparacetamol, medicamentosMarzo, ObtMmenosVendido, promedioMedicamentos, ventasEmpleados, ventasEmpleados5} = require('../controllers/ventas.controllers.js');

const router = Router();

router.get('/ventas/1',recetas1Enero);
router.get('/ventas/paracetamol',ventasParacetamol);
router.get('/ventas/total',ventasTotal);
router.get('/ventas/pacientes/paracetamol',pacientesCparacetamol);
router.get('/ventas/marzo',medicamentosMarzo);
router.get('/ventas/2023',ObtMmenosVendido);
router.get('/ventas/promedio',promedioMedicamentos);
router.get('/ventas/empleados',ventasEmpleados);
router.get('/ventas/5',ventasEmpleados5);


module.exports = router;