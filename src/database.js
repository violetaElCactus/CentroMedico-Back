const mysql = require("mysql");
const { promisify } = require("util");
const { database } = require("./keys");

const pool = mysql.createPool(database);

pool.getConnection((err, con) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("La conexión con la base de datos fue cerrada");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("La base de datos tiene muchas conexiones");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("La conexión con la base de datos fue rechazada");
    }
  }
  if (con) {
    con.release();
    console.log("Base de datos conectada");
  }
  return;
});

pool.query = promisify(pool.query);
module.exports = pool;
