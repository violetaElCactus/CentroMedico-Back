const obtenerCantidadPorSexoDia = (especialidad, dia) => {
  return `
  select 'mujer' sexo, count(*) cantidad from consulta c, pacientes p where c.id_paciente = p.rut and p.sexo = 'mujer' and c.fecha = '${dia}' and c.area_medica = '${especialidad}' and c.estado <> 'creada' 
  UNION 
  select 'hombre', count(*) cantidad from consulta c, pacientes p where c.id_paciente = p.rut and p.sexo = 'hombre' and c.fecha = '${dia}' and c.area_medica = '${especialidad}' and c.estado <> 'creada' 
  UNION 
  select 'nsp', count(*) cantidad from consulta c WHERE c.estado = 'creada' and c.fecha = '${dia}' and c.area_medica = '${especialidad}'
  `;
};

const obtenerCantidadPorTipoDia = (especialidad, dia) => {
  return `
  SELECT 'ingreso' tipo, count(1) cantidad from consulta where area_medica = '${especialidad}' and fecha = '${dia}' and tipo = 'ingreso'
    UNION
    SELECT 'control', count(1) cantidad from consulta where area_medica = '${especialidad}' and fecha = '${dia}' and tipo = 'control'
    `;
};

const obtenerProcedimientosPorFecha = (dia) => {
  return `
    select lu.nro_box, v.cantidad 
    from lugar lu, 
        (   SELECT lugar_atencion as id, count(1) cantidad 
            from consulta 
            where consulta.lugar_atencion in ( 
                SELECT id_lugar 
                FROM lugar 
                WHERE zona = 'procedimiento') and fecha = '${dia}' 
                GROUP by lugar_atencion) v 
    where v.id = lu.id_lugar 
    `;
};

const obtenerEspecialidadesPorFecha = (dia) => {
  return `
    SELECT am.valor, v.cantidad 
    FROM area_medica am, (( SELECT area_medica, COUNT(1) cantidad 
                            FROM consulta 
                            WHERE fecha = '${dia}' and area_medica <> 'medicina_general' and area_medica <> 'pediatria'
                            GROUP by area_medica))v 
    WHERE am.id = v.area_medica 
    `;
};

const obtenerCitasEspecialidadPorFecha = (dia) => {
  return `
    SELECT am.valor, v.cantidad 
    FROM area_medica am, (( SELECT area_medica, COUNT(1) cantidad 
                            FROM consulta 
                            WHERE fecha = '${dia}'
                            GROUP by area_medica))v 
    WHERE am.id = v.area_medica 
    `;
};
module.exports = {
  obtenerCantidadPorSexoDia,
  obtenerCantidadPorTipoDia,
  obtenerProcedimientosPorFecha,
  obtenerEspecialidadesPorFecha,
  obtenerCitasEspecialidadPorFecha,
};
