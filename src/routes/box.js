const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const {
  crearBox,
  obtenerBoxes,
  obtenerBox,
  actualizarBox,
  obtenerAsignacionBoxPorId,
  obtenerAsignacionBoxes,
  crearAsignacionBox,
  actualizarAsignacion,
} = require("../controllers/box");

/**Ingresar un nuevo box al sistema */
router.post(
  "/new",
  [
    check("nombre", "El nombre es obligarotio").not().isEmpty(),
    check("zona", "El rut es obligarotio").not().isEmpty(),
    check("habilitado", "El rut es obligarotio").not().isEmpty(),
    validarCampos,
  ],
  crearBox
);

/**Obtener todos los usuarios registrados */
router.get("/", obtenerBoxes);

/**Obtener detalle de box */
router.get("/:id_box", obtenerBox);

/**Ingresar un nuevo box al sistema */
router.put(
  "/update/:id_box",
  [
    check("nombre", "El nombre es obligarotio").not().isEmpty(),
    check("zona", "El rut es obligarotio").not().isEmpty(),
    check("habilitado", "El rut es obligarotio").not().isEmpty(),
    validarCampos,
  ],
  actualizarBox
);

/**Obtener asignaciones de todos los box por fecha */
router.get("/asignacion/:fecha", obtenerAsignacionBoxes);

/**Asignar box */
router.post(
  "/asignacion/:fecha/",
  [
    check("manana", "Asignar profesional en la manana es obligatorio").not().isEmpty(),
    check("tarde", "Asignar profesioanl en la tarde es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearAsignacionBox
);

/**Obtener asignaciones del box por ID*/
router.get("/asignacion/:fecha/:id_box", obtenerAsignacionBoxPorId);

/**Actualizar asignación */
router.put(
  "/asignacion/update/:fecha/:id_box",
  [
    check("manana", "Asignar profesional en la manana es obligatorio").not().isEmpty(),
    check("tarde", "Asignar profesioanl en la tarde es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarAsignacion
);
module.exports = router;
