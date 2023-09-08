const {Router} = require('express');

const {recetas1Enero, ventasParacetamol,ventasTotal} = require('../controllers/ventas.controllers.js');

const router = Router();

router.get('/ventas/1',recetas1Enero);
router.get('/ventas/paracetamol',ventasParacetamol);
router.get('/ventas/total',ventasTotal);

module.exports = router;