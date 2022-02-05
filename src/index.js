const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

/**Inicialización del servidor */
const app = express();

/**Configuraciones */
app.set("port", process.env.PORT_SERVER || 5000);
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

/**Rutas */
app.use("/api/usuario", require("./routes/usuario"));
app.use("/api/box", require("./routes/box"));
app.use("/api/paciente", require("./routes/paciente"));
app.use("/api/cita", require("./routes/cita"));
app.use("/api/estadistica", require("./routes/estadistica"));
app.use("/api/territorio", require("./routes/territorio"));
app.use("/api/signosvitales", require("./routes/signos-vitales"));
app.use("/api/medicina", require("./routes/medicina"));
app.use("/api/areas", require("./routes/area"));

/**Levantar el servidor */
app.listen(app.get("port"), () => {
  console.log("\x1b[36m%s\x1b[0m", "Back end del sistema del centro medico");
  console.log("Escuchando el servidor desde el puerto: ", app.get("port"));
});
