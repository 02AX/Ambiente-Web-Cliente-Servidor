export class Usuario {
  constructor({
    id,
    username,
    email,
    fechaRegistro,
    denunciasCreadas = [],
    denunciasLikadas = [],
    comentarios = [],
    configuraciones = {
      notificaciones: true,
      mostrarPerfil: false,
      modoAnonimo: true
    }
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.fechaRegistro = fechaRegistro;
    this.denunciasCreadas = denunciasCreadas;
    this.denunciasLikadas = denunciasLikadas;
    this.comentarios = comentarios;
    this.configuraciones = configuraciones;
  }

  // Método para agregar una denuncia creada
  agregarDenunciaCreada(denunciaId) {
    if (!this.denunciasCreadas.includes(denunciaId)) {
      this.denunciasCreadas.push(denunciaId);
    }
  }

  // Método para agregar/quitar like a una denuncia
  toggleLikeDenuncia(denunciaId) {
    const index = this.denunciasLikadas.indexOf(denunciaId);
    if (index > -1) {
      this.denunciasLikadas.splice(index, 1);
      return false; // Like removido
    } else {
      this.denunciasLikadas.push(denunciaId);
      return true; // Like agregado
    }
  }

  // Método para verificar si el usuario ha likeado una denuncia
  hasLikedDenuncia(denunciaId) {
    return this.denunciasLikadas.includes(denunciaId);
  }

  // Método para agregar un comentario
  agregarComentario(comentarioId) {
    if (!this.comentarios.includes(comentarioId)) {
      this.comentarios.push(comentarioId);
    }
  }

  // Método para obtener estadísticas del usuario
  getEstadisticas() {
    return {
      denunciasCreadas: this.denunciasCreadas.length,
      denunciasLikadas: this.denunciasLikadas.length,
      comentarios: this.comentarios.length,
      fechaRegistro: this.getFechaRegistroFormateada()
    };
  }

  // Método para obtener fecha de registro formateada
  getFechaRegistroFormateada() {
    const fecha = new Date(this.fechaRegistro);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Método para actualizar configuraciones
  actualizarConfiguraciones(nuevasConfiguraciones) {
    this.configuraciones = { ...this.configuraciones, ...nuevasConfiguraciones };
  }

  // Método para validar datos del usuario
  validar() {
    const errores = [];
    
    if (!this.username || this.username.trim().length < 3) {
      errores.push('El nombre de usuario debe tener al menos 3 caracteres');
    }
    
    if (!this.email || !this.isValidEmail(this.email)) {
      errores.push('Debe proporcionar un email válido');
    }
    
    return errores;
  }

  // Método para validar email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para obtener el nombre de usuario mostrable
  getDisplayName() {
    if (this.configuraciones.modoAnonimo) {
      return 'Usuario Anónimo';
    }
    return this.username;
  }

  // Método para convertir a JSON
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      fechaRegistro: this.fechaRegistro,
      denunciasCreadas: this.denunciasCreadas,
      denunciasLikadas: this.denunciasLikadas,
      comentarios: this.comentarios,
      configuraciones: this.configuraciones
    };
  }
}

// Tipos de usuario
export const TIPOS_USUARIO = {
  REGULAR: 'regular',
  MODERADOR: 'moderador',
  ADMIN: 'admin'
};

// Configuraciones por defecto
export const CONFIGURACIONES_DEFAULT = {
  notificaciones: true,
  mostrarPerfil: false,
  modoAnonimo: true,
  tema: 'light',
  idioma: 'es'
}; 