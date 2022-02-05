/**Permite obtener las regiones y comunas desde la base de datos */
const { response, request } = require("express");
const pool = require("../database");

const obtenerRegiones = async (req = request, res = response) => {
  try {
    const regionesBD = await pool.query("SELECT * FROM regiones");
    return res.json(regionesBD);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "No se pudieron encontrar las regiones",
      error,
    });
  }
};

const obtenerComunas = async (req = request, res = response) => {
  const region = req.params.region;
  try {
    const comunasBD = await pool.query("SELECT * FROM comunas WHERE id_region = ?", [region]);
    return res.json(comunasBD);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "No se pudieron encontrar las comunas",
      errors,
    });
  }
};

module.exports = {
  obtenerRegiones,
  obtenerComunas,
};
