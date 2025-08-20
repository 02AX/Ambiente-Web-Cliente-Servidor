import { collection, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig.js';

function isValidDate(value) {
  if (!value) return false;
  if (typeof value?.toDate === 'function') return true; // Firestore Timestamp
  const d = value instanceof Date ? value : new Date(value);
  return d instanceof Date && !isNaN(d.getTime());
}

export async function auditDenunciasDates() {
  const denunciasCol = collection(db, 'denuncias');
  const snap = await getDocs(denunciasCol);
  let total = 0;
  let ok = 0;
  let missing = 0;
  let invalid = 0;
  const problematic = [];
  snap.forEach((d) => {
    total += 1;
    const data = d.data();
    if (data.fechaCreacion == null) {
      missing += 1;
      problematic.push({ id: d.id, reason: 'missing' });
    } else if (!isValidDate(data.fechaCreacion)) {
      invalid += 1;
      problematic.push({ id: d.id, reason: 'invalid', value: data.fechaCreacion });
    } else {
      ok += 1;
    }
  });
  return { total, ok, missing, invalid, problematic };
}

export async function backfillDenunciasDates({ strategy = 'server', fallbackNow = true } = {}) {
  const denunciasCol = collection(db, 'denuncias');
  const snap = await getDocs(denunciasCol);
  let updated = 0;
  for (const d of snap.docs) {
    const data = d.data();
    if (data.fechaCreacion == null || !isValidDate(data.fechaCreacion)) {
      let value;
      if (strategy === 'server') {
        value = serverTimestamp();
      } else {
        // Try to coerce existing value into a Date, otherwise now
        const coerced = new Date(data.fechaCreacion);
        value = fallbackNow && (coerced instanceof Date && !isNaN(coerced.getTime()))
          ? coerced
          : new Date();
      }
      await updateDoc(doc(db, 'denuncias', d.id), { fechaCreacion: value });
      updated += 1;
    }
  }
  return { updated };
}


