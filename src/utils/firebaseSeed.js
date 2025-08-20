import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig.js';
import { denunciasDemo, comentariosDemo, usuariosDemo } from '../models/demoData.js';

export async function seedFirestoreDemoData() {
  // Seed users
  for (const u of usuariosDemo) {
    const userDoc = { email: u.email, username: u.username, createdAt: u.fechaRegistro };
    await setDoc(doc(db, 'users', u.id), userDoc).catch(() => {});
  }

  // Seed denuncias
  const denunciaIdMap = new Map();
  for (const d of denunciasDemo) {
    const docRef = await addDoc(collection(db, 'denuncias'), {
      titulo: d.titulo,
      descripcion: d.descripcion,
      categoria: d.categoria,
      fechaCreacion: d.fechaCreacion,
      usuarioId: d.usuarioId,
      likes: d.likes || 0,
      usuariosQueDieronLike: [],
      comentarios: []
    });
    denunciaIdMap.set(d.id, docRef.id);
  }

  // Seed comentarios
  for (const c of comentariosDemo) {
    const denunciaId = denunciaIdMap.get(c.denunciaId);
    if (!denunciaId) continue;
    const comentarioRef = await addDoc(collection(db, 'comentarios'), {
      denunciaId,
      usuarioId: c.usuarioId,
      contenido: c.contenido,
      fechaCreacion: c.fechaCreacion,
      likes: c.likes || 0
    });

    // Attach comment to denuncia
    // We keep it simple; UI reads comments via query by denunciaId
  }
}


