const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../database");
const { generarJWT } = require("../helpers/jwt");
const { formatearRolUsuario } = require("../helpers/formatear-rol-usuario");
const { seleccionarInfoUsuario, seleccionarInfoUsuarioPorRut, formatearInfoUsuario } = require("../helpers/formatear-info-usuario");
const { seleccionarRoles } = require("../helpers/seleccionar-roles");

/**Función que permite ingresar un nuevo usuario en la base de datos.
 * Verifica si el usuario ya está registrado en la base de datos.
 * Cifra la contraseña en la base de datos, utilizando bcrypt.
 */
const crearUsuario = async (req = request, res = response) => {
  //Extrae la infomación enviada por el formulario
  const { rut, nombre, apellido, nacimiento, telefono, correo_electronico, sexo } = req.body;
  const { coordinacion, profesional, direccion, administrativo, area_medica, area_administrativa } = req.body;

  //Crea la contraseña y el pin de seguridad
  const fecha_nacimiento = new Date(nacimiento.year, nacimiento.month - 1, nacimiento.day);
  const clave = "cm_" + rut.slice(0, rut.length - 2);
  const pin = Math.floor(Math.random() * 90000) + 10000;

  //Objeto que se guardará en la tabla usuario
  const nuevoUsuario = { rut, nombre, apellido, fecha_nacimiento, telefono, clave, correo_electronico, sexo, pin };
  //Objeto que se guardará en la tabla rol
  let rolTemp = { coordinacion, profesional, direccion, administrativo, area_medica, area_administrativa };

  //Realiza las operaciones para verificar e ingresar un usuario
  try {
    const usuarioDB = await pool.query("SELECT * FROM usuario WHERE rut = ?", [nuevoUsuario.rut]);
    if (usuarioDB[0] === undefined) {
      try {
        const salt = bcrypt.genSaltSync();
        nuevoUsuario.clave = bcrypt.hashSync(clave, salt);
        await pool.query("INSERT INTO usuario SET ?", [nuevoUsuario]);
        const nuevoRol = await formatearRolUsuario(rut, rolTemp);
        await pool.query("INSERT INTO usuario_roles SET ?", [nuevoRol]);
        return res.json({
          ok: true,
          msg: "Usuario creado de forma satisfactoria.",
        });
      } catch (error) {
        return res.status(500).json({
          ok: false,
          msg: "Algo salió mal en la creación del usuario",
          error,
        });
      }
    } else {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya está registrado en el base de datos.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la búsqueda del usuario",
      error,
    });
  }
};

/**Función que maneja el ingreso de usuarios al sistema.
 * Verifica si el usuario existe en el sistema y si la contraseña
 * enviada es la correcta utilizando bcrypt.
 */
const loginUsuario = async (req = request, res = response) => {
  const { rut, clave } = req.body;
  try {
    let usuarioDB = await pool.query("SELECT * FROM usuario WHERE rut = ?", [rut]);
    if (usuarioDB[0] === undefined) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    const passwordValida = bcrypt.compareSync(clave, usuarioDB[0].clave);
    if (!passwordValida) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña no es la correcta",
      });
    }

    const usuarioRolDB = await pool.query("SELECT * FROM usuario_roles WHERE id_usuario = ?", [rut]);
    const usuarioRoles = await seleccionarRoles(usuarioRolDB[0]);
    const token = await generarJWT(usuarioDB[0].rut, usuarioDB[0].nombre);
    return res.json({
      ok: true,
      uid: usuarioDB[0].id,
      rut: usuarioDB[0].rut,
      nombre: usuarioDB[0].nombre,
      apellido: usuarioDB[0].apellido,
      rol: usuarioRoles,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en el ingreso al sistema.",
    });
  }
};

const revalidarToken = async (req = request, res = response) => {
  const { rut } = req;
  try {
    const usuarioDB = await pool.query("SELECT * FROM usuario WHERE rut = ?", [rut]);
    const token = await generarJWT(rut, usuarioDB[0].nombre);
    return res.json({
      ok: true,
      rut,
      nombre: usuarioDB[0].nombre,
      apellido: usuarioDB[0].apellido,
      rol: usuarioDB[0].rol,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Validación de token: El usuario no se encontró en el sistema.",
    });
  }
};

/**Obtiene algunos datos los usuarios registrados */
const obtenerUsuarios = async (req = request, res = response) => {
  try {
    const usuariosDB = await pool.query(seleccionarInfoUsuario());
    return res.json(usuariosDB);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al buscar todos los usuarios",
      error,
    });
  }
};

/**Obtiene información de un usuario y formatea los datos para su envio */
const obtenerUsuarioPorRut = async (req = request, res = response) => {
  const rut = req.params.rut;
  console.log(rut);
  try {
    const usuarioDB = await pool.query(seleccionarInfoUsuarioPorRut(), [rut]);
    const usuarioFormateado = await formatearInfoUsuario(usuarioDB[0]);
    return res.json(usuarioFormateado);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al buscar usuario",
      error,
    });
  }
};

/**Actualiza la información de un usuario */
const actualizarUsuarioPorRut = async (req = request, res = response) => {
  const { rut_id } = req.params;
  console.log(rut_id);
  const { rut, nombre, apellido, nacimiento, telefono, correo_electronico, sexo } = req.body;
  const { coordinacion, profesional, direccion, administrativo, area_medica, area_administrativa } = req.body;

  const fecha_nacimiento = new Date(nacimiento.year, nacimiento.month - 1, nacimiento.day);
  const usuarioActualizado = { rut, nombre, apellido, fecha_nacimiento, telefono, correo_electronico, sexo };
  let rolTemp = { coordinacion, profesional, direccion, administrativo, area_medica, area_administrativa };
  const nuevoRol = await formatearRolUsuario(rut, rolTemp);
  try {
    await pool.query("UPDATE usuario SET ? WHERE rut = ?", [usuarioActualizado, rut_id]);
    await pool.query("UPDATE usuario_roles SET ? WHERE id_usuario = ?", [nuevoRol, rut_id]);
    return res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al actualizar el usuario",
      error,
    });
  }
};

const validarPin = async (req = request, res = response) => {
  const { rut } = req.params;
  const { pin } = req.body;
  try {
    const usuarioDB = await pool.query("SELECT pin from usuario WHERE rut = ?", [rut]);
    if (usuarioDB[0].pin === parseInt(pin)) {
      return res.json({
        ok: true,
        msg: "Pin válido",
      });
    } else {
      return res.status(400).json({
        ok: false,
        msg: "Pin inválido",
        usuario: usuarioDB[0].pin,
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al momento de buscar usuario",
      error,
    });
  }
};

const reestablecerCredenciales = async (req = request, res = response) => {
  const { rut } = req.params;
  const clave = "cm_" + rut.slice(0, rut.length - 2);
  const pin = Math.floor(Math.random() * 90000) + 10000;
  try {
    const salt = bcrypt.genSaltSync();
    const clave_hash = bcrypt.hashSync(clave, salt);
    const resBD = await pool.query("UPDATE usuario SET clave = ?, pin = ? WHERE rut = ?", [clave_hash, pin, rut]);
    console.log(resBD);
    // const credenciales = { clave, pin };
    return res.json({
      clave,
      pin,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al momento de buscar usuario",
      error,
    });
  }
};

/**Cambiar contraseña */
const cambiarPassword = async (req = request, res = response) => {
  const rut = req.params.rut;
  const { passwordVieja, passwordNueva } = req.body;
  try {
    usuarioDB = await pool.query("SELECT * FROM usuario WHERE rut = ?", [rut]);
    const passwordValida = bcrypt.compareSync(passwordVieja, usuarioDB[0].clave);
    if (!passwordValida) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña no es la correcta",
      });
    }
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(passwordNueva, salt);
    await pool.query("UPDATE usuario SET clave = ? WHERE rut = ?", [passwordHash, rut]);
    return res.json({
      ok: true,
      msg: "Contraseña modificada de forma satisfactoria",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Algo salió mal en la creación del usuario",
    });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  obtenerUsuarios,
  obtenerUsuarioPorRut,
  actualizarUsuarioPorRut,
  validarPin,
  reestablecerCredenciales,
  cambiarPassword,
};
