const {Router} = require('express');

const {medicamentosA,proveedorVentas} = require('../controllers/compras.controllers.js');

const router = Router();

router.get('/compras/A',medicamentosA);
router.get('/compras/prov',proveedorVentas);

module.exports = router;