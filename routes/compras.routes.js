const { Router } = require("express");

const {
  medicamentosA,
  proveedorVentas,
  proveeNMA,
  ganaciasProveedores,
  proveedor2023,
  proveedoresMedicamentos2023
} = require("../controllers/compras.controllers.js");

const router = Router();

router.get("/compras/A", medicamentosA);
router.get("/compras/prov", proveedorVentas);
router.get("/compras/prov", proveedorVentas);
router.get("/compras/provnoventas", proveeNMA);
router.get("/compras/ganancias", ganaciasProveedores);
router.get("/compras/proveeodor/mas", proveedor2023);
router.get("/compras/proveedores/2023", proveedoresMedicamentos2023);

module.exports = router;
