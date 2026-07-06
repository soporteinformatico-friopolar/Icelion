// --- LÓGICA DE PRODUCTOS (MOCK/SIMULADOR) ---

const modalProds = document.getElementById('modalProductos');
const contenedorGrupos = document.getElementById('contenedorGrupos');
let currentPlanId = "";

// 1. ABRIR MODAL Y CARGAR DATOS DE PRUEBA
window.abrirModalProductos = function(id, ref) {
    currentPlanId = id;
    document.getElementById('txtSubtituloProductos').textContent = `ID: ${id} | Ref: ${ref}`;
    modalProds.classList.remove('hidden');
    
    // Limpiamos y cargamos datos de ejemplo para probar la estética
    contenedorGrupos.innerHTML = "";
    
    // Simulamos que ya tiene un elaborador con un producto
    agregarGrupoElaborador({
        elaborador: "FRIOPOLAR TEST SA",
        lote: "L-2024-X",
        stock: "PV1"
    }, [{
        producto: "PAPA PREFRITA 10KG",
        cantidad: 50,
        unidad: "CAJA"
    }]);
}

window.cerrarModalProductos = function() {
    modalProds.classList.add('hidden');
}

// 2. FUNCIÓN PARA AÑADIR GRUPO (ELABORADOR)
window.agregarGrupoElaborador = function(comunes = {}, productos = []) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'elab-group';
    
    groupDiv.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; margin-bottom:15px;">
            <div><label class="form-label">Elaborador</label><input type="text" class="g-elab" value="${comunes.elaborador || ''}"></div>
            <div><label class="form-label">Lote Gral</label><input type="text" class="g-lote" value="${comunes.lote || ''}"></div>
            <div><label class="form-label">Stock de</label><input type="text" class="g-stock" value="${comunes.stock || ''}"></div>
            <div style="display:flex; align-items:flex-end;">
                <button onclick="agregarFilaProducto(this.closest('.elab-group').querySelector('.product-list'))" class="btn-mini btn-add" style="height:38px; width:100%">+ Producto</button>
            </div>
        </div>
        <div class="product-list"></div>
        <button onclick="this.closest('.elab-group').remove()" class="btn-mini btn-danger-mini" style="position:absolute; top:10px; right:10px;">Eliminar Grupo</button>
    `;
    
    contenedorGrupos.appendChild(groupDiv);
    const listCont = groupDiv.querySelector('.product-list');
    
    if (productos.length === 0) {
        agregarFilaProducto(listCont);
    } else {
        productos.forEach(p => agregarFilaProducto(listCont, p));
    }
}

// 3. FUNCIÓN PARA AÑADIR FILA DE PRODUCTO
window.agregarFilaProducto = function(cont, p = {}) {
    const row = document.createElement('div');
    row.className = 'product-row';
    
    row.innerHTML = `
        <div style="flex:2"><label class="form-label">Producto</label><input type="text" class="p-prod" value="${p.producto || ''}"></div>
        <div style="flex:1"><label class="form-label">Cantidad</label><input type="number" class="p-cant" value="${p.cantidad || ''}"></div>
        <div style="flex:1"><label class="form-label">Unidad</label><input type="text" list="unidadList" class="p-uni" value="${p.unidad || ''}"></div>
        <div style="display:flex; gap:8px;">
            <button onclick="duplicarFila(this)" class="btn-mini btn-warn-mini">Duplicar</button>
            <button onclick="this.closest('.product-row').remove()" class="btn-mini btn-danger-mini">Borrar</button>
        </div>
    `;
    cont.appendChild(row);
}

// 4. DUPLICAR FILA (Lógica idéntica a tu AppScript)
window.duplicarFila = function(btn) {
    const row = btn.closest('.product-row');
    const data = {
        producto: row.querySelector('.p-prod').value,
        cantidad: row.querySelector('.p-cant').value,
        unidad: row.querySelector('.p-uni').value
    };
    agregarFilaProducto(row.parentElement, data);
}

// 5. GUARDAR SIMULADO (Para no gastar cuota)
window.guardarProductosSimulado = function() {
    const grupos = document.querySelectorAll('.elab-group');
    const resultado = [];

    grupos.forEach(g => {
        const elab = g.querySelector('.g-elab').value;
        const filas = g.querySelectorAll('.product-row');
        
        filas.forEach(f => {
            resultado.push({
                elaborador: elab,
                producto: f.querySelector('.p-prod').value,
                cantidad: f.querySelector('.p-cant').value
            });
        });
    });

    console.log("SIMULACIÓN DE GUARDADO:", resultado);
    alert(`Se guardaron ${resultado.length} productos (Ver consola F12)`);
    cerrarModalProductos();
}