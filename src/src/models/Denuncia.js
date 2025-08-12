export class Denuncia {
  constructor({
    id,
    titulo,
    descripcion,
    categoria,
    fechaCreacion,
    likes = 0,
    comentarios = [],
    usuarioId,
    anonimo = true,
    estado = 'activa'
  }) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.fechaCreacion = fechaCreacion;
    this.likes = likes;
    this.comentarios = comentarios;
    this.usuarioId = usuarioId;
    this.anonimo = anonimo;
    this.estado = estado;
  }

  // Método para agregar un like
  agregarLike() {
    this.likes += 1;
  }

  // Método para quitar un like
  quitarLike() {
    if (this.likes > 0) {
      this.likes -= 1;
    }
  }

  // Método para agregar un comentario
  agregarComentario(comentario) {
    this.comentarios.push(comentario);
  }

  // Método para obtener fecha formateada
  getFechaFormateada() {
    const fecha = new Date(this.fechaCreacion);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para obtener el color de la categoría
  getCategoriaColor() {
    const colores = {
      'Seguridad': '#ef4444',
      'Infraestructura': '#f59e0b',
      'Medio Ambiente': '#10b981',
      'Servicios Públicos': '#3b82f6',
      'Transporte': '#8b5cf6',
      'Salud': '#06b6d4',
      'Educación': '#84cc16',
      'Otros': '#64748b'
    };
    return colores[this.categoria] || '#64748b';
  }

  // Método para validar la denuncia
  validar() {
    const errores = [];
    
    if (!this.titulo || this.titulo.trim().length < 5) {
      errores.push('El título debe tener al menos 5 caracteres');
    }
    
    if (!this.descripcion || this.descripcion.trim().length < 10) {
      errores.push('La descripción debe tener al menos 10 caracteres');
    }
    
    if (!this.categoria) {
      errores.push('Debe seleccionar una categoría');
    }
    
    return errores;
  }

  // Método para convertir a JSON
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      descripcion: this.descripcion,
      categoria: this.categoria,
      fechaCreacion: this.fechaCreacion,
      likes: this.likes,
      comentarios: this.comentarios,
      usuarioId: this.usuarioId,
      anonimo: this.anonimo,
      estado: this.estado
    };
  }
}

// Categorías disponibles
export const CATEGORIAS = [
  'Seguridad',
  'Infraestructura',
  'Medio Ambiente',
  'Servicios Públicos',
  'Transporte',
  'Salud',
  'Educación',
  'Otros'
];

// Estados de denuncia
export const ESTADOS_DENUNCIA = {
  ACTIVA: 'activa',
  CERRADA: 'cerrada',
  EN_REVISION: 'en_revision'
}; 