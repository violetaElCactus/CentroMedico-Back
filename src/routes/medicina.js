const express = require("express");
const router = express.Router();

const {
  obtenerCitasMedicaPorRutFecha,
  buscarDiagnosticoCIE,
  crearDiagnostico,
  obtenerAtencionesPorRut,
  obtenerAtencionPorCita,
  obtenerCertificadosPorRut,
  crearCertificado,
} = require("../controllers/medicina");

router.post("/new", crearDiagnostico);

/**Obtiene las citas asociadas a un profesional de la salud en un día en específico */
router.get("/cita/:id_medico/:fecha", obtenerCitasMedicaPorRutFecha);

router.get("/cie10/:termino_busqueda", buscarDiagnosticoCIE);

router.get("/antecedentes/:id_paciente", obtenerAntecedentesPorRut);

router.get("/atenciones/:id_paciente", obtenerAtencionesPorRut);

router.get("/atenciones/cita/:id_cita", obtenerAtencionPorCita);

router.post("/certificados/new", crearCertificado);

router.get("/certificados/:id_paciente", obtenerCertificadosPorRut);

module.exports = router;
