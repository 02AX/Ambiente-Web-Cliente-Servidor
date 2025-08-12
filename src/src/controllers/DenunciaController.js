import { 
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig.js';
import { Denuncia, CATEGORIAS } from '../models/Denuncia.js';
import { Comentario } from '../models/Comentario.js';
import { comentariosDemo } from '../models/demoData.js';

class DenunciaController {
  constructor() {
    this.listeners = [];
  }

  // Método para obtener todas las denuncias
  async getAllDenuncias() {
    const denunciasCol = collection(db, 'denuncias');
    const snapshot = await getDocs(denunciasCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Método para obtener denuncias filtradas por categoría
  async getDenunciasByCategoria(categoria) {
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, where('categoria', '==', categoria));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Método para obtener denuncias ordenadas
  async getDenunciasOrdenadas(criterio = 'likes') {
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, orderBy(criterio, 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Método para obtener una denuncia por ID
  async getDenunciaById(id) {
    const docRef = doc(db, 'denuncias', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  }

  // Método para crear una nueva denuncia
  async crearDenuncia(datosForm) {
    try {
      // Verificar autenticación
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'Se debe de estar autenticado para crear una denuncia'};
      }

      // Generar ID único
      const id = this.generateId();
      
      // Crear nueva denuncia
      const nuevaDenuncia = new Denuncia({
        titulo: datosForm.titulo,
        descripcion: datosForm.descripcion,
        categoria: datosForm.categoria,
        fechaCreacion: new Date(),
        usuarioId: user.uid,
        likes: 0,
        comentarios: []
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

      const denunciasCol = collection(db, 'denuncias');
      const docRef = await addDoc(denunciasCol, {
        titulo: nuevaDenuncia.titulo,
        descripcion: nuevaDenuncia.descripcion,
        categoria: nuevaDenuncia.categoria,
        fechaCreacion: nuevaDenuncia.fechaCreacion,
        usuarioId: nuevaDenuncia.usuarioId,
        likes: 0,
        comentarios: []
      });

      // Agregar a las denuncias creadas del usuario
      
      // Notificar listeners
      this.notifyListeners();
      
      return {
        success: true,
        message: 'Denuncia creada exitosamente',
        denuncia: {id: docRef.id, ...nuevaDenuncia } 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear la denuncia'
      };
    }
  }

  // Método para dar like a una denuncia
  async toggleLikeDenuncia(denunciaId) {
    try {
      // Verificar autenticación
      const user = auth.currentUser;
      if (!user)
      {
        return { success: false, message: 'Se debe de estar autenticado para dar like '};
      }

      const docRef = doc(db, 'denuncias', denunciaId);
      const docSnap = await getDoc(docRef);
    
      if (!docSnap.exists()) return { success: false, message: 'Denuncia no encontrada' };

      const denunciaData = docSnap.data();

      let usuariosQueDieronLike = denunciaData.usuariosQueDieronLike || [];
      let likes = denunciaData.likes || 0;

      const hasLiked = usuariosQueDieronLike.includes(user.uid);

      if (hasLiked) {
        // Quitar like
        usuariosQueDieronLike = usuariosQueDieronLike.filter(uid => uid !== user.uid);
        likes = Math.max(0, likes - 1);
      } else {
        // Agregar like
        usuariosQueDieronLike.push(user.uid);
        likes += 1;
      }

      await updateDoc(docRef, {
        usuariosQueDieronLike,
        likes
      });

      this.notifyListeners();

      return {
        success: true,
        message: hasLiked ? 'Like eliminado: ' : 'Like agregado correctamente',
        liked: !hasLiked,
        likes
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al procesar el like'
      };
    }
  }

  // Método para agregar comentario a una denuncia
  async agregarComentario(denunciaId, contenido) {
    try {
      // Verificar autenticación
      if (!authController.isUserAuthenticated()) {
        return {
          success: false,
          message: 'Debe estar autenticado para comentar'
        };
      }

     const docRef = doc(db, 'denuncias', denunciaId);
     const docSnap = await getDoc(docRef);
     if (!docSnap.exists()) return { success: false, message: 'La denuncia no fue encontrada'};

     const nuevaFecha = new Date() 
      // Crear nuevo comentario
     const nuevoComentario = new Comentario({
        contenido,
        fechaCreacion: nuevaFecha,
        usuarioId: user.uid,
        denunciaId
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

      const comentariosCol = collection(db, 'comentarios');
      const comentarioDocRef = await addDoc(comentariosCol, {
        contenido,
        fechaCreacion: nuevaFecha,
        usuarioId: user.uid,
        denunciaId
      });

      const denunciaData = docSnap.data();
      const comentariosIds = denunciaData.comentarios || [];
      comentariosIds.push(comentarioDocRef.id);
      await updateDoc(docRef, { comentarios: comentariosIds });

      // Notificar listeners
      this.notifyListeners();
      
      return {
        success: true,
        message: 'Comentario agregado exitosamente',  comentario: { id: comentarioDocRef.id, ...nuevoComentario },
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
  async getComentariosByDenuncia(denunciaId) {
    const comentariosCol = collection(db, 'comentarios');
    const q = query(comentariosCol, where('denunciaId', '==', denunciaId), orderBy('fechaCreacion', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Método para obtener categorías disponibles
  getCategorias() {
    return CATEGORIAS;
  }

  // Método para obtener estadísticas generales
  async getEstadisticas() {
    const denuncias = await this.getAllDenuncias();
    const comentariosCol = collection(db, 'comentarios');
    const comentariosSnapshot = await getDocs(comentariosCol);

    const stats = {
      totalDenuncias: denuncias.length,
      totalComentarios: comentariosSnapshot.size,
      totalLikes: denuncias.reduce((total, d) => total + (d.likes || 0), 0),
      categorias: {}
    };

    CATEGORIAS.forEach(categoria => {
      stats.categorias[categoria] = denuncias.filter(d => d.categoria === categoria).length;
    });

    return stats;
  }

  // Método para buscar denuncias
  async buscarDenuncias(termino) {
   const denuncias = await this.getAllDenuncias();
    const terminoLower = termino.toLowerCase();
    return denuncias.filter(d => 
      d.titulo.toLowerCase().includes(terminoLower) || 
      d.descripcion.toLowerCase().includes(terminoLower)
    );
  }

  // Método para obtener denuncias recientes
  async getDenunciasRecientes(limite = 5) {
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, orderBy('fechaCreacion', 'desc'), limit(limite));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Método para obtener denuncias populares
  async getDenunciasPopulares(limite = 5) {
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, orderBy('likes', 'desc'), limit(limite));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Método para obtener denuncias del usuario actual
  async getMisDenuncias() {
    const user = auth.currentUser;
    if (!user) return [];
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, where('usuarioId', '==', user.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Método para obtener denuncias con mis likes
  async getDenunciasConMisLikes() {
     const user = auth.currentUser;
    if (!user) return [];

    const denunciasCol = collection(db, 'denuncias');
    const snapshot = await getDocs(denunciasCol);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(d => Array.isArray(d.usuariosQueDieronLike) && d.usuariosQueDieronLike.includes(user.uid));
  }

  // Método para verificar si el usuario ha dado like a una denuncia
  async hasUserLikedDenuncia(denunciaId) {
    const user = auth.currentUser;
    if (!user) return false;
    const docRef = doc(db, 'denuncias', denunciaId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;
    const data = docSnap.data();
    return Array.isArray(data.usuariosQueDieronLike) && data.usuariosQueDieronLike.includes(user.uid);
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