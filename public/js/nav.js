const MODULOS = {
  admin: [
    { label:"Planificación",  href:"planificacion.html" },
    { label:"Guardia",        href:"guardia.html" },
    { label:"Calidad",        href:"calidad.html" },
    { label:"Desvíos",        href:"calidad_desvios.html" },
    { label:"NV Calidad",     href:"calidad_nv.html" },
    { label:"KPIs",           href:"kpis.html" },
    { label:"Supervisor",     href:"supervisor_web.html" },
    { label:"Consolidador",   href:"consolidador.html" },
    { label:"Data Entry",     href:"dataentry.html" },
    { label:"Visor Completo", href:"visor_completo.html" },
    { label:"Visor Supervisor",href:"visor_supervisor.html" },
    { label:"Visor Calidad",  href:"visor_calidad.html" },
    { label:"Mapa de Docks",  href:"mapa_docks.html" },
    { label:"Penalidades",    href:"penalidades.html" },
    { label:"Pen. Facturación",href:"penalidades_fact.html" },
    { label:"Servicios",       href:"servicios.html" },
    { label:"Listas",         href:"listas.html" },
    { label:"Admin Panel",    href:"admin.html" }
  ],
  planificacion: [
    { label:"Planificación",   href:"planificacion.html" },
    { label:"Visor Completo",  href:"visor_completo.html" },
    { label:"Visor Supervisor",href:"visor_supervisor.html" },
    { label:"Penalidades",     href:"penalidades.html" },
    { label:"Servicios",       href:"servicios.html" }
  ],
  guardia: [
    { label:"Guardia",         href:"guardia.html" },
    { label:"Visor Completo",  href:"visor_completo.html" }
  ],
  calidad: [
    { label:"Calidad",         href:"calidad.html" },
    { label:"Desvíos",         href:"calidad_desvios.html" },
    { label:"NV Calidad",      href:"calidad_nv.html" },
    { label:"Visor Calidad",   href:"visor_calidad.html" },
    { label:"Visor Completo",  href:"visor_completo.html" },
    { label:"Visor Supervisor",href:"visor_supervisor.html" },
    { label:"Penalidades",     href:"penalidades.html" }
  ],
  supervisor: [
    { label:"Supervisor",        href:"supervisor_web.html" },
    { label:"Visor Supervisor",  href:"visor_supervisor.html" },
    { label:"Visor Completo",    href:"visor_completo.html" },
    { label:"Penalidades",       href:"penalidades.html" }
  ],
  consolidador: [
    { label:"Consolidador",   href:"consolidador.html" },
    { label:"Planificación",  href:"planificacion.html" },
    { label:"Penalidades",    href:"penalidades.html" },
    { label:"Data Entry",     href:"dataentry.html" },
    { label:"Visor Supervisor",  href:"visor_supervisor.html" },
  ],
  dataentry:    [{ label:"Data Entry",     href:"dataentry.html" }],
  moderador:    [{ label:"Listas",         href:"listas.html" }],
  comercial:    [{ label:"Pen. Facturación",href:"penalidades_fact.html" },{ label:"Servicios",href:"servicios.html" }],
  facturacion:  [{ label:"Pen. Facturación",href:"penalidades_fact.html" },{ label:"Servicios",href:"servicios.html" }]
};

const MODULO_LISTAS = { label:"Listas", href:"listas.html" };

const style = document.createElement("style");
style.textContent = `
  .nav-menu-wrap { position:relative; }
  .nav-module-btn {
    font-size:11px; font-family:var(--mono); color:var(--muted);
    background:var(--panel2); border:1px solid var(--border);
    padding:3px 10px; border-radius:999px; cursor:pointer;
    transition:all .2s; display:flex; align-items:center; gap:5px;
  }
  .nav-module-btn:hover { border-color:var(--accent); color:var(--accent2); }
  .nav-module-btn .chevron { font-size:9px; transition:transform .2s; }
  .nav-module-btn.open .chevron { transform:rotate(180deg); }
  .nav-dropdown {
    position:absolute; top:calc(100% + 8px); left:0;
    background:var(--panel); border:1px solid var(--border);
    border-radius:12px; box-shadow:0 16px 40px rgba(0,0,0,.4);
    min-width:180px; overflow:hidden; z-index:200; display:none;
  }
  .nav-dropdown.show { display:block; }
  .nav-dropdown a {
    display:block; padding:10px 16px; font-size:13px; font-weight:600;
    color:var(--text); text-decoration:none; transition:background .15s;
    border-bottom:1px solid var(--border);
  }
  .nav-dropdown a:last-child { border-bottom:none; }
  .nav-dropdown a:hover { background:var(--panel2); color:var(--accent2); }
  .nav-dropdown a.activo { color:var(--accent2); background:rgba(59,130,246,.08); }
`;
document.head.appendChild(style);

(function() {
  // Soporte roles[] (nuevo) y rol string (legacy)
  let roles = [];
  try { roles = JSON.parse(sessionStorage.getItem("icelion_roles") || "[]"); } catch(e) {}
  if (!roles.length) {
    const rolLegacy = sessionStorage.getItem("icelion_rol");
    if (rolLegacy) roles = [rolLegacy];
  }

  const esMod     = sessionStorage.getItem("icelion_moderador") === "1";
  const paginaAct = window.location.pathname.split("/").pop() || "index.html";

  // Si es admin en cualquiera de los roles → menú admin completo
  if (roles.includes("admin")) roles = ["admin"];

  // Unir módulos de todos los roles sin duplicados
  const seen = new Set();
  let modulos = [];
  roles.forEach(function(rol) {
    (MODULOS[rol] || []).forEach(function(m) {
      if (!seen.has(m.href)) { seen.add(m.href); modulos.push(m); }
    });
  });

  // Agregar listas si es moderador
  if (esMod && !roles.includes("admin") && !roles.includes("moderador")) {
    if (!seen.has("listas.html")) modulos.push(MODULO_LISTAS);
  }

  if (modulos.length <= 1) return;

  const badge = document.querySelector(".nav-module");
  if (!badge) return;

  const labelActual  = badge.textContent.trim();
  const wrap         = document.createElement("div");
  wrap.className     = "nav-menu-wrap";
  const btn          = document.createElement("button");
  btn.className      = "nav-module-btn";
  btn.innerHTML      = labelActual + ' <span class="chevron">▼</span>';
  const dropdown     = document.createElement("div");
  dropdown.className = "nav-dropdown";
  dropdown.innerHTML = modulos.map(function(m) {
    return '<a href="' + m.href + '" class="' + (m.href === paginaAct ? "activo" : "") + '">'
      + (m.href === paginaAct ? "● " : "") + m.label + '</a>';
  }).join("");

  wrap.appendChild(btn);
  wrap.appendChild(dropdown);
  badge.replaceWith(wrap);

  btn.addEventListener("click", function(e) {
    e.stopPropagation();
    btn.classList.toggle("open");
    dropdown.classList.toggle("show");
  });
  document.addEventListener("click", function() {
    btn.classList.remove("open");
    dropdown.classList.remove("show");
  });
})();