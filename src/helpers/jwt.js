const jwt = require("jsonwebtoken");

const generarJWT = (rut, nombre) => {
  console.log(rut, nombre);
  const payload = { rut, nombre };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "8h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generarJWT,
};
