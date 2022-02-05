/**Permite obtener las regiones y comunas desde la base de datos */
const express = require("express");
const router = express.Router();

const { obtenerRegiones, obtenerComunas } = require("../controllers/territorio");

router.get("/regiones", obtenerRegiones);

router.get("/comunas/:region", obtenerComunas);

module.exports = router;
