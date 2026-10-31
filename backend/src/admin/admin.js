/**
 * ============================================================================
 * CONSOLA ADMINISTRATIVA JECTECH SOLUCIONES - CONTROLADOR FRONTEND
 * Gestión de autenticación, SPA enrutada y llamadas REST a la API de Node.js
 * ============================================================================
 */

// Estado global de la aplicación
const state = {
  usuario: null,
  token: localStorage.getItem('tecnofix_admin_token') || null,
  seccionActiva: 'dashboard',
  productos: [],
  servicios: [],
  mensajes: [],
  faqs: [],
  seccionesHome: [],
  config: {},
};

// ============================================================================
// 1. UTILIDADES Y CLIENTE HTTP PARA LA API
// ============================================================================

/**
 * Muestra notificación flotante (Toast)
 */
function showToast(mensaje, tipo = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${tipo === 'success'
      ? '<polyline points="20 6 9 17 4 12"></polyline>'
      : (tipo === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>')}
    </svg>
    <span>${mensaje}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Petición centralizada a la API con token JWT
 */
async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }

  try {
    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      // Sesión expirada o token no válido
      cerrarSesionLocal();
      throw new Error(data.mensaje || 'Sesión no autorizada');
    }

    if (!res.ok) {
      throw new Error(data.mensaje || `Error HTTP ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`[API Error: ${endpoint}]:`, err);
    throw err;
  }
}

/**
 * Formatea valores numéricos a Pesos Colombianos (COP)
 */
function formatearCOP(valor) {
  const num = parseInt(valor, 10);
  if (isNaN(num)) return '$ 0 COP';
  return `$ ${num.toLocaleString('es-CO')} COP`;
}

/**
 * Escapa caracteres HTML especiales para prevenir XSS al renderizar tablas
 */
function escapeHtml(texto) {
  if (texto === null || texto === undefined) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Notifica a las pestañas activas del frontend que hubo cambios en el catálogo
 * para que refresquen automáticamente sus grillas sin recargar la página
 * @param {'productos'|'servicios'|'todos'} tipo
 */
function notificarCambioCatalogo(tipo = 'todos') {
  try {
    localStorage.setItem('tecnofix_catalog_updated', Date.now().toString());
    if (typeof window.BroadcastChannel === 'function') {
      const canal = new BroadcastChannel('tecnofix_catalog_channel');
      canal.postMessage({ type: tipo, timestamp: Date.now() });
      canal.close();
    }
  } catch (e) {
    console.warn('[Admin] No se pudo emitir evento entre pestañas:', e);
  }
}

// ============================================================================
// 2. CONTROL DE AUTENTICACIÓN Y SESIÓN
// ============================================================================

async function verificarSesionInicial() {
  if (!state.token) {
    mostrarVistaLogin();
    return;
  }

  try {
    const data = await apiFetch('/auth/me');
    if (data.ok && data.usuario) {
      state.usuario = data.usuario;
      mostrarVistaConsola();
      cargarDashboard();
    } else {
      mostrarVistaLogin();
    }
  } catch (err) {
    mostrarVistaLogin();
  }
}

function mostrarVistaLogin() {
  document.getElementById('login-view').style.display = 'flex';
  document.getElementById('admin-app').style.display = 'none';
}

function mostrarVistaConsola() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('admin-app').style.display = 'flex';

  if (state.usuario) {
    document.getElementById('sidebar-user-name').textContent = state.usuario.nombre;
    document.getElementById('sidebar-user-email').textContent = state.usuario.email;
    document.getElementById('sidebar-user-avatar').textContent = (state.usuario.nombre || 'A').charAt(0).toUpperCase();
  }
}

function cerrarSesionLocal() {
  state.token = null;
  state.usuario = null;
  localStorage.removeItem('tecnofix_admin_token');
  mostrarVistaLogin();
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-login-submit');
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  btn.disabled = true;
  btn.innerHTML = 'Verificando...';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.mensaje || 'Credenciales inválidas');
    }

    state.token = data.token;
    state.usuario = data.usuario;
    localStorage.setItem('tecnofix_admin_token', data.token);

    showToast(data.mensaje || '¡Acceso concedido!', 'success');
    mostrarVistaConsola();
    navegarA('dashboard');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
      </svg>
      Acceder a la Consola
    `;
  }
}

async function handleLogout() {
  if (!confirm('¿Deseas cerrar tu sesión administrativa?')) return;
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch (e) {
    // Continuar con limpieza local
  }
  cerrarSesionLocal();
  showToast('Has cerrado sesión correctamente.', 'info');
}

// ============================================================================
// 3. ENRUTAMIENTO Y NAVEGACIÓN EN LA BARRA LATERAL IZQUIERDA
// ============================================================================

function navegarA(seccionId) {
  state.seccionActiva = seccionId;

  // Actualizar enlaces en el sidebar
  document.querySelectorAll('.sidebar-menu .nav-link').forEach(link => {
    if (link.dataset.section === seccionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Actualizar títulos del header
  const titulos = {
    dashboard: 'Dashboard & Estadísticas',
    'secciones-home': 'Página Principal (Secciones e Imágenes)',
    'secciones-nosotros': 'Nosotros (Secciones e Imágenes)',
    'secciones-contacto': 'Contacto (Secciones e Imágenes)',
    productos: 'Inventario de Productos',
    servicios: 'Servicios Técnicos Especializados',
    contacto: 'Bandeja de Cotizaciones y Contacto',
    faqs: 'Preguntas Frecuentes (FAQ / AEO)',
    config: 'Configuración General del Negocio',
  };
  document.getElementById('page-title').textContent = titulos[seccionId] || 'Consola';

  // Ocultar todas las secciones y activar la seleccionada
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.classList.remove('active');
  });
  const targetDomId = ['secciones-home', 'secciones-nosotros', 'secciones-contacto'].includes(seccionId)
    ? 'section-secciones-home'
    : `section-${seccionId}`;
  const activaEl = document.getElementById(targetDomId);
  if (activaEl) activaEl.classList.add('active');

  // Cerrar sidebar en móviles tras navegar
  document.getElementById('sidebar').classList.remove('is-open');

  // Cargar datos correspondientes
  switch (seccionId) {
    case 'dashboard':
      cargarDashboard();
      break;
    case 'secciones-home':
      cargarSeccionesHome('inicio');
      break;
    case 'secciones-nosotros':
      cargarSeccionesHome('nosotros');
      break;
    case 'secciones-contacto':
      cargarSeccionesHome('contacto');
      break;
    case 'productos':
      cargarProductos();
      break;
    case 'servicios':
      cargarServicios();
      break;
    case 'contacto':
      cargarContacto();
      break;
    case 'faqs':
      cargarFaqs();
      break;
    case 'config':
      cargarConfiguracion();
      break;
  }
}

// ============================================================================
// 4. MÓDULO: DASHBOARD
// ============================================================================

async function cargarDashboard() {
  try {
    const data = await apiFetch('/stats/dashboard');
    if (!data.ok) return;

    const { stats, ultimosMensajes, productosCriticos } = data;

    // Métricas en tarjetas
    document.getElementById('stat-total-productos').textContent = stats.totalProductos;
    document.getElementById('stat-total-servicios').textContent = stats.totalServicios;
    document.getElementById('stat-mensajes-nuevos').textContent = stats.mensajesNuevos;
    document.getElementById('stat-stock-bajo').textContent = stats.productosStockBajo;

    // Badges en el menú izquierdo
    document.getElementById('badge-total-productos').textContent = stats.totalProductos;
    const badgeNuevos = document.getElementById('badge-mensajes-nuevos');
    badgeNuevos.textContent = stats.mensajesNuevos;
    badgeNuevos.style.display = stats.mensajesNuevos > 0 ? 'inline-block' : 'none';

    // Tabla de últimas solicitudes
    const tbodyMensajes = document.getElementById('tbody-dashboard-mensajes');
    if (ultimosMensajes.length === 0) {
      tbodyMensajes.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay solicitudes registradas aún.</td></tr>';
    } else {
      tbodyMensajes.innerHTML = ultimosMensajes.map(m => `
        <tr>
          <td>
            <strong>${m.nombre}</strong><br>
            <small style="color: var(--text-dim);">${m.telefono}</small>
          </td>
          <td>${m.tipo_solicitud}</td>
          <td><span class="badge ${m.estado === 'nuevo' ? 'badge-warning' : (m.estado === 'atendido' ? 'badge-success' : 'badge-info')}">${m.estado}</span></td>
        </tr>
      `).join('');
    }

    // Tabla de stock crítico
    const tbodyStock = document.getElementById('tbody-dashboard-stock');
    if (productosCriticos.length === 0) {
      tbodyStock.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay productos con stock bajo.</td></tr>';
    } else {
      tbodyStock.innerHTML = productosCriticos.map(p => `
        <tr>
          <td>
            <strong>${p.nombre}</strong><br>
            <small style="color: var(--text-dim);">${p.categoria}</small>
          </td>
          <td>${formatearCOP(p.precio)}</td>
          <td><span class="badge ${p.stock <= 5 ? 'badge-danger' : 'badge-warning'}">${p.stock} un.</span></td>
        </tr>
      `).join('');
    }
  } catch (err) {
    showToast('Error al actualizar dashboard: ' + err.message, 'error');
  }
}

// ============================================================================
// 5. MÓDULO: PRODUCTOS (CRUD)
// ============================================================================

async function cargarProductos() {
  const tbody = document.getElementById('tbody-productos');
  tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Cargando inventario...</td></tr>';

  try {
    const busqueda = document.getElementById('filtro-busqueda-producto').value.trim();
    const categoria = document.getElementById('filtro-categoria-producto').value;

    let url = '/productos?';
    if (busqueda) url += `busqueda=${encodeURIComponent(busqueda)}&`;
    if (categoria && categoria !== 'todos') url += `categoria=${encodeURIComponent(categoria)}&`;

    const data = await apiFetch(url);
    state.productos = data.productos || [];

    // Cargar categorías en el select si está vacío
    cargarCategoriasSelect();

    if (state.productos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No se encontraron productos coincidentes.</td></tr>';
      return;
    }

    tbody.innerHTML = state.productos.map(p => `
      <tr>
        <td><small style="color: var(--text-dim); font-weight: 700;">#${p.id}</small></td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="/${p.imagen}" alt="${p.nombre}" style="width: 36px; height: 36px; object-fit: contain; border-radius: var(--radius-sm); background: var(--bg-input); padding: 2px;" onerror="this.onerror=null; this.src='/assets/images/productos/placeholder-tech.svg';">
            <div>
              <strong style="color: var(--text-main); display: block;">${p.nombre}</strong>
              <small style="color: var(--text-muted);">${p.marca || 'Genérica'}</small>
            </div>
          </div>
        </td>
        <td><span class="badge badge-info">${p.categoria}</span></td>
        <td><strong style="color: var(--accent);">${formatearCOP(p.precio)}</strong></td>
        <td>
          <span class="badge ${p.stock <= 3 ? 'badge-danger' : (p.stock <= 10 ? 'badge-warning' : 'badge-success')}">
            ${p.stock} un.
          </span>
        </td>
        <td>
          <span class="badge ${p.disponible === 'disponible' ? 'badge-success' : (p.disponible === 'agotado' ? 'badge-danger' : 'badge-warning')}">
            ${p.disponible}
          </span>
        </td>
        <td>${p.destacado ? '⭐ Sí' : 'No'}</td>
        <td style="text-align: right;">
          <button type="button" class="btn-icon" onclick="editarProducto(${p.id})" title="Editar producto">✏️</button>
          <button type="button" class="btn-icon delete" onclick="eliminarProducto(${p.id})" title="Eliminar producto">🗑️</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--danger); padding: 1.5rem;">${err.message}</td></tr>`;
  }
}

async function cargarCategoriasSelect() {
  const select = document.getElementById('filtro-categoria-producto');
  if (select.children.length > 1) return; // Ya poblado

  try {
    const data = await apiFetch('/productos/categorias');
    if (data.ok && Array.isArray(data.categorias)) {
      data.categorias.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.categoria;
        opt.textContent = `${c.categoria} (${c.cantidad})`;
        select.appendChild(opt);
      });
    }
  } catch (e) { }
}

// ============================================================================
// GESTIÓN DINÁMICA DE ESPECIFICACIONES TÉCNICAS (FICHA TÉCNICA)
// ============================================================================

function crearFilaEspecificacion(clave = '', valor = '') {
  const container = document.getElementById('specs-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'spec-row';

  const inputKey = document.createElement('input');
  inputKey.type = 'text';
  inputKey.className = 'form-control spec-key-input';
  inputKey.placeholder = 'Parámetro (ej. Capacidad, Interfaz)';
  inputKey.value = clave || '';

  const inputVal = document.createElement('input');
  inputVal.type = 'text';
  inputVal.className = 'form-control spec-val-input';
  inputVal.placeholder = 'Valor (ej. 480 GB, SATA III)';
  inputVal.value = valor || '';

  const btnRemove = document.createElement('button');
  btnRemove.type = 'button';
  btnRemove.className = 'btn-remove-spec';
  btnRemove.title = 'Eliminar especificación';
  btnRemove.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  `;

  btnRemove.addEventListener('click', () => row.remove());

  row.appendChild(inputKey);
  row.appendChild(inputVal);
  row.appendChild(btnRemove);

  container.appendChild(row);
}

function obtenerEspecificacionesDesdeFormulario() {
  const specs = {};
  const rows = document.querySelectorAll('#specs-container .spec-row');
  rows.forEach(row => {
    const key = (row.querySelector('.spec-key-input')?.value || '').trim();
    const val = (row.querySelector('.spec-val-input')?.value || '').trim();
    if (key) {
      specs[key] = val;
    }
  });
  return specs;
}

function cargarEspecificacionesEnFormulario(specsObj) {
  const container = document.getElementById('specs-container');
  if (!container) return;
  container.innerHTML = '';

  if (specsObj && typeof specsObj === 'object') {
    const entries = Object.entries(specsObj);
    if (entries.length > 0) {
      entries.forEach(([k, v]) => crearFilaEspecificacion(k, v));
      return;
    }
  }

  // Sugerir fila inicial por defecto
  crearFilaEspecificacion('Garantía', '12 meses');
}

function abrirModalProductoNuevo() {
  document.getElementById('modal-producto-title').textContent = 'Crear Nuevo Producto';
  document.getElementById('form-producto').reset();
  document.getElementById('prod-id').value = '';
  document.getElementById('prod-stock').value = 10;
  document.getElementById('prod-imagen').value = 'assets/images/productos/placeholder-tech.svg';

  // Restablecer selector de imágenes del dispositivo
  const fileInput = document.getElementById('prod-file-input');
  if (fileInput) fileInput.value = '';
  const previewBox = document.getElementById('prod-preview-box');
  const dropzone = document.getElementById('prod-dropzone');
  if (previewBox) previewBox.style.display = 'none';
  if (dropzone) dropzone.style.display = 'flex';

  // Inicializar ficha técnica con plantilla inicial
  cargarEspecificacionesEnFormulario({
    'Garantía': '12 meses'
  });

  abrirModal('modal-producto');
}

function editarProducto(id) {
  const p = state.productos.find(item => item.id === id);
  if (!p) return;

  document.getElementById('modal-producto-title').textContent = `Editar: ${p.nombre}`;
  document.getElementById('prod-id').value = p.id;
  document.getElementById('prod-nombre').value = p.nombre;
  document.getElementById('prod-categoria').value = p.categoria;
  document.getElementById('prod-marca').value = p.marca || '';
  document.getElementById('prod-precio').value = p.precio;
  document.getElementById('prod-stock').value = p.stock || 10;
  document.getElementById('prod-disponible').value = p.disponible || 'disponible';
  document.getElementById('prod-imagen').value = p.imagen || 'assets/images/productos/placeholder-tech.svg';
  document.getElementById('prod-descripcion').value = p.descripcion || '';
  document.getElementById('prod-destacado').checked = !!p.destacado;

  // Cargar ficha técnica y especificaciones del producto
  cargarEspecificacionesEnFormulario(p.especificaciones);

  // Cargar vista previa de la imagen actual
  const fileInput = document.getElementById('prod-file-input');
  if (fileInput) fileInput.value = '';
  const previewBox = document.getElementById('prod-preview-box');
  const dropzone = document.getElementById('prod-dropzone');
  const previewImg = document.getElementById('prod-preview-img');
  const previewName = document.getElementById('prod-preview-name');
  const previewStatus = document.getElementById('prod-preview-status-text');

  if (p.imagen) {
    if (previewImg) previewImg.src = p.imagen;
    if (previewName) previewName.textContent = p.imagen.split('/').pop() || 'imagen';
    if (previewStatus) {
      previewStatus.textContent = 'Imagen asignada';
      previewStatus.style.color = 'var(--success)';
    }
    if (previewBox) previewBox.style.display = 'flex';
    if (dropzone) dropzone.style.display = 'none';
  } else {
    if (previewBox) previewBox.style.display = 'none';
    if (dropzone) dropzone.style.display = 'flex';
  }

  abrirModal('modal-producto');
}

async function guardarProducto(e) {
  e.preventDefault();
  const id = document.getElementById('prod-id').value;

  const payload = {
    nombre: document.getElementById('prod-nombre').value.trim(),
    categoria: document.getElementById('prod-categoria').value.trim(),
    marca: document.getElementById('prod-marca').value.trim(),
    precio: document.getElementById('prod-precio').value,
    stock: document.getElementById('prod-stock').value,
    disponible: document.getElementById('prod-disponible').value,
    imagen: document.getElementById('prod-imagen').value.trim(),
    descripcion: document.getElementById('prod-descripcion').value.trim(),
    especificaciones: obtenerEspecificacionesDesdeFormulario(),
    destacado: document.getElementById('prod-destacado').checked,
  };

  try {
    if (id) {
      await apiFetch(`/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      showToast('Producto actualizado correctamente.', 'success');
    } else {
      await apiFetch('/productos', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      showToast('Producto agregado al inventario.', 'success');
    }

    cerrarModal('modal-producto');
    cargarProductos();
    cargarDashboard();
    notificarCambioCatalogo('productos');
  } catch (err) {
    showToast('Error al guardar producto: ' + err.message, 'error');
  }
}

async function eliminarProducto(id) {
  const p = state.productos.find(item => item.id === id);
  if (!confirm(`¿Estás seguro de eliminar el producto "${p ? p.nombre : id}"?`)) return;

  try {
    await apiFetch(`/productos/${id}`, { method: 'DELETE' });
    showToast('Producto eliminado.', 'info');
    cargarProductos();
    cargarDashboard();
    notificarCambioCatalogo('productos');
  } catch (err) {
    showToast('Error al eliminar: ' + err.message, 'error');
  }
}

// ============================================================================
// 6. MÓDULO: SERVICIOS TÉCNICOS (CRUD)
// ============================================================================

async function cargarServicios() {
  const tbody = document.getElementById('tbody-servicios');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Cargando servicios técnicos...</td></tr>';

  try {
    const data = await apiFetch('/servicios');
    state.servicios = data.servicios || [];

    if (state.servicios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay servicios técnicos registrados.</td></tr>';
      return;
    }

    tbody.innerHTML = state.servicios.map(s => `
      <tr>
        <td><small style="color: var(--text-dim); font-weight: 700;">#${s.id}</small></td>
        <td>
          <strong style="color: var(--text-main); display: block;">${s.nombre}</strong>
          <small style="color: var(--text-muted);">${(s.descripcion || '').slice(0, 70)}...</small>
        </td>
        <td><span class="badge badge-info">${s.categoria}</span></td>
        <td>${s.tiempo_estimado || 'A convenir'}</td>
        <td><strong style="color: var(--accent);">${s.precio_referencia || 'Cotizar'}</strong></td>
        <td>${s.destacado ? '⭐ Sí' : 'No'}</td>
        <td style="text-align: right;">
          <button type="button" class="btn-icon" onclick="editarServicio(${s.id})" title="Editar servicio">✏️</button>
          <button type="button" class="btn-icon delete" onclick="eliminarServicio(${s.id})" title="Eliminar servicio">🗑️</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger); padding: 1.5rem;">${err.message}</td></tr>`;
  }
}

function crearFilaTareaServicio(texto = '') {
  const container = document.getElementById('serv-tareas-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'spec-row';

  const checkIcon = document.createElement('span');
  checkIcon.style.cssText = 'display: inline-flex; align-items: center; justify-content: center; color: var(--success); flex-shrink: 0; padding: 0 0.25rem;';
  checkIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  const inputTarea = document.createElement('input');
  inputTarea.type = 'text';
  inputTarea.className = 'form-control serv-tarea-input';
  inputTarea.style.cssText = 'flex: 1; background-color: rgba(15, 23, 42, 0.6);';
  inputTarea.placeholder = 'Ej. Inspección visual de placa madre bajo microscopio';
  inputTarea.value = texto;

  const btnRemove = document.createElement('button');
  btnRemove.type = 'button';
  btnRemove.className = 'btn-remove-spec';
  btnRemove.title = 'Eliminar ítem';
  btnRemove.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  `;

  btnRemove.addEventListener('click', () => row.remove());

  row.appendChild(checkIcon);
  row.appendChild(inputTarea);
  row.appendChild(btnRemove);

  container.appendChild(row);
}

function obtenerTareasServicioDesdeFormulario() {
  const tareas = [];
  const inputs = document.querySelectorAll('#serv-tareas-container .serv-tarea-input');
  inputs.forEach(input => {
    const val = (input.value || '').trim();
    if (val) {
      tareas.push(val);
    }
  });
  return tareas;
}

function cargarTareasServicioEnFormulario(tareasArr, beneficiosFallback) {
  const container = document.getElementById('serv-tareas-container');
  if (!container) return;
  container.innerHTML = '';

  let lista = [];
  if (Array.isArray(tareasArr)) {
    lista = tareasArr;
  } else if (typeof tareasArr === 'string' && tareasArr.trim()) {
    try { lista = JSON.parse(tareasArr); } catch (e) { lista = []; }
  }

  if ((!Array.isArray(lista) || lista.length === 0) && Array.isArray(beneficiosFallback) && beneficiosFallback.length > 0) {
    lista = beneficiosFallback;
  }

  if (Array.isArray(lista) && lista.length > 0) {
    lista.forEach(item => crearFilaTareaServicio(item));
    return;
  }

  // Sugerir filas iniciales por defecto para nuevo servicio
  crearFilaTareaServicio('Diagnóstico técnico especializado en banco de pruebas');
  crearFilaTareaServicio('Informe técnico detallado y garantía por escrito');
}

function abrirModalServicioNuevo() {
  document.getElementById('modal-servicio-title').textContent = 'Crear Nuevo Servicio Técnico';
  document.getElementById('form-servicio').reset();
  document.getElementById('serv-id').value = '';
  document.getElementById('serv-icono').value = '';

  const fileInput = document.getElementById('serv-file-input');
  if (fileInput) fileInput.value = '';
  const previewBox = document.getElementById('serv-preview-box');
  const dropzone = document.getElementById('serv-dropzone');
  if (previewBox) previewBox.style.display = 'none';
  if (dropzone) dropzone.style.display = 'flex';

  cargarTareasServicioEnFormulario([]);

  abrirModal('modal-servicio');
}

function editarServicio(id) {
  const s = state.servicios.find(item => item.id === id);
  if (!s) return;

  document.getElementById('modal-servicio-title').textContent = `Editar: ${s.nombre}`;
  document.getElementById('serv-id').value = s.id;
  document.getElementById('serv-nombre').value = s.nombre;
  document.getElementById('serv-categoria').value = s.categoria;
  document.getElementById('serv-icono').value = s.icono || '';
  document.getElementById('serv-tiempo').value = s.tiempo_estimado || '';
  document.getElementById('serv-precio').value = s.precio_referencia || '';
  document.getElementById('serv-descripcion').value = s.descripcion || '';
  document.getElementById('serv-equipos').value = s.equipos_compatibles || '';
  document.getElementById('serv-destacado').checked = !!s.destacado;

  // Cargar ítems de "¿Qué incluye este servicio técnico?"
  cargarTareasServicioEnFormulario(s.tareas_incluidas, s.beneficios);

  // Cargar vista previa del icono o imagen actual
  const fileInput = document.getElementById('serv-file-input');
  if (fileInput) fileInput.value = '';
  const previewBox = document.getElementById('serv-preview-box');
  const dropzone = document.getElementById('serv-dropzone');
  const previewImg = document.getElementById('serv-preview-img');
  const previewName = document.getElementById('serv-preview-name');
  const previewStatus = document.getElementById('serv-preview-status-text');

  if (s.icono && !s.icono.trim().startsWith('<svg')) {
    if (previewImg) previewImg.src = s.icono;
    if (previewName) previewName.textContent = s.icono.split('/').pop() || 'icono';
    if (previewStatus) {
      previewStatus.textContent = 'Icono asignado';
      previewStatus.style.color = 'var(--success)';
    }
    if (previewBox) previewBox.style.display = 'flex';
    if (dropzone) dropzone.style.display = 'none';
  } else {
    if (previewBox) previewBox.style.display = 'none';
    if (dropzone) dropzone.style.display = 'flex';
  }

  abrirModal('modal-servicio');
}

async function guardarServicio(e) {
  e.preventDefault();
  const id = document.getElementById('serv-id').value;
  const tareasIncluidas = obtenerTareasServicioDesdeFormulario();
  const servicioActual = id ? state.servicios.find(item => String(item.id) === String(id)) : null;
  const beneficiosActuales = (servicioActual && Array.isArray(servicioActual.beneficios) && servicioActual.beneficios.length > 0)
    ? servicioActual.beneficios
    : tareasIncluidas.slice(0, 3);

  const payload = {
    nombre: document.getElementById('serv-nombre').value.trim(),
    categoria: document.getElementById('serv-categoria').value,
    icono: document.getElementById('serv-icono').value.trim(),
    tiempo_estimado: document.getElementById('serv-tiempo').value.trim(),
    precio_referencia: document.getElementById('serv-precio').value.trim(),
    descripcion: document.getElementById('serv-descripcion').value.trim(),
    equipos_compatibles: document.getElementById('serv-equipos').value.trim(),
    tareas_incluidas: tareasIncluidas,
    beneficios: beneficiosActuales,
    destacado: document.getElementById('serv-destacado').checked,
  };

  try {
    if (id) {
      await apiFetch(`/servicios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      showToast('Servicio actualizado con éxito.', 'success');
    } else {
      await apiFetch('/servicios', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      showToast('Servicio agregado al catálogo.', 'success');
    }

    cerrarModal('modal-servicio');
    cargarServicios();
    cargarDashboard();
    notificarCambioCatalogo('servicios');
  } catch (err) {
    showToast('Error al guardar servicio: ' + err.message, 'error');
  }
}

async function eliminarServicio(id) {
  const s = state.servicios.find(item => item.id === id);
  if (!confirm(`¿Estás seguro de eliminar el servicio "${s ? s.nombre : id}"?`)) return;

  try {
    await apiFetch(`/servicios/${id}`, { method: 'DELETE' });
    showToast('Servicio eliminado.', 'info');
    cargarServicios();
    cargarDashboard();
    notificarCambioCatalogo('servicios');
  } catch (err) {
    showToast('Error al eliminar: ' + err.message, 'error');
  }
}

// ============================================================================
// 7. MÓDULO: MENSAJES & COTIZACIONES (LEADS)
// ============================================================================

async function cargarContacto() {
  const tbody = document.getElementById('tbody-contacto');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Cargando solicitudes...</td></tr>';

  try {
    const estado = document.getElementById('filtro-estado-contacto').value;
    const url = estado && estado !== 'todos' ? `/contacto?estado=${estado}` : '/contacto';

    const data = await apiFetch(url);
    state.mensajes = data.mensajes || [];

    if (state.mensajes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay solicitudes en este estado.</td></tr>';
      return;
    }

    tbody.innerHTML = state.mensajes.map(m => {
      const fecha = new Date(m.creado_en).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
      const numWa = String(m.telefono || '').replace(/\D/g, '');
      const waLink = numWa ? `https://wa.me/57${numWa.slice(-10)}?text=${encodeURIComponent(`Hola ${m.nombre}, te contactamos desde JecTech Soluciones sobre tu solicitud de ${m.tipo_solicitud}.`)}` : '#';

      return `
        <tr>
          <td><small style="color: var(--text-dim);">${fecha}</small></td>
          <td>
            <strong>${m.nombre}</strong><br>
            <small style="color: var(--text-muted);">${m.email || 'Sin correo'}</small>
          </td>
          <td>
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="background-color: #25D366; color: #fff; padding: 0.2rem 0.5rem;" title="Abrir chat con el cliente">
              💬 ${m.telefono}
            </a>
          </td>
          <td><span class="badge badge-info">${m.tipo_solicitud}</span></td>
          <td style="max-width: 260px;">
            <p style="font-size: 0.85rem; margin: 0; line-height: 1.3;" title="${m.mensaje}">
              ${m.mensaje}
            </p>
          </td>
          <td>
            <select class="form-control" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onchange="cambiarEstadoMensaje(${m.id}, this.value)">
              <option value="nuevo" ${m.estado === 'nuevo' ? 'selected' : ''}>Nuevo</option>
              <option value="en_gestion" ${m.estado === 'en_gestion' ? 'selected' : ''}>En Gestión</option>
              <option value="atendido" ${m.estado === 'atendido' ? 'selected' : ''}>Atendido</option>
            </select>
          </td>
          <td style="text-align: right;">
            <button type="button" class="btn-icon delete" onclick="eliminarMensaje(${m.id})" title="Eliminar lead">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger); padding: 1.5rem;">${err.message}</td></tr>`;
  }
}

async function cambiarEstadoMensaje(id, nuevoEstado) {
  try {
    await apiFetch(`/contacto/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    showToast(`Estado actualizado a: ${nuevoEstado}`, 'success');
    cargarDashboard();
  } catch (err) {
    showToast('Error al actualizar estado: ' + err.message, 'error');
  }
}

async function eliminarMensaje(id) {
  if (!confirm('¿Deseas eliminar este registro de cotización?')) return;
  try {
    await apiFetch(`/contacto/${id}`, { method: 'DELETE' });
    showToast('Solicitud eliminada.', 'info');
    cargarContacto();
    cargarDashboard();
  } catch (err) {
    showToast('Error al eliminar: ' + err.message, 'error');
  }
}

// ============================================================================
// 8. MÓDULO: FAQS (PREGUNTAS FRECUENTES)
// ============================================================================

async function cargarFaqs() {
  const tbody = document.getElementById('tbody-faqs');
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Cargando preguntas frecuentes...</td></tr>';

  try {
    const data = await apiFetch('/faqs');
    state.faqs = data.faqs || [];

    if (state.faqs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay preguntas frecuentes registradas.</td></tr>';
      return;
    }

    tbody.innerHTML = state.faqs.map((f, idx) => `
      <tr>
        <td><strong>#${f.orden || (idx + 1)}</strong></td>
        <td><strong>${f.pregunta}</strong></td>
        <td><span class="badge badge-info">${f.categoria || 'General'}</span></td>
        <td style="max-width: 300px;"><small style="color: var(--text-muted);">${f.respuesta.slice(0, 100)}...</small></td>
        <td style="text-align: right;">
          <button type="button" class="btn-icon" onclick="editarFaq(${f.id})" title="Editar pregunta">✏️</button>
          <button type="button" class="btn-icon delete" onclick="eliminarFaq(${f.id})" title="Eliminar pregunta">🗑️</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--danger); padding: 1.5rem;">${err.message}</td></tr>`;
  }
}

function abrirModalFaqNueva() {
  document.getElementById('modal-faq-title').textContent = 'Crear Pregunta Frecuente';
  document.getElementById('form-faq').reset();
  document.getElementById('faq-id').value = '';
  abrirModal('modal-faq');
}

function editarFaq(id) {
  const f = state.faqs.find(item => item.id === id);
  if (!f) return;

  document.getElementById('modal-faq-title').textContent = 'Editar Pregunta Frecuente';
  document.getElementById('faq-id').value = f.id;
  document.getElementById('faq-pregunta').value = f.pregunta;
  document.getElementById('faq-categoria').value = f.categoria || '';
  document.getElementById('faq-respuesta').value = f.respuesta;

  abrirModal('modal-faq');
}

async function guardarFaq(e) {
  e.preventDefault();
  const id = document.getElementById('faq-id').value;
  const payload = {
    pregunta: document.getElementById('faq-pregunta').value.trim(),
    categoria: document.getElementById('faq-categoria').value.trim(),
    respuesta: document.getElementById('faq-respuesta').value.trim(),
  };

  try {
    if (id) {
      await apiFetch(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('Pregunta frecuente actualizada.', 'success');
    } else {
      await apiFetch('/faqs', { method: 'POST', body: JSON.stringify(payload) });
      showToast('Pregunta agregada a la base de conocimiento.', 'success');
    }
    cerrarModal('modal-faq');
    cargarFaqs();
  } catch (err) {
    showToast('Error al guardar: ' + err.message, 'error');
  }
}

async function eliminarFaq(id) {
  if (!confirm('¿Eliminar esta pregunta frecuente?')) return;
  try {
    await apiFetch(`/faqs/${id}`, { method: 'DELETE' });
    showToast('Pregunta eliminada.', 'info');
    cargarFaqs();
  } catch (err) {
    showToast('Error al eliminar: ' + err.message, 'error');
  }
}

// ============================================================================
// 9. MÓDULO: CONFIGURACIÓN GENERAL
// ============================================================================

async function cargarConfiguracion() {
  try {
    const data = await apiFetch('/config');
    if (data.ok && data.config) {
      state.config = data.config;
      document.getElementById('cfg-business-name').value = data.config.business_name || '';
      document.getElementById('cfg-whatsapp-phone').value = data.config.whatsapp_phone || '';
      document.getElementById('cfg-email-contacto').value = data.config.email_contacto || '';
      document.getElementById('cfg-direccion-taller').value = data.config.direccion_taller || '';
      document.getElementById('cfg-horario-atencion').value = data.config.horario_atencion || '';
    }
  } catch (err) {
    showToast('Error al cargar configuración: ' + err.message, 'error');
  }
}

async function guardarConfiguracion(e) {
  e.preventDefault();
  const config = {
    business_name: document.getElementById('cfg-business-name').value.trim(),
    whatsapp_phone: document.getElementById('cfg-whatsapp-phone').value.trim(),
    email_contacto: document.getElementById('cfg-email-contacto').value.trim(),
    direccion_taller: document.getElementById('cfg-direccion-taller').value.trim(),
    horario_atencion: document.getElementById('cfg-horario-atencion').value.trim(),
  };

  try {
    await apiFetch('/config', {
      method: 'PUT',
      body: JSON.stringify({ config }),
    });

    // Notificar en tiempo real a todas las pestañas de la tienda y páginas de contacto
    localStorage.setItem('tecnofix_business_config', JSON.stringify(config));
    localStorage.setItem('tecnofix_config_updated', Date.now().toString());
    notificarCambioCatalogo('config');

    showToast('Datos comerciales actualizados y sincronizados con el sitio web.', 'success');
  } catch (err) {
    showToast('Error al guardar datos comerciales: ' + err.message, 'error');
  }
}

async function cambiarPassword(e) {
  e.preventDefault();
  const actual = document.getElementById('pwd-actual').value;
  const nueva = document.getElementById('pwd-nueva').value;
  const confirmar = document.getElementById('pwd-confirmar').value;

  if (nueva !== confirmar) {
    showToast('Las contraseñas nuevas no coinciden.', 'error');
    return;
  }

  try {
    await apiFetch('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ passwordActual: actual, passwordNueva: nueva }),
    });
    showToast('Contraseña actualizada con éxito.', 'success');
    document.getElementById('form-change-password').reset();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ============================================================================
// 9.5 MÓDULO: PÁGINA PRINCIPAL (SECCIONES E IMÁGENES CON TEXTO ENCIMA)
// ============================================================================

async function cargarSeccionesHome(pagina = state.paginaContenidoActiva || 'inicio') {
  state.paginaContenidoActiva = pagina;

  const infoPaginas = {
    inicio: {
      titulo: 'Secciones y Banners de la Página Principal (Inicio)',
      desc: 'Edita o elimina las secciones actuales del Inicio, o agrega nuevas con imágenes desde tu computador y texto encima.',
      btn: 'Nueva Sección en Inicio',
    },
    nosotros: {
      titulo: 'Secciones y Contenido de Nosotros',
      desc: 'Edita o elimina el contenido existente de la sección Nosotros, o agrega nuevas secciones con imágenes y texto encima.',
      btn: 'Nueva Sección en Nosotros',
    },
    contacto: {
      titulo: 'Secciones y Contenido de Contacto',
      desc: 'Edita o elimina las secciones de Contacto, o agrega nuevas secciones con imágenes desde tu computador.',
      btn: 'Nueva Sección en Contacto',
    },
  };

  const cfg = infoPaginas[pagina] || infoPaginas.inicio;
  const titleEl = document.getElementById('secciones-web-panel-title');
  const descEl = document.getElementById('secciones-web-panel-desc');
  const btnEl = document.getElementById('btn-nueva-seccion-label');

  if (titleEl) titleEl.textContent = cfg.titulo;
  if (descEl) descEl.textContent = cfg.desc;
  if (btnEl) btnEl.textContent = cfg.btn;

  try {
    const data = await apiFetch(`/secciones-home?admin=true&pagina=${encodeURIComponent(pagina)}`);
    if (data.ok) {
      state.seccionesHome = data.secciones || [];
      renderizarTablaSeccionesHome();
    }
  } catch (err) {
    showToast('Error al cargar secciones: ' + err.message, 'error');
  }
}

function renderizarTablaSeccionesHome() {
  const tbody = document.getElementById('tbody-secciones-home');
  if (!tbody) return;

  if (state.seccionesHome.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay secciones registradas en esta pestaña. Haz clic en el botón superior para agregar una nueva.</td></tr>';
    return;
  }

  const posMap = {
    izquierda: 'Izquierda',
    centro: 'Centrado',
    derecha: 'Derecha',
  };

  const claveNombreMap = {
    // Inicio
    hero: '1. Portada Principal (Hero)',
    rutas: '2. Rutas de Atención',
    diagnostico: '3. Diagnóstico Orientativo',
    servicios_destacados: '4. Servicios Destacados',
    productos_destacados: '5. Productos Destacados',
    antes_despues: '6. Galería Antes y Después',
    valores: '7. Valores y Confianza',
    aeo_local: '8. Respuestas Rápidas (Bogotá)',
    cta_final: '9. Banner Final (CTA)',
    // Nosotros
    nosotros_cabecera: '1. Cabecera Nosotros',
    nosotros_historia: '2. Nuestra Trayectoria e Historia',
    nosotros_valores: '3. Cultura y Valores Fundamentales',
    nosotros_galeria: '4. Galería de Trabajos y Antes/Después',
    nosotros_testimonios: '5. Testimonios de Clientes',
    // Contacto
    contacto_cabecera: '1. Cabecera Contacto',
    contacto_datos: '2. Información y Datos de Atención',
    contacto_ubicacion: '3. Ubicación del Taller y Cómo Llegar',
    contacto_formulario: '4. Formulario de Solicitud',
  };

  tbody.innerHTML = state.seccionesHome.map(s => {
    const imgSrc = s.imagen.startsWith('/') || s.imagen.startsWith('http') ? s.imagen : `/${s.imagen}`;
    const etiquetaSeccion = s.clave_seccion
      ? `<span class="badge badge-info" style="margin-bottom: 0.25rem; display: inline-block;">${escapeHtml(claveNombreMap[s.clave_seccion] || s.clave_seccion)}</span><br>`
      : `<span class="badge badge-warning" style="margin-bottom: 0.25rem; display: inline-block;">Sección Adicional</span><br>`;
    return `
      <tr>
        <td><strong>#${s.orden ?? 0}</strong></td>
        <td>
          <div class="admin-table-banner-thumb">
            <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(s.titulo)}" onerror="this.src='/assets/images/hero/hero-taller.svg'">
            <div class="admin-table-banner-thumb-overlay">
              <span>${escapeHtml(s.titulo)}</span>
            </div>
          </div>
        </td>
        <td>
          ${etiquetaSeccion}
          <strong>${escapeHtml(s.titulo)}</strong>
          ${s.subtitulo ? `<div style="font-size: 0.78rem; color: var(--accent); margin-top: 0.15rem;">${escapeHtml(s.subtitulo)}</div>` : ''}
        </td>
        <td style="max-width: 300px; color: var(--text-muted); font-size: 0.85rem;">
          ${escapeHtml(s.descripcion)}
        </td>
        <td><span class="badge badge-info">${posMap[s.posicion_texto] || 'Izquierda'}</span></td>
        <td>
          ${s.activo
        ? '<span class="badge badge-success">Visible</span>'
        : '<span class="badge badge-danger">Oculta</span>'}
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="editarSeccionHome(${s.id})">Editar</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="eliminarSeccionHome(${s.id})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function actualizarLivePreviewSeccionHome() {
  const titulo = document.getElementById('sec-titulo')?.value.trim() || 'Título de tu sección aquí';
  const subtitulo = document.getElementById('sec-subtitulo')?.value.trim() || '';
  const descripcion = document.getElementById('sec-descripcion')?.value.trim() || 'Aquí se verá el texto descriptivo superpuesto directamente encima de la imagen seleccionada.';
  const posicion = document.getElementById('sec-posicion')?.value || 'izquierda';
  const textoBoton = document.getElementById('sec-texto-boton')?.value.trim() || '';
  const imagen = document.getElementById('sec-imagen')?.value.trim() || 'assets/images/hero/hero-taller.svg';

  const bgEl = document.getElementById('sec-live-preview-bg');
  const overlayEl = document.getElementById('sec-live-preview-overlay');
  const subEl = document.getElementById('sec-live-preview-sub');
  const titleEl = document.getElementById('sec-live-preview-title');
  const descEl = document.getElementById('sec-live-preview-desc');
  const btnEl = document.getElementById('sec-live-preview-btn');

  if (bgEl) {
    bgEl.src = imagen.startsWith('/') || imagen.startsWith('http') || imagen.startsWith('data:') ? imagen : `/${imagen}`;
  }
  if (overlayEl) {
    overlayEl.className = `admin-banner-live-overlay pos-${posicion}`;
  }
  if (subEl) {
    subEl.textContent = subtitulo;
    subEl.style.display = subtitulo ? 'inline-block' : 'none';
  }
  if (titleEl) titleEl.textContent = titulo;
  if (descEl) descEl.textContent = descripcion;
  if (btnEl) {
    btnEl.textContent = textoBoton;
    btnEl.style.display = textoBoton ? 'inline-block' : 'none';
  }
}

function abrirModalSeccionHomeNueva() {
  const pag = state.paginaContenidoActiva || 'inicio';
  const nombresPag = { inicio: 'Inicio', nosotros: 'Nosotros', contacto: 'Contacto' };
  document.getElementById('modal-seccion-home-title').textContent = `Nueva Sección en ${nombresPag[pag] || 'Inicio'}`;
  document.getElementById('form-seccion-home').reset();
  document.getElementById('sec-id').value = '';
  document.getElementById('sec-pagina').value = pag;
  document.getElementById('sec-posicion').value = 'izquierda';
  document.getElementById('sec-texto-boton').value = 'Más Información';
  document.getElementById('sec-enlace-boton').value = 'contacto.html';
  document.getElementById('sec-orden').value = (state.seccionesHome.length + 1).toString();
  document.getElementById('sec-activo').checked = true;

  // Resetear selector de imagen
  document.getElementById('sec-imagen').value = 'assets/images/hero/hero-taller.svg';
  document.getElementById('sec-file-input').value = '';
  document.getElementById('sec-preview-box').style.display = 'none';
  document.getElementById('sec-dropzone').style.display = 'flex';

  actualizarLivePreviewSeccionHome();
  abrirModal('modal-seccion-home');
}

function editarSeccionHome(id) {
  const s = state.seccionesHome.find(item => item.id === id);
  if (!s) return;

  document.getElementById('modal-seccion-home-title').textContent = `Editar Sección: ${s.titulo}`;
  document.getElementById('sec-id').value = s.id;
  document.getElementById('sec-pagina').value = s.pagina || state.paginaContenidoActiva || 'inicio';
  document.getElementById('sec-titulo').value = s.titulo || '';
  document.getElementById('sec-subtitulo').value = s.subtitulo || '';
  document.getElementById('sec-descripcion').value = s.descripcion || '';
  document.getElementById('sec-posicion').value = s.posicion_texto || 'izquierda';
  document.getElementById('sec-texto-boton').value = s.texto_boton || '';
  document.getElementById('sec-enlace-boton').value = s.enlace_boton || 'contacto.html';
  document.getElementById('sec-orden').value = s.orden ?? 1;
  document.getElementById('sec-activo').checked = Boolean(s.activo);

  const imgActual = s.imagen || 'assets/images/hero/hero-taller.svg';
  document.getElementById('sec-imagen').value = imgActual;
  document.getElementById('sec-file-input').value = '';

  const previewImg = document.getElementById('sec-preview-img');
  const previewName = document.getElementById('sec-preview-name');
  const previewStatus = document.getElementById('sec-preview-status-text');

  if (previewImg) {
    previewImg.src = imgActual.startsWith('/') || imgActual.startsWith('http') ? imgActual : `/${imgActual}`;
  }
  if (previewName) {
    previewName.textContent = imgActual.split('/').pop() || 'imagen-seccion';
  }
  if (previewStatus) {
    previewStatus.textContent = 'Imagen actual activa';
    previewStatus.style.color = 'var(--success)';
  }

  document.getElementById('sec-dropzone').style.display = 'none';
  document.getElementById('sec-preview-box').style.display = 'flex';

  actualizarLivePreviewSeccionHome();
  abrirModal('modal-seccion-home');
}

async function guardarSeccionHome(e) {
  e.preventDefault();
  const id = document.getElementById('sec-id').value;
  const pagina = document.getElementById('sec-pagina').value || state.paginaContenidoActiva || 'inicio';

  const payload = {
    pagina,
    titulo: document.getElementById('sec-titulo').value.trim(),
    subtitulo: document.getElementById('sec-subtitulo').value.trim(),
    descripcion: document.getElementById('sec-descripcion').value.trim(),
    imagen: document.getElementById('sec-imagen').value.trim() || 'assets/images/hero/hero-taller.svg',
    posicion_texto: document.getElementById('sec-posicion').value,
    texto_boton: document.getElementById('sec-texto-boton').value.trim(),
    enlace_boton: document.getElementById('sec-enlace-boton').value,
    orden: parseInt(document.getElementById('sec-orden').value, 10) || 0,
    activo: document.getElementById('sec-activo').checked,
  };

  try {
    if (id) {
      await apiFetch(`/secciones-home/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      showToast('Sección actualizada con éxito y sincronizada en el sitio web.', 'success');
    } else {
      await apiFetch('/secciones-home', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      showToast('Nueva sección agregada y publicada en el sitio web.', 'success');
    }

    cerrarModal('modal-seccion-home');
    cargarSeccionesHome(pagina);
    notificarCambioCatalogo('secciones-home');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function eliminarSeccionHome(id) {
  const s = state.seccionesHome.find(item => item.id === id);
  if (!confirm(`¿Estás seguro de eliminar la sección "${s ? s.titulo : id}"? Se quitará inmediatamente del sitio web.`)) return;

  try {
    await apiFetch(`/secciones-home/${id}`, { method: 'DELETE' });
    showToast('Sección eliminada del sitio web.', 'success');
    cargarSeccionesHome(state.paginaContenidoActiva || 'inicio');
    notificarCambioCatalogo('secciones-home');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ============================================================================
// 10. GESTIÓN DE MODALES Y EVENTOS UI
// ============================================================================

function abrirModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('is-open');
}

function cerrarModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('is-open');
}

// ============================================================================
// 11. SISTEMA DE SUBIDA Y SELECCIÓN DE IMÁGENES DESDE EL DISPOSITIVO
// ============================================================================

function configurarSubidaArchivos(cfg) {
  const dropzone = document.getElementById(cfg.dropzoneId);
  const fileInput = document.getElementById(cfg.fileInputId);
  const previewBox = document.getElementById(cfg.previewBoxId);
  const previewImg = document.getElementById(cfg.previewImgId);
  const previewName = document.getElementById(cfg.previewNameId);
  const previewStatus = document.getElementById(cfg.previewStatusId);
  const hiddenInput = document.getElementById(cfg.hiddenInputId);
  const changeBtn = document.getElementById(cfg.changeBtnId);
  const removeBtn = document.getElementById(cfg.removeBtnId);

  if (!dropzone || !fileInput) return;

  // Clic en la zona activa el selector nativo del dispositivo (explorador / galería)
  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  if (changeBtn) {
    changeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  // Quitar la imagen cargada y volver al estado por defecto
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hiddenInput.value = cfg.defaultUrl;
      fileInput.value = '';
      if (previewBox) previewBox.style.display = 'none';
      if (dropzone) dropzone.style.display = 'flex';
      if (typeof cfg.onImageChange === 'function') cfg.onImageChange(cfg.defaultUrl);
      showToast('Imagen restablecida al valor por defecto.', 'info');
    });
  }

  // Soporte Drag and Drop
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      procesarArchivo(files[0]);
    }
  });

  // Selección mediante diálogo nativo de archivos
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
      procesarArchivo(fileInput.files[0]);
    }
  });

  function procesarArchivo(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, SVG o GIF).', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('La imagen supera el límite de 10 MB.', 'error');
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target.result;

      // Vista previa instantánea
      if (previewImg) previewImg.src = dataUrl;
      if (previewName) previewName.textContent = file.name;
      if (previewStatus) {
        previewStatus.textContent = 'Subiendo al servidor...';
        previewStatus.style.color = 'var(--accent)';
      }
      if (dropzone) dropzone.style.display = 'none';
      if (previewBox) previewBox.style.display = 'flex';

      try {
        const res = await apiFetch('/upload', {
          method: 'POST',
          body: JSON.stringify({
            image: dataUrl,
            nombre: file.name,
            tipo: cfg.tipo,
          }),
        });

        if (res.ok && res.url) {
          hiddenInput.value = res.url;
          if (typeof cfg.onImageChange === 'function') cfg.onImageChange(res.url);
          if (previewStatus) {
            previewStatus.textContent = 'Guardada en servidor';
            previewStatus.style.color = 'var(--success)';
          }
          showToast(`Imagen "${file.name}" cargada con éxito.`, 'success');
        } else {
          throw new Error(res.error || 'No fue posible subir la imagen');
        }
      } catch (err) {
        if (previewStatus) {
          previewStatus.textContent = 'Error al subir';
          previewStatus.style.color = 'var(--danger)';
        }
        showToast('Error al procesar la imagen: ' + err.message, 'error');
      }
    };

    reader.readAsDataURL(file);
  }
}

function inicializarGestorSubidaImagenes() {
  // Selector para Productos
  configurarSubidaArchivos({
    dropzoneId: 'prod-dropzone',
    fileInputId: 'prod-file-input',
    previewBoxId: 'prod-preview-box',
    previewImgId: 'prod-preview-img',
    previewNameId: 'prod-preview-name',
    previewStatusId: 'prod-preview-status-text',
    hiddenInputId: 'prod-imagen',
    changeBtnId: 'btn-prod-change-image',
    removeBtnId: 'btn-prod-remove-image',
    tipo: 'producto',
    defaultUrl: 'assets/images/productos/placeholder-tech.svg',
  });

  // Selector para Servicios
  configurarSubidaArchivos({
    dropzoneId: 'serv-dropzone',
    fileInputId: 'serv-file-input',
    previewBoxId: 'serv-preview-box',
    previewImgId: 'serv-preview-img',
    previewNameId: 'serv-preview-name',
    previewStatusId: 'serv-preview-status-text',
    hiddenInputId: 'serv-icono',
    changeBtnId: 'btn-serv-change-image',
    removeBtnId: 'btn-serv-remove-image',
    tipo: 'servicio',
    defaultUrl: '',
  });

  // Selector para Secciones de la Página Principal
  configurarSubidaArchivos({
    dropzoneId: 'sec-dropzone',
    fileInputId: 'sec-file-input',
    previewBoxId: 'sec-preview-box',
    previewImgId: 'sec-preview-img',
    previewNameId: 'sec-preview-name',
    previewStatusId: 'sec-preview-status-text',
    hiddenInputId: 'sec-imagen',
    changeBtnId: 'btn-sec-change-image',
    removeBtnId: 'btn-sec-remove-image',
    tipo: 'seccion-home',
    defaultUrl: 'assets/images/hero/hero-taller.svg',
    onImageChange: () => actualizarLivePreviewSeccionHome(),
  });
}

// Inicialización de escuchadores de eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar subida de imágenes desde dispositivo
  inicializarGestorSubidaImagenes();
  // Login submit
  document.getElementById('form-login').addEventListener('submit', handleLoginSubmit);

  // Logout
  document.getElementById('btn-logout').addEventListener('click', handleLogout);

  // Navegación en el menú izquierdo (Sidebar)
  document.querySelectorAll('.sidebar-menu .nav-link[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navegarA(link.dataset.section);
    });
  });

  // Toggle de Sidebar móvil
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const btnCloseSidebar = document.getElementById('btn-close-sidebar');
  const sidebar = document.getElementById('sidebar');

  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', () => sidebar.classList.add('is-open'));
  }
  if (btnCloseSidebar) {
    btnCloseSidebar.addEventListener('click', () => sidebar.classList.remove('is-open'));
  }

  // Botones de modales
  document.getElementById('btn-nuevo-producto').addEventListener('click', abrirModalProductoNuevo);
  document.getElementById('btn-nuevo-servicio').addEventListener('click', abrirModalServicioNuevo);
  document.getElementById('btn-nueva-faq').addEventListener('click', abrirModalFaqNueva);
  const btnNuevaSeccionHome = document.getElementById('btn-nueva-seccion-home');
  if (btnNuevaSeccionHome) {
    btnNuevaSeccionHome.addEventListener('click', abrirModalSeccionHomeNueva);
  }

  // Vista previa en vivo al escribir en el modal de Secciones de Inicio
  ['sec-titulo', 'sec-subtitulo', 'sec-descripcion', 'sec-posicion', 'sec-texto-boton'].forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.addEventListener('input', actualizarLivePreviewSeccionHome);
      el.addEventListener('change', actualizarLivePreviewSeccionHome);
    }
  });

  // Agregar fila de especificación técnica (Productos)
  const btnAddSpec = document.getElementById('btn-add-spec');
  if (btnAddSpec) {
    btnAddSpec.addEventListener('click', () => crearFilaEspecificacion('', ''));
  }

  // Agregar fila de "¿Qué incluye este servicio técnico?" (Servicios)
  const btnAddTareaServicio = document.getElementById('btn-add-tarea-servicio');
  if (btnAddTareaServicio) {
    btnAddTareaServicio.addEventListener('click', () => crearFilaTareaServicio(''));
  }

  // Formularios de modales
  document.getElementById('form-producto').addEventListener('submit', guardarProducto);
  document.getElementById('form-servicio').addEventListener('submit', guardarServicio);
  document.getElementById('form-faq').addEventListener('submit', guardarFaq);
  const formSeccionHome = document.getElementById('form-seccion-home');
  if (formSeccionHome) {
    formSeccionHome.addEventListener('submit', guardarSeccionHome);
  }

  // Formularios de configuración
  document.getElementById('form-config-business').addEventListener('submit', guardarConfiguracion);
  document.getElementById('form-change-password').addEventListener('submit', cambiarPassword);

  // Filtros dinámicos
  document.getElementById('filtro-busqueda-producto').addEventListener('input', () => {
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(cargarProductos, 300);
  });
  document.getElementById('filtro-categoria-producto').addEventListener('change', cargarProductos);
  document.getElementById('filtro-estado-contacto').addEventListener('change', cargarContacto);

  // Cerrar modales con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.is-open').forEach(m => m.classList.remove('is-open'));
    }
  });

  // Verificar sesión existente
  verificarSesionInicial();
});

// Exponer funciones globales para interacción inline
window.navegarA = navegarA;
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
window.editarServicio = editarServicio;
window.eliminarServicio = eliminarServicio;
window.cambiarEstadoMensaje = cambiarEstadoMensaje;
window.eliminarMensaje = eliminarMensaje;
window.editarFaq = editarFaq;
window.eliminarFaq = eliminarFaq;
window.editarSeccionHome = editarSeccionHome;
window.eliminarSeccionHome = eliminarSeccionHome;
