import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// ── TEMA ──────────────────────────────────────────────────────
export function initTema() {
  const btn = document.getElementById("btnTema");
  function aplicar(t) {
    document.body.classList.toggle("light", t === "light");
    if (btn) btn.textContent = t === "light" ? "☀️" : "🌙";
  }
  aplicar(localStorage.getItem("icelion_tema") || "dark");
  if (btn) btn.addEventListener("click", () => {
    const nuevo = document.body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem("icelion_tema", nuevo);
    aplicar(nuevo);
  });
}

// ── SESIÓN ────────────────────────────────────────────────────
export function initSesion(onUser) {
  onAuthStateChanged(auth, u => {
    if (!u) { window.location.href = "index.html"; return; }
    const navUser = document.getElementById("navUser");
    if (navUser) navUser.textContent = sessionStorage.getItem("icelion_nombre") || u.email;
    if (onUser) onUser(u);
  });
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) btnLogout.addEventListener("click", async () => {
    await signOut(auth); sessionStorage.clear(); window.location.href = "index.html";
  });
}

// ── TOAST ─────────────────────────────────────────────────────
export function toast(type, title, msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.className = `toast ${type}`;
  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastMsg").textContent = msg || "";
  t.style.display = "block";
  setTimeout(() => { t.style.display = "none"; }, 3800);
}

// ── FECHA ─────────────────────────────────────────────────────
export function hoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
export function sumarDias(fecha, n) {
  const d = new Date(fecha+"T00:00:00"); d.setDate(d.getDate()+n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
export function fmtLabel(f) {
  const h = hoy(), dd = f.split("-").reverse().join("/");
  if (f === h)              return `Hoy · ${dd}`;
  if (f === sumarDias(h,-1))return `Ayer · ${dd}`;
  if (f === sumarDias(h, 1))return `Mañana · ${dd}`;
  return dd;
}
export function fmtFecha(s) {
  if (!s) return "—";
  if (typeof s === "string" && s.includes("-")) return s.split("-").reverse().join("/");
  return s;
}
export function fmtTimestamp(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
}

// ── BADGES ────────────────────────────────────────────────────
export function badgeEstado(e) {
  const map = {
    "PLANIFICADO":       "badge-planificado",
    "AGREGADO":          "badge-agregado",
    "SIN IDENTIFICAR":   "badge-sinidentif",
    "ARRIBADO":          "badge-arribado",
    "EN ESPERA":         "badge-dock",
    "DOCK ASIGNADO":     "badge-dock",
    "ATRACADO":          "badge-atracado",
    "INICIO MOVIMIENTO": "badge-iniciomov",
    "PAUSADO":           "badge-pausado",
    "FIN MOVIMIENTO":    "badge-finmov",
    "CANCELA MOVIMIENTO":"badge-cancelado",
    "CANCELADO":         "badge-cancelado",
    "LIBERADO":          "badge-liberado",
    "VINCULADO":         "badge-cancelado",
  };
  return `<span class="badge ${map[e]||"badge-planificado"}">${e||"—"}</span>`;
}
export function badgeMov(m) {
  const t = (m||"").toUpperCase();
  let cls = "badge-planificado";
  if (t.includes("EXPO"))    cls = "badge-dock";
  else if (t.includes("CARGA"))  cls = "badge-agregado";
  else if (t.includes("DESC"))   cls = "badge-arribado";
  return `<span class="badge ${cls}" style="font-size:10px;">${m||"—"}</span>`;
}

// ── CAPS (mayúsculas automáticas) ─────────────────────────────
export function caps(el) {
  el.addEventListener("input", () => {
    el.value = el.value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  });
}

// ── UUID ──────────────────────────────────────────────────────
export function uuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : "id-"+Date.now()+"-"+Math.random().toString(36).slice(2);
}