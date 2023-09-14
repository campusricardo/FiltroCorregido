const {Router} = require('express');

const {medicamentosA,proveedorVentas, proveeNMA, ganaciasProveedores} = require('../controllers/compras.controllers.js');

const router = Router();

router.get('/compras/A',medicamentosA);
router.get('/compras/prov',proveedorVentas);
router.get('/compras/prov',proveedorVentas);
router.get('/compras/provnoventas',proveeNMA);
router.get('/compras/ganancias',ganaciasProveedores);

module.exports = router;