const express = require("express");
const router = express.Router();

const { crearSignosVitales, obtenerSignosVitalesPorConsulta, obtenerSignosVistalesPorPaciente } = require("../controllers/signos-vitales");

router.post("/new", crearSignosVitales);

router.get("/consulta/:id_consulta", obtenerSignosVitalesPorConsulta);

router.get("/paciente/:id_paciente", obtenerSignosVistalesPorPaciente);

module.exports = router;
