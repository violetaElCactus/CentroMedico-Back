const { response, request } = require("express");
const pool = require("../database");

/**
 * Función que permite ingresar un nuevo box en la base de datos.
 */
const crearBox = async (req = request, res = response) => {
  const { nombre, zona, etiquetasUso, habilitado } = req.body;
  const nuevoBox = { nro_box: nombre, zona, uso: etiquetasUso, habilitado };
  console.log(nuevoBox);
  try {
    await pool.query("INSERT INTO lugar SET ?", [nuevoBox]);
    return res.json({
      ok: true,
      msg: "Box creado de forma satisfactoria",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la creación del box",
      error,
    });
  }
};

/**
 * Obtener información de los box ingresados al sistema
 */
const obtenerBoxes = async (req = request, res = response) => {
  try {
    const boxesDB = await pool.query("SELECT * FROM lugar ORDER BY zona,nro_box");
    return res.status(200).json(boxesDB);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la obtención de boxes",
      error,
    });
  }
};

/**
 * Obtener la información de un box
 */
const obtenerBox = async (req = request, res = response) => {
  const id_box = req.params.id_box;
  console.log(id_box);
  try {
    const boxDB = await pool.query("SELECT * FROM lugar WHERE id_lugar = ?", [id_box]);
    console.log(boxDB);
    return res.json({
      id_lugar: boxDB[0].id_lugar,
      zona: boxDB[0].zona,
      nro_box: boxDB[0].nro_box,
      uso: boxDB[0].uso,
      habilitado: boxDB[0].habilitado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la obtención del box",
      error,
    });
  }
};

/**
 * Actualizar la información de un box
 */
const actualizarBox = async (req = request, res = response) => {
  const id_box = req.params.id_box;
  const { nombre, zona, etiquetasUso, habilitado } = req.body;
  const boxActualizado = { nro_box: nombre, zona, uso: etiquetasUso, habilitado };
  try {
    await pool.query("UPDATE lugar set ? WHERE id_lugar = ?", [boxActualizado, id_box]);
    return res.json({
      ok: true,
      msg: "Box actualizado de forma satisfactoria",
      boxActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la actualización del box",
      error,
    });
  }
};

/**
 * Permite obtener las asignaciones realizadas a los box de atención.
 */
const obtenerAsignacionBoxes = async (req = request, res = response) => {
  const { fecha } = req.params;
  try {
    const asignacionesBD = await pool.query(
      "SELECT lu.id_box, lg.nro_box, lg.zona, lu.manana, lu.tarde FROM lugar_uso lu, lugar lg WHERE fecha = ? and lu.id_box = lg.id_lugar",
      [fecha]
    );
    return res.json(asignacionesBD);
  } catch (error) {
    return res.json(500).json({
      ok: false,
      msg: "Ocurrió un error obteniendo las asignaciones",
      error,
    });
  }
};

const obtenerAsignacionBoxPorId = async (req = request, res = response) => {
  const { fecha, id_box } = req.params;
  console.log(fecha);
  try {
    const asignacionBD = await pool.query("SELECT * FROM lugar_uso WHERE fecha = ? and id_box = ?", [fecha, id_box]);
    return res.json(asignacionBD);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la obtención del box",
      error,
    });
  }
};

const crearAsignacionBox = async (req = request, res = response) => {
  const { fecha } = req.params;
  const { id_box, manana, tarde } = req.body;
  const nuevaAsignacion = { id_box, fecha, manana, tarde };
  try {
    await pool.query("INSERT INTO lugar_uso SET ?", [nuevaAsignacion]);
    return res.json({
      ok: true,
      msg: "Se agrego un nuevo box",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algio salió mala al asignar un box",
      error,
    });
  }
};

const actualizarAsignacion = async (req = request, res = response) => {
  const { id_box, fecha } = req.params;
  console.log(id_box, fecha);
  const { manana, tarde } = req.body;
  const asignacionActualizada = { fecha, id_box: id_box, manana, tarde };
  try {
    const asignacionBD = await pool.query("UPDATE lugar_uso set ? WHERE id_box = ? and fecha = ?", [asignacionActualizada, id_box, fecha]);
    return res.json({
      ok: true,
      msg: "Asignación actualizada de forma satisfactoria",
      asignacionBD,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la actualización de la asignación",
      error,
    });
  }
};
module.exports = {
  crearBox,
  obtenerBoxes,
  obtenerBox,
  actualizarBox,
  obtenerAsignacionBoxes,
  obtenerAsignacionBoxPorId,
  crearAsignacionBox,
  actualizarAsignacion,
};
