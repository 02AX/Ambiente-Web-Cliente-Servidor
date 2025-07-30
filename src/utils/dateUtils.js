// Utilidades para manejo de fechas

export const formatearFecha = (fecha) => {
  if (!fecha) return '';
  
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatearFechaCompleta = (fecha) => {
  if (!fecha) return '';
  
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatearTiempoRelativo = (fecha) => {
  if (!fecha) return '';
  
  const fechaObj = new Date(fecha);
  const ahora = new Date();
  const diferencia = ahora - fechaObj;
  
  // Convertir diferencia a minutos
  const minutos = Math.floor(diferencia / (1000 * 60));
  
  if (minutos < 1) {
    return 'Hace un momento';
  } else if (minutos < 60) {
    return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  } else if (minutos < 1440) { // 24 horas
    const horas = Math.floor(minutos / 60);
    return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
  } else if (minutos < 10080) { // 7 días
    const dias = Math.floor(minutos / 1440);
    return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
  } else {
    return formatearFecha(fecha);
  }
};

export const esHoy = (fecha) => {
  if (!fecha) return false;
  
  const fechaObj = new Date(fecha);
  const hoy = new Date();
  
  return fechaObj.toDateString() === hoy.toDateString();
};

export const esEstaSeamana = (fecha) => {
  if (!fecha) return false;
  
  const fechaObj = new Date(fecha);
  const hoy = new Date();
  const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
  
  return fechaObj >= inicioSemana;
};

export const obtenerDiaDeLaSemana = (fecha) => {
  if (!fecha) return '';
  
  const fechaObj = new Date(fecha);
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  return dias[fechaObj.getDay()];
};

export const obtenerMes = (fecha) => {
  if (!fecha) return '';
  
  const fechaObj = new Date(fecha);
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  return meses[fechaObj.getMonth()];
};

export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();
  
  if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad;
};

export const formatearDuracion = (milisegundos) => {
  const segundos = Math.floor(milisegundos / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) {
    return `${dias} día${dias > 1 ? 's' : ''}`;
  } else if (horas > 0) {
    return `${horas} hora${horas > 1 ? 's' : ''}`;
  } else if (minutos > 0) {
    return `${minutos} minuto${minutos > 1 ? 's' : ''}`;
  } else {
    return `${segundos} segundo${segundos > 1 ? 's' : ''}`;
  }
};

export const obtenerRangoFechas = (inicio, fin) => {
  const fechaInicio = new Date(inicio);
  const fechaFin = new Date(fin);
  
  if (fechaInicio.toDateString() === fechaFin.toDateString()) {
    return formatearFecha(fechaInicio);
  }
  
  return `${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`;
};

export const esFechaValida = (fecha) => {
  return fecha instanceof Date && !isNaN(fecha.getTime());
};

export const convertirAFecha = (valor) => {
  if (valor instanceof Date) return valor;
  if (typeof valor === 'string' || typeof valor === 'number') {
    const fecha = new Date(valor);
    return esFechaValida(fecha) ? fecha : null;
  }
  return null;
}; 