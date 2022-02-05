/**
 * Retorna un string con una query que permite proyectar los datos de los usuarios.
 * Discúlpeme por esta herejía profes 😢
 */
const seleccionarInfoUsuario = () => {
  return `
    SELECT us.rut, us.nombre, us.apellido, us.fecha_nacimiento, us.telefono, us.correo_electronico, us.sexo, ur.coordinacion, ur.direccion, ur.profesional, ur.administrativo, ur.medicina_general, ur.pediatria,  ur.cardiologia,ur.cirugia,ur.gine_obste,ur.traumatologia,ur.psiquiatria,ur.nutricion,ur.matroneria,ur.enfermeria, ur.tens,ur.tec_medica,ur.radiologia,ur.kinesiologia,ur.recepcion,ur.farmacia FROM usuario us, usuario_roles ur WHERE us.rut = ur.id_usuario
  `;
};

/**
 * Retorna un string con una query que permite proyectar los datos de UN usuario,
 * identificandolo con su rut.
 */
const seleccionarInfoUsuarioPorRut = () => {
  return `
      SELECT us.rut, us.nombre, us.apellido, us.fecha_nacimiento, us.telefono, us.correo_electronico, us.sexo, ur.coordinacion, ur.direccion, ur.profesional, ur.administrativo, ur.medicina_general, ur.pediatria,  ur.cardiologia,ur.cirugia,ur.gine_obste,ur.traumatologia,ur.psiquiatria,ur.nutricion,ur.matroneria,ur.enfermeria, ur.tens,ur.tec_medica,ur.radiologia,ur.kinesiologia,ur.recepcion,ur.farmacia FROM usuario us, usuario_roles ur WHERE us.rut = ? and us.rut = ur.id_usuario
    `;
};

const formatearInfoUsuario = (usuario) => {
  const arrayMedica = [
    "medicina_general",
    "pediatria",
    "cardiologia",
    "cirugia",
    "gine_obste",
    "traumatologia",
    "psiquiatria",
    "nutricion",
    "matroneria",
    "enfermeria",
    "tens",
    "tec_medica",
    "radiologia",
    "kinesiologia",
  ];

  const arrayAdministrativo = ["recepcion", "farmacia"];

  nacimientoTemp = toString(usuario.fecha_nacimiento);

  const usuarioReturn = {
    rut: usuario.rut,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    nacimiento: {
      year: usuario.fecha_nacimiento.getFullYear(),
      month: usuario.fecha_nacimiento.getMonth() + 1,
      day: usuario.fecha_nacimiento.getDate(),
    },
    sexo: usuario.sexo,
    correo_electronico: usuario.correo_electronico,
    telefono: usuario.telefono,
    coordinacion: usuario.coordinacion === 1 ? true : false,
    profesional: usuario.profesional === 1 ? true : false,
    direccion: usuario.direccion === 1 ? true : false,
    administrativo: usuario.administrativo === 1 ? true : false,
    area_medica: [],
    area_administrativa: [],
  };

  arrayMedica.map((item) => {
    if (usuario[item] === 1) usuarioReturn.area_medica.push(item);
  });

  arrayAdministrativo.map((item) => {
    if (usuario[item] === 1) usuarioReturn.area_administrativa.push(item);
  });
  console.log(usuarioReturn);
  return usuarioReturn;
};

module.exports = {
  seleccionarInfoUsuario,
  seleccionarInfoUsuarioPorRut,
  formatearInfoUsuario,
};
