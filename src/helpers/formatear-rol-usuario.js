/**/
const formatearRolUsuario = (id, rol) => {
  /**Registro que se insertará en la tabla de roles en la BD */
  const rolRegistro = {
    id_usuario: id,
    coordinacion: 0,
    direccion: 0,
    profesional: 0,
    administrativo: 0,
    medicina_general: 0,
    pediatria: 0,
    cardiologia: 0,
    cirugia: 0,
    gine_obste: 0,
    traumatologia: 0,
    psiquiatria: 0,
    nutricion: 0,
    matroneria: 0,
    enfermeria: 0,
    tens: 0,
    tec_medica: 0,
    radiologia: 0,
    kinesiologia: 0,
    recepcion: 0,
    farmacia: 0,
  };

  const unidadesArray = ["coordinacion", "profesional", "direccion", "administrativo"];
  unidadesArray.map((item) => {
    if (rol[item]) rolRegistro[item] = 1;
  });
  rol.area_medica.map((item) => {
    rolRegistro[item] = 1;
  });
  rol.area_administrativa.map((item) => {
    rolRegistro[item] = 1;
  });
  return rolRegistro;
};

module.exports = {
  formatearRolUsuario,
};
