// js/auditoria.js
// Helper centralizado para guardar cambios en movimientos con auditoría completa.
// Reemplaza updateDoc(ref, payload) por guardarConAuditoria(ref, payload, nombre)
// para que cada edición quede registrada en auditoria.historial sin tocar cada módulo por separado.

import { updateDoc, arrayUnion, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Construye una entrada de historial. fecha usa Date() (no serverTimestamp)
// porque serverTimestamp() no puede ir dentro de arrayUnion en Firestore.
export function buildAuditEntry(nombre, extra = {}) {
  const rol = sessionStorage.getItem("icelion_rol") || "—";
  return { fecha: new Date(), usuario: nombre || "—", rol, ...extra };
}

// Guarda cualquier payload de updateDoc agregando automáticamente:
// - auditoria.modificado_por / auditoria.modificado_en
// - auditoria.historial (arrayUnion, no pisa lo anterior)
//
// ref:     referencia de Firestore (doc(db, COL, id))
// payload: objeto con los campos a actualizar (igual que siempre)
// nombre:  nombre del usuario actual
// detalle: (opcional) string corto describiendo el cambio, ej. "Editó datos generales"
export async function guardarConAuditoria(ref, payload, nombre, detalle = "") {
  const entry = buildAuditEntry(nombre, detalle ? { detalle } : {});
  return updateDoc(ref, {
    ...payload,
    "auditoria.modificado_por": nombre || "—",
    "auditoria.modificado_en": serverTimestamp(),
    "auditoria.historial": arrayUnion(entry)
  });
}
