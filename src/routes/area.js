const express = require("express");
const router = express.Router();

const {
    obtenerAreas,
} = require("../controllers/area");

/**Obtiene las distintas areas médicas */
router.get("/:fecha", obtenerAreas);

module.exports = router;
