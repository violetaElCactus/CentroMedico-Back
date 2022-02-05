const { response, request } = require("express");
const pool = require("../database");

/**Crea el registro de un nuevo paciente a la base de datos */
const crearPaciente = async (req = request, res = response) => {
  const nuevoPaciente = { ...req.body };
  // const fecha_nacimiento = new Date(
  //   nuevoPaciente.fecha_nacimiento.year,
  //   nuevoPaciente.fecha_nacimiento.month - 1,
  //   nuevoPaciente.fecha_nacimiento.day
  // );
  nuevoPaciente.fecha_nacimiento = `${nuevoPaciente.fecha_nacimiento.year}-${nuevoPaciente.fecha_nacimiento.month}-${nuevoPaciente.fecha_nacimiento.day}`;
  console.log(nuevoPaciente);
  try {
    const pacienteBD = await pool.query("SELECT * FROM pacientes WHERE rut = ?", [nuevoPaciente.rut]);
    if (pacienteBD[0] === undefined) {
      try {
        await pool.query("INSERT INTO pacientes SET ?", [nuevoPaciente]);
        return res.json({
          ok: true,
          msg: "Paciente creado de forma satisfactoria.",
        });
      } catch (error) {
        return res.status(500).json({
          ok: false,
          msg: "Algo salió mal en la creación del paciente",
          error,
        });
      }
    } else {
      return res.status(400).json({
        ok: false,
        msg: "El paciente ya está registrado en el base de datos.",
      });
    }
  } catch (error) {}
  return res.json(nuevoPaciente);
};

/**Obtiene la información relacionada de todos los pacientes */
const obtenerPacientes = async (req = request, res = response) => {
  try {
    const pacientesBD = await pool.query("SELECT * FROM pacientes");
    res.json(pacientesBD);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la obtención de pacientes",
      error,
    });
  }
};

/**Obtiene la información de un paciente */
const obtenerPacientePorRut = async (req = request, res = response) => {
  const rut = req.params.rut;
  try {
    const pacienteBD = await pool.query("SELECT * FROM pacientes WHERE rut = ?", [rut]);
    res.json(pacienteBD[0]);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la obtención del paciente",
      error,
    });
  }
};

/**Actualizar paciente */
const actualizarPacientePorRut = async (req = request, res = response) => {
  const rut = req.params.rut;
  const { fecha_nacimiento, ...pacienteActualizado } = req.body;
  //pacienteActualizado.fecha_nacimiento = new Date(fecha_nacimiento.year, fecha_nacimiento.month - 1, fecha_nacimiento.day);
  pacienteActualizado.fecha_nacimiento = `${fecha_nacimiento.year}-${fecha_nacimiento.month}-${fecha_nacimiento.day}`;
  try {
    await pool.query("UPDATE pacientes SET ? WHERE rut = ?", [pacienteActualizado, rut]);
    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al actualizar el paciente",
      error,
    });
  }
};

module.exports = {
  crearPaciente,
  obtenerPacientes,
  obtenerPacientePorRut,
  actualizarPacientePorRut,
};
