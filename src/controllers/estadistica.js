const { response, request } = require("express");
const res = require("express/lib/response");
const pool = require("../database");
const {
  obtenerCantidadPorSexoDia,
  obtenerCantidadPorTipoDia,
  obtenerProcedimientosPorFecha,
  obtenerEspecialidadesPorFecha,
  obtenerCitasEspecialidadPorFecha,
} = require("../helpers/queries-estadistica");
const { obtenerCitasPorSemestre } = require("../helpers/semestres-citas");

const dashboardDatosTarjetas = async (req = request, res = response) => {
  try {
    const estadistica = { cantidad_profesionales: 0, cantidad_box: 0, cantidad_citas: 0 };
    const profesionalesBD = await pool.query("SELECT COUNT(profesional) 'cant_pro' FROM usuario_roles WHERE profesional = 1");
    const boxBD = await pool.query("SELECT COUNT(id_lugar) 'cant_box' FROM lugar");
    const citasBD = await pool.query("SELECT COUNT(id_consulta) 'cant_citas' FROM consulta");
    estadistica.cantidad_profesionales = profesionalesBD[0].cant_pro;
    estadistica.cantidad_box = boxBD[0].cant_box;
    estadistica.cantidad_citas = citasBD[0].cant_citas;
    return res.json(estadistica);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener las estadísticas del centro médico",
      error,
    });
  }
};

const citasSemestre = async (req = request, res = response) => {
  const { fecha } = req.params;
  const cantidad = [];
  let bdRes;
  try {
    const mesesQuery = await obtenerCitasPorSemestre(fecha);
    for (let i = 0; i < 6; i++) {
      bdRes = await pool.query(mesesQuery[i]);
      cantidad[i] = bdRes[0];
    }
    console.log(bdRes);
    return res.json(cantidad);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener los datos",
      error,
    });
  }
};

const citasPorDia = async (req = request, res = response) => {
  const { fecha } = req.params;
  try {
    const citasBD = await pool.query("SELECT * FROM consulta WHERE fecha = ?", [fecha]);
    return res.json(citasBD);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al buscar las citas del día",
      error,
    });
  }
};

const estadisticasDelDia = async (req = request, res = response) => {
  const { fecha } = req.params;
  try {
    /**Declaración de objetos */
    const medicina_adulto = {};
    const pediatricas = {};

    /**Medicina General*/
    const consultaSexoMG = await obtenerCantidadPorSexoDia("medicina_general", fecha);
    const consultaTipoMG = await obtenerCantidadPorTipoDia("medicina_general", fecha);
    const sexoBD = await pool.query(consultaSexoMG);
    const tipoBD = await pool.query(consultaTipoMG);
    medicina_adulto.tabla = "medicina_adulto";
    medicina_adulto.control = tipoBD[0].cantidad;
    medicina_adulto.ingreso = tipoBD[1].cantidad;
    medicina_adulto.mujer = sexoBD[0].cantidad;
    medicina_adulto.hombre = sexoBD[1].cantidad;
    medicina_adulto.nsp = sexoBD[2].cantidad;

    /**Pediatría*/
    const consultaSexoP = await obtenerCantidadPorSexoDia("pediatria", fecha);
    const consultaTipoP = await obtenerCantidadPorTipoDia("pediatria", fecha);
    const sexoP = await pool.query(consultaSexoP);
    const tipoP = await pool.query(consultaTipoP);
    pediatricas.tabla = "pediatricas";
    pediatricas.control = tipoP[0].cantidad;
    pediatricas.ingreso = tipoP[1].cantidad;
    pediatricas.mujer = sexoP[0].cantidad;
    pediatricas.hombre = sexoP[1].cantidad;
    pediatricas.nsp = sexoP[2].cantidad;
    return res.json([medicina_adulto, pediatricas]);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en estadísticas por día",
      error,
    });
  }
};

const estadisticasDeProcedimientos = async (req = request, res = response) => {
  const { fecha } = req.params;
  try {
    const query = await obtenerProcedimientosPorFecha(fecha);
    const procBD = await pool.query(query);
    return res.json(procBD);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la obtención de procedimientos",
      error,
    });
  }
};

const estadisticasDeEspecialidades = async (req = request, res = response) => {
  const { fecha } = req.params;
  try {
    const query = await obtenerEspecialidadesPorFecha(fecha);
    const espBD = await pool.query(query);
    return res.json(espBD);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la obtención de procedimientos",
      error,
    });
  }
};

const cantCitasEspecialidadPorFecha = async (req = request, res = response) => {
  const { fecha } = req.params;
  try {
    const query = await obtenerCitasEspecialidadPorFecha(fecha);
    const espBD = await pool.query(query);
    return res.json(espBD);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la obtención de procedimientos",
      error,
    });
  }
};

module.exports = {
  dashboardDatosTarjetas,
  citasSemestre,
  citasPorDia,
  estadisticasDelDia,
  estadisticasDeProcedimientos,
  estadisticasDeEspecialidades,
  cantCitasEspecialidadPorFecha,
};
