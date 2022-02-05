const express = require("express");
const router = express.Router();

const {
  dashboardDatosTarjetas,
  citasSemestre,
  citasPorDia,
  estadisticasDelDia,
  estadisticasDeProcedimientos,
  estadisticasDeEspecialidades,
  cantCitasEspecialidadPorFecha,
} = require("../controllers/estadistica");

/**Obtener datos para el dashboard del administrador */
router.get("/dashboard", dashboardDatosTarjetas);

/**Obtener la cantidad de citas del último semestre */
router.get("/dashboard/:fecha", citasSemestre);

/**Obtener las citas del días */
router.get("/citas/:fecha", citasPorDia);

/**Estadísticas de citas del día*/
router.get("/citas/dia/:fecha", estadisticasDelDia);

/**Estadísticas de procedimientos del día*/
router.get("/procedimientos/dia/:fecha", estadisticasDeProcedimientos);

/**Estadísticas de especialidades del día */
router.get("/especialidades/dia/:fecha", estadisticasDeEspecialidades);



module.exports = router;
