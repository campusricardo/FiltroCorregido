const { Router } = require("express");

const {
  getMedicamentos,
  getProveedoresMedicamentos,
  medicamentosCa1,
  getExpensivest,
  medicamentosNVen,
  medicamentosPproveedor,
  expM2024,
  proveedoresStock
} = require("../controllers/medicamentos.controllers.js");

const router = Router();

router.get("/medicamentos/50", getMedicamentos);
router.get("/medicamentos/proveedores", getProveedoresMedicamentos);
router.get("/medicamentos/caducados", medicamentosCa1);
router.get("/medicamentos/caro", getExpensivest);
router.get("/medicamentos/novendidos", medicamentosNVen);
router.get("/medicamentos/nproveedores", medicamentosPproveedor);
router.get("/medicamentos/exp/2024", expM2024);
router.get("/medicamentos/menos/50", proveedoresStock);
module.exports = router;
