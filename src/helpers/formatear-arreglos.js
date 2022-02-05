const formatearArreglos = (arreglo) => {
  let valor = "";
  arreglo.forEach((el) => {
    valor = valor + `${el},`;
  });
  console.log(valor);
  return valor;
};

module.exports = {
  formatearArreglos,
};
