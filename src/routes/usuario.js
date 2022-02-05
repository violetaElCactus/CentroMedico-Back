const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  obtenerUsuarios,
  obtenerUsuarioPorRut,
  actualizarUsuarioPorRut,
  validarPin,
  cambiarPassword,
  reestablecerCredenciales,
} = require("../controllers/usuario");

/**Crear nuevo usuario*/
router.post(
  "/new",
  [
    check("rut", "El rut es obligarotio").not().isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("nacimiento", "El email es obligatorio").not().isEmpty(),
    check("telefono", "El email es obligatorio").not().isEmpty(),
    check("correo_electronico", "El email es obligatorio").not().isEmpty(),
    check("sexo", "El email es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearUsuario
);

/**Login de usuario */
router.post(
  "/",
  [check("rut", "El rut es obligatorio").not().isEmail(), check("clave", "La contraseña es obligatoria").isLength({ min: 6 }), validarCampos],
  loginUsuario
);

/**Renovar el token del usuario */
router.get("/renew", validarJWT, revalidarToken);

/**Obtener todos los usuarios registrados */
router.get("/", obtenerUsuarios);

/**Obtener usuarios por un identificador (Rut) */
router.get("/:rut", obtenerUsuarioPorRut);

/**Actualizar información de usuario (Rut) */
router.put("/:rut_id", actualizarUsuarioPorRut);

/**Validar pin*/
router.post("/validar/:rut", [check("pin", "El PIN es obligatorio").not().isEmpty()], validarPin);

/**Reestablecer credenciales */
router.get("/reestablecer/:rut", reestablecerCredenciales);

/**Cambiar contraseña */
router.put("/cambiar_password/:rut", cambiarPassword);
module.exports = router;
