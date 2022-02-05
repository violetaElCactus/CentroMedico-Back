const arrayMedicina = [
  "medicina_general",
  "pediatria",
  "cardiologia",
  "cirugia",
  "gine_obste",
  "traumatologia",
  "psiquiatria",
  "nutricion",
  "matroneria",
  "tec_medica",
  "radiologia",
  "kinesiologia",
];

const seleccionarRoles = async (roles) => {
  const arrayRolesTemp = [];
  const arrayRoles = [];
  for (const [key, value] of Object.entries(roles)) {
    if (value === 1) {
      arrayRolesTemp.push(key);
    }
  }

  arrayRolesTemp.map((rol) => {
    if (arrayMedicina.includes(rol) && !arrayRoles.includes("medicina")) {
      arrayRoles.push("medicina");
    }
    if (rol === "recepcion") arrayRoles.push("recepcion");
    if (rol === "tens" || rol === "enfermeria") arrayRoles.push("enfermeria");
    if (rol === "coordinacion") arrayRoles.push("coordinacion");
    if (rol === "direccion") arrayRoles.push("direccion");
  });
  return arrayRoles;
};
module.exports = {
  seleccionarRoles,
};
