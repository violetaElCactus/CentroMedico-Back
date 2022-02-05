const { response, request } = require("express");
const pool = require("../database");


  const obtenerAreas = async (req = request, res = response) => {
  const { fecha } = req.params;
  let date = fecha.split("-");
  let fechaFinal = date[0] + '-' + date[1] + '-%';
    try {
      const areas = await pool.query("select am.valor especialidad, count(c.area_medica) atendidas, c.fecha fecha from consulta c, area_medica am where c.estado = 'atendida' and c.fecha like ? and c.area_medica = am.id group by c.area_medica, am.valor, c.fecha",[fechaFinal]);
      console.log(areas);
      return res.json(areas);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: "Algo salió mal en la obtención de áreas médicas",
        error,
      });
    }
  };

  module.exports = {
    obtenerAreas,
  };