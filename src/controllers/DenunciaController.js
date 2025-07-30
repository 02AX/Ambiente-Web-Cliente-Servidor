import { 
  denunciasDemo, 
  comentariosDemo, 
  obtenerDenunciasPorCategoria, 
  obtenerDenunciasOrdenadas,
  obtenerComentariosPorDenuncia,
  obtenerDenunciaPorId
} from '../models/demoData.js';
import { Denuncia, CATEGORIAS } from '../models/Denuncia.js';
import { Comentario } from '../models/Comentario.js';
import authController from './AuthController.js';

class DenunciaController {
  constructor() {
    this.denuncias = [...denunciasDemo];
    this.comentarios = [...comentariosDemo];
    this.listeners = [];
  }

  // Método para obtener todas las denuncias
  getAllDenuncias() {
    return this.denuncias;
  }

  // Método para obtener denuncias filtradas por categoría
  getDenunciasByCategoria(categoria) {
    return obtenerDenunciasPorCategoria(categoria);
  }

  // Método para obtener denuncias ordenadas
  getDenunciasOrdenadas(criterio = 'likes') {
    return obtenerDenunciasOrdenadas(criterio);
  }

  // Método para obtener una denuncia por ID
  getDenunciaById(id) {
    return obtenerDenunciaPorId(id);
  }

  // Método para crear una nueva denuncia
  crearDenuncia(datosForm) {
    try {
      // Verificar autenticación
      if (!authController.isUserAuthenticated()) {
        return {
          success: false,
          message: 'Debe estar autenticado para crear una denuncia'
        };
      }

      // Generar ID único
      const id = this.generateId();
      
      // Crear nueva denuncia
      const nuevaDenuncia = new Denuncia({
        id,
        titulo: datosForm.titulo,
        descripcion: datosForm.descripcion,
        categoria: datosForm.categoria,
        fechaCreacion: new Date(),
        usuarioId: authController.getCurrentUser().id
      });

      // Validar la denuncia
      const errores = nuevaDenuncia.validar();
      if (errores.length > 0) {
        return {
          success: false,
          message: 'Errores de validación',
          errores: errores
        };
      }

      // Agregar a la lista de denuncias
      this.denuncias.unshift(nuevaDenuncia);
      
      // Agregar a las denuncias creadas del usuario
      const currentUser = authController.getCurrentUser();
      currentUser.agregarDenunciaCreada(id);
      
      // Notificar listeners
      this.notifyListeners();
      
      return {
        success: true,
        message: 'Denuncia creada exitosamente',
        denuncia: nuevaDenuncia
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear la denuncia'
      };
    }
  }

  // Método para dar like a una denuncia
  toggleLikeDenuncia(denunciaId) {
    try {
      // Verificar autenticación
      if (!authController.isUserAuthenticated()) {
        return {
          success: false,
          message: 'Debe estar autenticado para dar like'
        };
      }

      const denuncia = this.denuncias.find(d => d.id === denunciaId);
      if (!denuncia) {
        return {
          success: false,
          message: 'Denuncia no encontrada'
        };
      }

      const currentUser = authController.getCurrentUser();
      const hasLiked = currentUser.hasLikedDenuncia(denunciaId);

      if (hasLiked) {
        // Quitar like
        denuncia.quitarLike();
        currentUser.toggleLikeDenuncia(denunciaId);
        
        return {
          success: true,
          message: 'Like removido',
          liked: false,
          likes: denuncia.likes
        };
      } else {
        // Agregar like
        denuncia.agregarLike();
        currentUser.toggleLikeDenuncia(denunciaId);
        
        return {
          success: true,
          message: 'Like agregado',
          liked: true,
          likes: denuncia.likes
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error al procesar el like'
      };
    }
  }

  // Método para agregar comentario a una denuncia
  agregarComentario(denunciaId, contenido) {
    try {
      // Verificar autenticación
      if (!authController.isUserAuthenticated()) {
        return {
          success: false,
          message: 'Debe estar autenticado para comentar'
        };
      }

      const denuncia = this.denuncias.find(d => d.id === denunciaId);
      if (!denuncia) {
        return {
          success: false,
          message: 'Denuncia no encontrada'
        };
      }

      // Generar ID único para el comentario
      const comentarioId = this.generateId();
      
      // Crear nuevo comentario
      const nuevoComentario = new Comentario({
        id: comentarioId,
        denunciaId: denunciaId,
        usuarioId: authController.getCurrentUser().id,
        contenido: contenido,
        fechaCreacion: new Date()
      });

      // Validar comentario
      const errores = nuevoComentario.validar();
      if (errores.length > 0) {
        return {
          success: false,
          message: 'Error de validación',
          errores: errores
        };
      }

      // Agregar comentario a la lista
      this.comentarios.push(nuevoComentario);
      
      // Agregar comentario a la denuncia
      denuncia.agregarComentario(comentarioId);
      
      // Agregar al usuario
      const currentUser = authController.getCurrentUser();
      currentUser.agregarComentario(comentarioId);
      
      // Notificar listeners
      this.notifyListeners();
      
      return {
        success: true,
        message: 'Comentario agregado exitosamente',
        comentario: nuevoComentario
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al agregar comentario'
      };
    }
  }

  // Método para obtener comentarios de una denuncia
  getComentariosByDenuncia(denunciaId) {
    return obtenerComentariosPorDenuncia(denunciaId);
  }

  // Método para obtener categorías disponibles
  getCategorias() {
    return CATEGORIAS;
  }

  // Método para obtener estadísticas generales
  getEstadisticas() {
    const stats = {
      totalDenuncias: this.denuncias.length,
      totalComentarios: this.comentarios.length,
      totalLikes: this.denuncias.reduce((total, d) => total + d.likes, 0),
      categorias: {}
    };

    // Contar denuncias por categoría
    CATEGORIAS.forEach(categoria => {
      stats.categorias[categoria] = this.denuncias.filter(d => d.categoria === categoria).length;
    });

    return stats;
  }

  // Método para buscar denuncias
  buscarDenuncias(termino) {
    const terminoLower = termino.toLowerCase();
    return this.denuncias.filter(denuncia => 
      denuncia.titulo.toLowerCase().includes(terminoLower) ||
      denuncia.descripcion.toLowerCase().includes(terminoLower)
    );
  }

  // Método para obtener denuncias recientes
  getDenunciasRecientes(limite = 5) {
    return this.denuncias
      .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
      .slice(0, limite);
  }

  // Método para obtener denuncias populares
  getDenunciasPopulares(limite = 5) {
    return this.denuncias
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limite);
  }

  // Método para obtener denuncias del usuario actual
  getMisDenuncias() {
    if (!authController.isUserAuthenticated()) {
      return [];
    }
    
    const currentUser = authController.getCurrentUser();
    return this.denuncias.filter(denuncia => 
      currentUser.denunciasCreadas.includes(denuncia.id)
    );
  }

  // Método para obtener denuncias con mis likes
  getDenunciasConMisLikes() {
    if (!authController.isUserAuthenticated()) {
      return [];
    }
    
    const currentUser = authController.getCurrentUser();
    return this.denuncias.filter(denuncia => 
      currentUser.denunciasLikadas.includes(denuncia.id)
    );
  }

  // Método para verificar si el usuario ha dado like a una denuncia
  hasUserLikedDenuncia(denunciaId) {
    if (!authController.isUserAuthenticated()) {
      return false;
    }
    
    const currentUser = authController.getCurrentUser();
    return currentUser.hasLikedDenuncia(denunciaId);
  }

  // Método para generar ID único
  generateId() {
    return 'den_' + Math.random().toString(36).substr(2, 9);
  }

  // Método para agregar listener de cambios
  addListener(listener) {
    this.listeners.push(listener);
  }

  // Método para remover listener
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Método para notificar listeners
  notifyListeners() {
    this.listeners.forEach(listener => {
      listener({
        denuncias: this.denuncias,
        comentarios: this.comentarios
      });
    });
  }

  // Método para obtener denuncias por zona (futuro)
  getDenunciasByZona(zona) {
    // Implementar cuando se agregue geolocalización
    return this.denuncias;
  }

  // Método para reportar denuncia (futuro)
  reportarDenuncia(denunciaId, motivo) {
    // Implementar sistema de reportes
    return {
      success: true,
      message: 'Denuncia reportada exitosamente'
    };
  }
}

// Crear instancia única del controlador (Singleton)
const denunciaController = new DenunciaController();

export default denunciaController; 