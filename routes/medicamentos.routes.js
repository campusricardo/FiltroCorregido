const {Router} = require('express');

const {getMedicamentos, getProveedoresMedicamentos, medicamentosCa1} = require('../controllers/medicamentos.controllers.js');

const router = Router();

router.get('/medicamentos/50',getMedicamentos);
router.get('/medicamentos/proveedores',getProveedoresMedicamentos);
router.get('/medicamentos/caducados',medicamentosCa1);

module.exports = router;