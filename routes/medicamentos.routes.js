const { Router } = require("express");

const {
  getMedicamentos,
  getProveedoresMedicamentos,
  medicamentosCa1,
  getExpensivest,
  medicamentosNVen,
  medicamentosPproveedor
} = require("../controllers/medicamentos.controllers.js");

const router = Router();

router.get("/medicamentos/50", getMedicamentos);
router.get("/medicamentos/proveedores", getProveedoresMedicamentos);
router.get("/medicamentos/caducados", medicamentosCa1);
router.get("/medicamentos/caro", getExpensivest);
router.get("/medicamentos/novendidos", medicamentosNVen);
router.get("/medicamentos/nproveedores", medicamentosPproveedor);
module.exports = router;
