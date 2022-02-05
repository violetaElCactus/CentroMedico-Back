const { response, request } = require("express");
const pool = require("../database");
const { joinTablaMedicina, joinTablaAtencionUsuarios, joinTablaUsuarioCita, busquedaCie10 } = require("../helpers/queries");

const obtenerCitasMedicaPorRutFecha = async (req = request, res = response) => {
  const { id_medico, fecha } = req.params;
  try {
    const consulta = await joinTablaMedicina(id_medico, fecha);
    const citasBD = await pool.query(consulta);
    return res.json(citasBD);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener consulta por id médico y fecha",
      error,
    });
  }
};

const buscarDiagnosticoCIE = async (req = request, res = response) => {
  const { termino_busqueda } = req.params;
  try {
    const diagnosticoQuery = await busquedaCie10(termino_busqueda);
    const diagnosticosDB = await pool.query(diagnosticoQuery);
    console.log(diagnosticosDB);
    return res.json(diagnosticosDB);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al realizar la búsqueda del término",
      error,
    });
  }
};

const crearDiagnostico = async (req = request, res = response) => {
  const { antecedentes, atencion } = req.body;
  const { id_cita } = atencion;
  /**Transforma en string los array de antecedente */
  antecedentes.morb = antecedentes.morb.toString();
  antecedentes.drogas = antecedentes.drogas.toString();

  /**Trasnforma la info de FUR */
  if (antecedentes.fecha_ult_regla !== "") {
    antecedentes.fecha_ult_regla = `${antecedentes.fecha_ult_regla.year}-${antecedentes.fecha_ult_regla.month}-${antecedentes.fecha_ult_regla.day}`;
  }

  /**Trasnforma en string los array de objetos de atención */
  atencion.planest_ad = JSON.stringify(atencion.planest_ad);
  atencion.med_ad = JSON.stringify(atencion.med_ad);
  atencion.intern = JSON.stringify(atencion.intern);
  console.log(atencion);
  try {
    await pool.query("INSERT INTO antecedentes_adultos SET ?", [antecedentes]);
    await pool.query("INSERT INTO atencion_mgeneral SET ?", [atencion]);
    await pool.query("UPDATE consulta SET estado = 'atendida' WHERE id_consulta = ?", [id_cita]);
    return res.json({
      ok: true,
      msg: "Se ingresaron los antecedentes y atención con éxito",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al ingresar antecedentes o atención",
      error,
    });
  }
};

obtenerAntecedentesPorRut = async (req = request, res = response) => {
  const { id_paciente } = req.params;
  try {
    const antecedentesBD = await pool.query("SELECT * FROM antecedentes_adultos WHERE rut_paciente = ? ORDER BY id_antadultos DESC", id_paciente);
    return res.json(antecedentesBD[0]);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al buscar antecedentes",
      error,
    });
  }
};

obtenerAtencionesPorRut = async (req = request, res = response) => {
  const { id_paciente } = req.params;
  try {
    const consulta = await joinTablaAtencionUsuarios(id_paciente);
    const atencionBD = await pool.query(consulta);
    console.log(atencionBD);
    return res.json(atencionBD);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener las atenciones",
      error,
    });
  }
};

obtenerAtencionPorCita = async (req = request, res = response) => {
  const { id_cita } = req.params;
  try {
    const consulta = await joinTablaUsuarioCita(id_cita);
    const atencionBD = await pool.query(consulta);
    return res.json(atencionBD[0]);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener la atención",
      error,
    });
  }
};

crearCertificado = async (req = request, res = response) => {
  const { certificado } = req.body;
  try {
    await pool.query("INSERT INTO certificados SET ?", [certificado]);
    return res.json({
      ok: true,
      msg: "Certificado creado de forma exitosa",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al crear certificado",
      error,
    });
  }
};

obtenerCertificadosPorRut = async (req = request, res = response) => {
  const { id_paciente } = req.params;
  try {
    const certificadosBD = await pool.query("SELECT * FROM certificados WHERE id_paciente = ?", [id_paciente]);
    return res.json(certificadosBD);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener los certificados",
      error,
    });
  }
};

module.exports = {
  obtenerCitasMedicaPorRutFecha,
  buscarDiagnosticoCIE,
  crearDiagnostico,
  obtenerAntecedentesPorRut,
  obtenerAtencionesPorRut,
  obtenerAtencionPorCita,
  obtenerCertificadosPorRut,
  crearCertificado,
};
