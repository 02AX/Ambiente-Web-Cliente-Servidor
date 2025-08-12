// Utilidades generales

// Función para truncar texto
export const truncarTexto = (texto, limite = 100, sufijo = '...') => {
  if (!texto) return '';
  if (texto.length <= limite) return texto;
  return texto.substring(0, limite).trim() + sufijo;
};

// Función para limpiar texto
export const limpiarTexto = (texto) => {
  if (!texto) return '';
  return texto.trim().replace(/\s+/g, ' ');
};

// Función para capitalizar primera letra
export const capitalizarPrimeraLetra = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

// Función para capitalizar palabras
export const capitalizarPalabras = (texto) => {
  if (!texto) return '';
  return texto.split(' ')
    .map(palabra => capitalizarPrimeraLetra(palabra))
    .join(' ');
};

// Función para generar ID único
export const generarId = (prefijo = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return prefijo ? `${prefijo}_${timestamp}_${random}` : `${timestamp}_${random}`;
};

// Función para validar email
export const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar URL
export const validarURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Función para formatear números
export const formatearNumero = (numero, decimales = 0) => {
  if (isNaN(numero)) return '0';
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  }).format(numero);
};

// Función para formatear likes de manera amigable
export const formatearLikes = (likes) => {
  if (likes < 1000) return likes.toString();
  if (likes < 1000000) return `${(likes / 1000).toFixed(1)}K`;
  return `${(likes / 1000000).toFixed(1)}M`;
};

// Función para obtener iniciales de un nombre
export const obtenerIniciales = (nombre) => {
  if (!nombre) return '';
  return nombre
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Función para generar color basado en texto
export const generarColorPorTexto = (texto) => {
  if (!texto) return '#64748b';
  
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colores = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];
  
  return colores[Math.abs(hash) % colores.length];
};

// Función para escapar HTML
export const escaparHTML = (texto) => {
  if (!texto) return '';
  
  const mapa = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return texto.replace(/[&<>"']/g, (caracter) => mapa[caracter]);
};

// Función para validar longitud de texto
export const validarLongitud = (texto, min = 0, max = Infinity) => {
  if (!texto) return min === 0;
  const longitud = texto.trim().length;
  return longitud >= min && longitud <= max;
};

// Función para extraer palabras clave
export const extraerPalabrasClave = (texto, limite = 5) => {
  if (!texto) return [];
  
  const palabrasComunes = [
    'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se',
    'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para',
    'al', 'me', 'una', 'todo', 'pero', 'más', 'hacer', 'o', 'puede'
  ];
  
  return texto
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(palabra => palabra.length > 3 && !palabrasComunes.includes(palabra))
    .filter((palabra, index, array) => array.indexOf(palabra) === index)
    .slice(0, limite);
};

// Función para debounce
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Función para throttle
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Función para copiar al portapapeles
export const copiarAlPortapapeles = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (error) {
    // Fallback para navegadores más antiguos
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    const exitoso = document.execCommand('copy');
    document.body.removeChild(textArea);
    return exitoso;
  }
};

// Función para obtener tamaño del archivo
export const formatearTamanoArchivo = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const tamaños = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tamaños[i];
};

// Función para validar archivo
export const validarArchivo = (archivo, tiposPermitidos = [], tamañoMaximo = 5 * 1024 * 1024) => {
  const errores = [];
  
  if (tiposPermitidos.length > 0 && !tiposPermitidos.includes(archivo.type)) {
    errores.push('Tipo de archivo no permitido');
  }
  
  if (archivo.size > tamañoMaximo) {
    errores.push(`El archivo excede el tamaño máximo de ${formatearTamanoArchivo(tamañoMaximo)}`);
  }
  
  return errores;
};

// Función para normalizar texto para búsqueda
export const normalizarTextoParaBusqueda = (texto) => {
  if (!texto) return '';
  
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s]/g, '') // Remover signos de puntuación
    .trim();
};

// Función para resaltar texto en búsqueda
export const resaltarTexto = (texto, termino) => {
  if (!texto || !termino) return texto;
  
  const regex = new RegExp(`(${termino})`, 'gi');
  return texto.replace(regex, '<mark>$1</mark>');
};

// Función para obtener contraste de color
export const obtenerColorContraste = (colorHex) => {
  // Convertir hex a RGB
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);
  
  // Calcular luminosidad
  const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminosidad > 0.5 ? '#000000' : '#ffffff';
};

// Función para verificar si el dispositivo es móvil
export const esMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Función para obtener información del dispositivo
export const obtenerInfoDispositivo = () => {
  return {
    esMobile: esMobile(),
    ancho: window.innerWidth,
    alto: window.innerHeight,
    userAgent: navigator.userAgent,
    idioma: navigator.language
  };
}; 