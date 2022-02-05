const { response, request } = require("express");
const pool = require("../database");

const crearSignosVitales = async (req = request, res = response) => {
  const nuevosSignosVitales = req.body;
  const { id_usuario_sv } = req.body;
  try {
    const signosVitalesBD = await pool.query("INSERT INTO signosvitales SET ?", nuevosSignosVitales);
    const signosVitalesId = signosVitalesBD.insertId;
    if (signosVitalesId !== null || signosVitalesId !== undefined || signosVitalesId !== {}) {
      await pool.query("UPDATE consulta SET id_usuario_sv = ?, csv = 1, id_signosvitales = ?", [id_usuario_sv, signosVitalesId]);
      return res.json({
        ok: true,
        msg: "Signos vitales registrados de forma correcta",
      });
    } else {
      return res.status(500).json({
        ok: false,
        msg: "Algo salió mal al recuperar la ID de los signos vitales creados",
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo ocurrió al momento de crear los signos médicos",
      error,
    });
  }
};

const obtenerSignosVitalesPorConsulta = async (req = request, res = response) => {
  const idConsulta = req.params.id_consulta;
  try {
    const signosVitalesDB = await pool.query("SELECT * FROM signosvitales WHERE id_consulta = ? ORDER BY id_signosvitales DESC", [idConsulta]);
    return res.json(signosVitalesDB[0]);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal al buscar los signos vitales por ID de consulta",
      error,
    });
  }
};

const obtenerSignosVistalesPorPaciente = async (req = request, res = response) => {
  const idPaciente = req.params.id_paciente;
  try {
    const signosVitalesBD = await pool.query("SELECT * FROM signosvitales WHERE id_paciente = ? ORDER BY fecha,id_signosvitales DESC", [idPaciente]);
    if (signosVitalesBD.length === 0) {
      return res.json(signosVitalesBD);
    } else {
      return res.json(signosVitalesBD[0]);
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal al buscar los signos vitales por ID de paciente",
      error,
    });
  }
};
module.exports = {
  crearSignosVitales,
  obtenerSignosVitalesPorConsulta,
  obtenerSignosVistalesPorPaciente,
};
