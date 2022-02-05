const express = require("express");
const router = express.Router();

const { crearPaciente, obtenerPacientes, obtenerPacientePorRut, actualizarPacientePorRut } = require("../controllers/paciente");

/**Crear paciente */
router.post("/new", crearPaciente);

/**Obtener todos los pacientes */
router.get("/", obtenerPacientes);

/**Obtener paciente por rut */
router.get("/:rut", obtenerPacientePorRut);

/**Actualizar paciente por rut */
router.put("/:rut", actualizarPacientePorRut);

module.exports = router;
