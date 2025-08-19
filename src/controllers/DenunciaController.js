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
  getDoc,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig.js';
import { Denuncia, CATEGORIAS } from '../models/Denuncia.js';
import { Comentario } from '../models/Comentario.js';

class DenunciaController {
  constructor() {
    this.listeners = [];
  }

  async getAllDenuncias() {
    const denunciasCol = collection(db, 'denuncias');
    const snapshot = await getDocs(denunciasCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...this._convertTimestamps(doc.data()) }));
  }

  async getDenunciasByCategoria(categoria) {
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, where('categoria', '==', categoria));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...this._convertTimestamps(doc.data()) }));
  }

  async getDenunciasOrdenadas(criterio = 'likes') {
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, orderBy(criterio, 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...this._convertTimestamps(doc.data()) }));
  }

  async getDenunciaById(id) {
    const docRef = doc(db, 'denuncias', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...this._convertTimestamps(docSnap.data()) };
  }

  async crearDenuncia(datosForm) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'Se debe de estar autenticado para crear una denuncia'};
      }

      const nuevaDenuncia = new Denuncia({
        titulo: datosForm.titulo,
        descripcion: datosForm.descripcion,
        categoria: datosForm.categoria,
        fechaCreacion: new Date(),
        usuarioId: user.uid,
        likes: 0,
        comentarios: []
      });

      const errores = nuevaDenuncia.validar();
      if (errores.length > 0) {
        return { success: false, message: 'Errores de validación', errores };
      }

      const denunciasCol = collection(db, 'denuncias');
      const docRef = await addDoc(denunciasCol, {
        titulo: nuevaDenuncia.titulo,
        descripcion: nuevaDenuncia.descripcion,
        categoria: nuevaDenuncia.categoria,
        fechaCreacion: nuevaDenuncia.fechaCreacion,
        usuarioId: nuevaDenuncia.usuarioId,
        likes: 0,
        usuariosQueDieronLike: [],
        comentarios: []
      });

      this.notifyListeners();
      return { success: true, message: 'Denuncia creada exitosamente', denuncia: { ...nuevaDenuncia, id: docRef.id } };
    } catch (error) {
      return { success: false, message: 'Error al crear la denuncia' };
    }
  }

  async toggleLikeDenuncia(denunciaId) {
    try {
      const user = auth.currentUser;
      if (!user) {
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
        usuariosQueDieronLike = usuariosQueDieronLike.filter(uid => uid !== user.uid);
        likes = Math.max(0, likes - 1);
      } else {
        usuariosQueDieronLike.push(user.uid);
        likes += 1;
      }

      await updateDoc(docRef, { usuariosQueDieronLike, likes });
      this.notifyListeners();
      return { success: true, message: hasLiked ? 'Like eliminado: ' : 'Like agregado correctamente', liked: !hasLiked, likes };
    } catch (error) {
      return { success: false, message: 'Error al procesar el like' };
    }
  }

  async agregarComentario(denunciaId, contenido) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'Debe estar autenticado para comentar' };
      }

      const docRef = doc(db, 'denuncias', denunciaId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return { success: false, message: 'La denuncia no fue encontrada'};

      const nuevaFecha = new Date();
      const nuevoComentario = new Comentario({
        contenido,
        fechaCreacion: nuevaFecha,
        usuarioId: user.uid,
        denunciaId
      });

      const errores = nuevoComentario.validar();
      if (errores.length > 0) {
        return { success: false, message: 'Error de validación', errores };
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

      this.notifyListeners();
      return { success: true, message: 'Comentario agregado exitosamente', comentario: { ...nuevoComentario, id: comentarioDocRef.id } };
    } catch (error) {
      return { success: false, message: 'Error al agregar comentario' };
    }
  }

  async getComentariosByDenuncia(denunciaId) {
    const comentariosCol = collection(db, 'comentarios');
    const q = query(comentariosCol, where('denunciaId', '==', denunciaId), orderBy('fechaCreacion', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...this._convertTimestamps(doc.data()) }));
  }

  getCategorias() { return CATEGORIAS; }

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

  async buscarDenuncias(termino) {
    const denuncias = await this.getAllDenuncias();
    const terminoLower = termino.toLowerCase();
    return denuncias.filter(d => d.titulo.toLowerCase().includes(terminoLower) || d.descripcion.toLowerCase().includes(terminoLower));
  }

  async getDenunciasRecientes(limiteN = 5) {
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, orderBy('fechaCreacion', 'desc'), limit(limiteN));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...this._convertTimestamps(doc.data()) }));
  }

  async getDenunciasPopulares(limiteN = 5) {
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, orderBy('likes', 'desc'), limit(limiteN));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getMisDenuncias() {
    const user = auth.currentUser;
    if (!user) return [];
    const denunciasCol = collection(db, 'denuncias');
    const q = query(denunciasCol, where('usuarioId', '==', user.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getDenunciasConMisLikes() {
    const user = auth.currentUser;
    if (!user) return [];
    const denunciasCol = collection(db, 'denuncias');
    const snapshot = await getDocs(denunciasCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...this._convertTimestamps(doc.data()) })).filter(d => Array.isArray(d.usuariosQueDieronLike) && d.usuariosQueDieronLike.includes(user.uid));
  }

  async hasUserLikedDenuncia(denunciaId) {
    const user = auth.currentUser;
    if (!user) return false;
    const docRef = doc(db, 'denuncias', denunciaId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;
    const data = docSnap.data();
    return Array.isArray(data.usuariosQueDieronLike) && data.usuariosQueDieronLike.includes(user.uid);
  }

  addListener(listener) { this.listeners.push(listener); }
  removeListener(listener) { this.listeners = this.listeners.filter(l => l !== listener); }
  notifyListeners() { this.listeners.forEach(l => l({})); }

  _convertTimestamps(data) {
    const out = { ...data };
    if (out.fechaCreacion && typeof out.fechaCreacion.toDate === 'function') {
      out.fechaCreacion = out.fechaCreacion.toDate();
    }
    return out;
  }
}

const denunciaController = new DenunciaController();
export default denunciaController;