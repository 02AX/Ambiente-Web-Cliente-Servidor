import { Denuncia } from './Denuncia.js';
import { Usuario } from './Usuario.js';
import { Comentario } from './Comentario.js';

// Generar IDs únicos
const generateId = () => Math.random().toString(36).substr(2, 9);

// Fechas de ejemplo
const now = new Date();
const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

// Usuario demo para autenticación
export const USUARIO_DEMO = {
  username: 'admin',
  password: 'password'
};

// Usuarios demo
export const usuariosDemo = [
  new Usuario({
    id: 'user1',
    username: 'admin',
    email: 'admin@denuncias.com',
    fechaRegistro: oneWeekAgo,
    denunciasCreadas: ['den1', 'den2'],
    denunciasLikadas: ['den3', 'den4'],
    comentarios: ['com1', 'com2']
  }),
  new Usuario({
    id: 'user2',
    username: 'ciudadano_activo',
    email: 'ciudadano@email.com',
    fechaRegistro: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    denunciasCreadas: ['den3'],
    denunciasLikadas: ['den1', 'den2'],
    comentarios: ['com3', 'com4']
  }),
  new Usuario({
    id: 'user3',
    username: 'vecino_preocupado',
    email: 'vecino@email.com',
    fechaRegistro: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    denunciasCreadas: ['den4', 'den5'],
    denunciasLikadas: ['den1'],
    comentarios: ['com5']
  })
];

// Denuncias demo
export const denunciasDemo = [
  new Denuncia({
    id: 'den1',
    titulo: 'Semáforo dañado en intersección principal',
    descripcion: 'El semáforo de la intersección entre Avenida Central y Calle 5 ha estado intermitente por tres días. Esto está causando embotellamientos y situaciones peligrosas para peatones y conductores. Urgente reparación.',
    categoria: 'Infraestructura',
    fechaCreacion: twoDaysAgo,
    likes: 47,
    usuarioId: 'user1',
    comentarios: ['com1', 'com2', 'com3']
  }),
  new Denuncia({
    id: 'den2',
    titulo: 'Falta de iluminación en parque municipal',
    descripcion: 'El parque Las Flores no tiene iluminación nocturna funcionando. Varias lámparas están fundidas y otras directamente no funcionan. Esto ha creado un ambiente inseguro durante las noches.',
    categoria: 'Seguridad',
    fechaCreacion: oneDayAgo,
    likes: 32,
    usuarioId: 'user1',
    comentarios: ['com4', 'com5']
  }),
  new Denuncia({
    id: 'den3',
    titulo: 'Contaminación auditiva por construcción',
    descripcion: 'La obra de construcción en la Calle 12 inicia trabajos a las 5:30 AM todos los días, incluyendo fines de semana. El ruido excesivo está afectando el descanso de toda la comunidad.',
    categoria: 'Medio Ambiente',
    fechaCreacion: oneHourAgo,
    likes: 28,
    usuarioId: 'user2',
    comentarios: ['com6']
  }),
  new Denuncia({
    id: 'den4',
    titulo: 'Falta de recolección de basura',
    descripcion: 'En el sector residencial Las Palmas no pasa el camión de basura desde hace una semana. Los desechos se están acumulando y generando malos olores.',
    categoria: 'Servicios Públicos',
    fechaCreacion: twoHoursAgo,
    likes: 19,
    usuarioId: 'user3',
    comentarios: ['com7', 'com8']
  }),
  new Denuncia({
    id: 'den5',
    titulo: 'Hueco peligroso en vía principal',
    descripcion: 'Hay un hueco profundo en la Avenida Norte, justo antes del puente. Ya han ocurrido varios accidentes menores y daños a vehículos. Necesita reparación urgente.',
    categoria: 'Infraestructura',
    fechaCreacion: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    likes: 15,
    usuarioId: 'user3',
    comentarios: ['com9']
  }),
  new Denuncia({
    id: 'den6',
    titulo: 'Problema en el suministro de agua',
    descripcion: 'El barrio Los Almendros lleva 48 horas sin suministro de agua potable. No hay comunicación oficial sobre cuándo se restablecerá el servicio.',
    categoria: 'Servicios Públicos',
    fechaCreacion: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    likes: 12,
    usuarioId: 'user2',
    comentarios: ['com10']
  }),
  new Denuncia({
    id: 'den7',
    titulo: 'Vandalismo en parada de autobús',
    descripcion: 'La parada de autobús frente al centro comercial ha sido vandalizada repetidamente. Los cristales están rotos y hay grafitis ofensivos.',
    categoria: 'Seguridad',
    fechaCreacion: new Date(now.getTime() - 8 * 60 * 60 * 1000),
    likes: 8,
    usuarioId: 'user1',
    comentarios: ['com11']
  }),
  new Denuncia({
    id: 'den8',
    titulo: 'Falta de señalización en zona escolar',
    descripcion: 'La zona escolar de la Escuela Primaria Central no tiene señalización adecuada. Los conductores no reducen la velocidad y ponen en riesgo a los niños.',
    categoria: 'Educación',
    fechaCreacion: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    likes: 6,
    usuarioId: 'user2',
    comentarios: []
  })
];

// Comentarios demo
export const comentariosDemo = [
  new Comentario({
    id: 'com1',
    denunciaId: 'den1',
    usuarioId: 'user2',
    contenido: 'Totalmente de acuerdo. He visto varios accidentes menores por esta situación.',
    fechaCreacion: new Date(twoDaysAgo.getTime() + 2 * 60 * 60 * 1000),
    likes: 8
  }),
  new Comentario({
    id: 'com2',
    denunciaId: 'den1',
    usuarioId: 'user3',
    contenido: 'Ya reporté esto a la municipalidad hace una semana pero no han respondido.',
    fechaCreacion: new Date(twoDaysAgo.getTime() + 4 * 60 * 60 * 1000),
    likes: 5
  }),
  new Comentario({
    id: 'com3',
    denunciaId: 'den1',
    usuarioId: 'user1',
    contenido: 'Deberíamos organizar una petición formal con todas las firmas de los vecinos.',
    fechaCreacion: new Date(twoDaysAgo.getTime() + 6 * 60 * 60 * 1000),
    likes: 12
  }),
  new Comentario({
    id: 'com4',
    denunciaId: 'den2',
    usuarioId: 'user3',
    contenido: 'Mi esposa ya no se atreve a caminar por ahí en las noches. Es una situación muy preocupante.',
    fechaCreacion: new Date(oneDayAgo.getTime() + 1 * 60 * 60 * 1000),
    likes: 6
  }),
  new Comentario({
    id: 'com5',
    denunciaId: 'den2',
    usuarioId: 'user2',
    contenido: 'Conozco a un electricista que podría ayudar voluntariamente si la municipalidad da los materiales.',
    fechaCreacion: new Date(oneDayAgo.getTime() + 3 * 60 * 60 * 1000),
    likes: 9
  }),
  new Comentario({
    id: 'com6',
    denunciaId: 'den3',
    usuarioId: 'user1',
    contenido: 'Hay que verificar si tienen permisos para trabajar en esos horarios. Podría ser una violación.',
    fechaCreacion: new Date(oneHourAgo.getTime() + 30 * 60 * 1000),
    likes: 4
  }),
  new Comentario({
    id: 'com7',
    denunciaId: 'den4',
    usuarioId: 'user1',
    contenido: 'Mismo problema en mi sector. Parece ser un problema generalizado.',
    fechaCreacion: new Date(twoHoursAgo.getTime() + 15 * 60 * 1000),
    likes: 3
  }),
  new Comentario({
    id: 'com8',
    denunciaId: 'den4',
    usuarioId: 'user2',
    contenido: 'Llamé a la empresa de aseo y dijeron que es por falta de personal. Muy mala excusa.',
    fechaCreacion: new Date(twoHoursAgo.getTime() + 45 * 60 * 1000),
    likes: 7
  }),
  new Comentario({
    id: 'com9',
    denunciaId: 'den5',
    usuarioId: 'user2',
    contenido: 'Pasé por ahí ayer y es realmente peligroso. Casi daño la llanta de mi carro.',
    fechaCreacion: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    likes: 2
  }),
  new Comentario({
    id: 'com10',
    denunciaId: 'den6',
    usuarioId: 'user1',
    contenido: 'Esto es inaceptable. Deberíamos exigir una explicación y compensación.',
    fechaCreacion: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    likes: 5
  }),
  new Comentario({
    id: 'com11',
    denunciaId: 'den7',
    usuarioId: 'user3',
    contenido: 'Propongo instalar cámaras de seguridad para identificar a los vándalos.',
    fechaCreacion: new Date(now.getTime() - 7 * 60 * 60 * 1000),
    likes: 1
  })
];

// Noticias destacadas para el inicio
export const noticiasDestacadas = [
  {
    id: 'not1',
    titulo: 'Nueva funcionalidad: Sistema de votación implementado',
    descripcion: 'Ahora puedes votar por las denuncias más importantes para darles mayor visibilidad.',
    fecha: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    tipo: 'sistema'
  },
  {
    id: 'not2',
    titulo: 'Reunión comunitaria este sábado',
    descripcion: 'Se realizará una reunión para discutir las principales problemáticas del sector.',
    fecha: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    tipo: 'comunidad'
  },
  {
    id: 'not3',
    titulo: 'Municipalidad responde a denuncias sobre semáforos',
    descripcion: 'La municipalidad ha programado reparaciones para la próxima semana.',
    fecha: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    tipo: 'respuesta'
  }
];

// Preguntas frecuentes para la sección de soporte
export const preguntasFrecuentes = [
  {
    id: 'faq1',
    pregunta: '¿Cómo puedo crear una denuncia?',
    respuesta: 'Dirígete a la sección "Denuncias" y haz clic en "Crear Nueva Denuncia". Completa el formulario con los detalles de tu problema.'
  },
  {
    id: 'faq2',
    pregunta: '¿Las denuncias son realmente anónimas?',
    respuesta: 'Sí, todas las denuncias se publican de forma anónima. Tu identidad está protegida y no se mostrará públicamente.'
  },
  {
    id: 'faq3',
    pregunta: '¿Qué pasa si mi denuncia recibe muchos likes?',
    respuesta: 'Las denuncias con más likes aparecen primero en el ranking, lo que les da mayor visibilidad para medios y autoridades.'
  },
  {
    id: 'faq4',
    pregunta: '¿Puedo editar mi denuncia después de publicarla?',
    respuesta: 'Por el momento no es posible editar denuncias. Esta funcionalidad se agregará en futuras versiones.'
  },
  {
    id: 'faq5',
    pregunta: '¿Cómo puedo reportar contenido inapropiado?',
    respuesta: 'Puedes reportar contenido inapropiado contactando a través de la sección de soporte.'
  }
];

// Reglas de participación para la comunidad
export const reglasParticipacion = [
  {
    id: 'regla1',
    titulo: 'Respeto mutuo',
    descripcion: 'Mantén un tono respetuoso en todos los comentarios y denuncias.'
  },
  {
    id: 'regla2',
    titulo: 'Información veraz',
    descripcion: 'Proporciona información verdadera y verificable en tus denuncias.'
  },
  {
    id: 'regla3',
    titulo: 'No spam',
    descripcion: 'Evita publicar contenido repetitivo o no relacionado con problemas ciudadanos.'
  },
  {
    id: 'regla4',
    titulo: 'Constructividad',
    descripcion: 'Enfócate en proponer soluciones, no solo en señalar problemas.'
  },
  {
    id: 'regla5',
    titulo: 'Privacidad',
    descripcion: 'No publiques información personal propia o de terceros.'
  }
];

// Funciones de utilidad para obtener datos
export const obtenerDenunciasPorCategoria = (categoria) => {
  if (!categoria) return denunciasDemo;
  return denunciasDemo.filter(denuncia => denuncia.categoria === categoria);
};

export const obtenerDenunciasOrdenadas = (criterio = 'likes') => {
  const denunciasCopia = [...denunciasDemo];
  
  switch (criterio) {
    case 'likes':
      return denunciasCopia.sort((a, b) => b.likes - a.likes);
    case 'fecha':
      return denunciasCopia.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    case 'comentarios':
      return denunciasCopia.sort((a, b) => b.comentarios.length - a.comentarios.length);
    default:
      return denunciasCopia;
  }
};

export const obtenerComentariosPorDenuncia = (denunciaId) => {
  return comentariosDemo.filter(comentario => comentario.denunciaId === denunciaId);
};

export const obtenerUsuarioPorId = (usuarioId) => {
  return usuariosDemo.find(usuario => usuario.id === usuarioId);
};

export const obtenerDenunciaPorId = (denunciaId) => {
  return denunciasDemo.find(denuncia => denuncia.id === denunciaId);
};

// Función para autenticar usuario demo
export const autenticarUsuario = (username, password) => {
  if (username === USUARIO_DEMO.username && password === USUARIO_DEMO.password) {
    return usuariosDemo[0]; // Devuelve el primer usuario como admin
  }
  return null;
}; 