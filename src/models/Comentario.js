export class Comentario {
  constructor({
    id,
    denunciaId,
    usuarioId,
    contenido,
    fechaCreacion,
    likes = 0,
    respuestas = [],
    comentarioPadreId = null,
    anonimo = true,
    estado = 'activo'
  }) {
    this.id = id;
    this.denunciaId = denunciaId;
    this.usuarioId = usuarioId;
    this.contenido = contenido;
    this.fechaCreacion = fechaCreacion;
    this.likes = likes;
    this.respuestas = respuestas;
    this.comentarioPadreId = comentarioPadreId;
    this.anonimo = anonimo;
    this.estado = estado;
  }

  // Método para agregar un like al comentario
  agregarLike() {
    this.likes += 1;
  }

  // Método para quitar un like del comentario
  quitarLike() {
    if (this.likes > 0) {
      this.likes -= 1;
    }
  }

  // Método para agregar una respuesta
  agregarRespuesta(respuestaId) {
    if (!this.respuestas.includes(respuestaId)) {
      this.respuestas.push(respuestaId);
    }
  }

  // Método para obtener fecha formateada
  getFechaFormateada() {
    const fecha = new Date(this.fechaCreacion);
    const ahora = new Date();
    const diferencia = ahora - fecha;
    
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
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  // Método para validar el comentario
  validar() {
    const errores = [];
    
    if (!this.contenido || this.contenido.trim().length < 1) {
      errores.push('El comentario no puede estar vacío');
    }
    
    if (this.contenido && this.contenido.length > 500) {
      errores.push('El comentario no puede tener más de 500 caracteres');
    }
    
    if (!this.denunciaId) {
      errores.push('El comentario debe estar asociado a una denuncia');
    }
    
    if (!this.usuarioId) {
      errores.push('El comentario debe tener un usuario asociado');
    }
    
    return errores;
  }

  // Método para verificar si es una respuesta
  esRespuesta() {
    return this.comentarioPadreId !== null;
  }

  // Método para verificar si es un comentario principal
  esPrincipal() {
    return this.comentarioPadreId === null;
  }

  // Método para obtener el contenido truncado
  getContenidoTruncado(limite = 100) {
    if (this.contenido.length <= limite) {
      return this.contenido;
    }
    return this.contenido.substring(0, limite) + '...';
  }

  // Método para verificar si el comentario tiene palabras ofensivas
  tieneContenidoOfensivo() {
    const palabrasOfensivas = [
      'spam', 'fake', 'mentira', 'falso'
    ];
    
    const contenidoLower = this.contenido.toLowerCase();
    return palabrasOfensivas.some(palabra => 
      contenidoLower.includes(palabra)
    );
  }

  // Método para marcar como inactivo
  marcarInactivo() {
    this.estado = 'inactivo';
  }

  // Método para activar
  activar() {
    this.estado = 'activo';
  }

  // Método para convertir a JSON
  toJSON() {
    return {
      id: this.id,
      denunciaId: this.denunciaId,
      usuarioId: this.usuarioId,
      contenido: this.contenido,
      fechaCreacion: this.fechaCreacion,
      likes: this.likes,
      respuestas: this.respuestas,
      comentarioPadreId: this.comentarioPadreId,
      anonimo: this.anonimo,
      estado: this.estado
    };
  }
}

// Estados de comentario
export const ESTADOS_COMENTARIO = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  REPORTADO: 'reportado',
  ELIMINADO: 'eliminado'
};

// Límites para comentarios
export const LIMITES_COMENTARIO = {
  MIN_CARACTERES: 1,
  MAX_CARACTERES: 500,
  MAX_RESPUESTAS: 10
}; 