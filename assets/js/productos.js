/**
 * ==========================================================================
 * RENDERIZADO Y CONTROL DE PRODUCTOS (CATÁLOGO DIGITAL)
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

/**
 * Formatea un valor numérico a moneda colombiana (COP)
 * @param {number} valor - Monto numérico
 * @returns {string} Formato estándar: "$ 145.000 COP"
 */
function formatearPrecioCOP(valor) {
  if (typeof valor !== "number") return "$ 0 COP";
  return `$ ${valor.toLocaleString("es-CO")} COP`;
}

/**
 * Retorna el HTML de la etiqueta de disponibilidad
 * @param {string} estado - "disponible" | "agotado" | "consultar"
 */
function obtenerBadgeDisponibilidad(estado) {
  switch (estado) {
    case "disponible":
      return `<span class="badge badge-available"><span class="badge-dot"></span>Disponible</span>`;
    case "agotado":
      return `<span class="badge badge-out-of-stock"><span class="badge-dot"></span>Agotado</span>`;
    case "consultar":
    default:
      return `<span class="badge badge-consult"><span class="badge-dot"></span>Consultar</span>`;
  }
}

/**
 * Renderiza la lista de productos en el contenedor indicado
 * @param {Array} productos - Arreglo de productos a desplegar
 * @param {string} contenedorId - ID del contenedor en el DOM
 */
function renderizarProductos(productos, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  if (!productos || productos.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state text-center" style="grid-column: 1 / -1; padding: 4rem 1.5rem; background: var(--color-bg-card); border: 1px dashed var(--color-border); border-radius: var(--radius-lg);">
        <svg style="width: 48px; height: 48px; color: var(--color-text-muted); margin: 0 auto 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3 style="margin-bottom: 0.5rem;">No se encontraron productos</h3>
        <p class="text-muted" style="margin-bottom: 1.5rem; max-width: 480px; margin-left: auto; margin-right: auto;">
          Intenta ajustar los términos de búsqueda o cambiar los filtros seleccionados para encontrar lo que necesitas.
        </p>
        <button type="button" class="btn btn-outline-primary" onclick="resetearFiltros()">
          Restablecer todos los filtros
        </button>
      </div>
    `;
    return;
  }

  const esc = (window.Security && typeof window.Security.escapeHTML === "function")
    ? window.Security.escapeHTML
    : (str => String(str || "").replace(/[&<>"']/g, ""));

  contenedor.innerHTML = productos.map((p, index) => {
    const nombre = esc(p.nombre);
    const marca = esc(p.marca);
    const categoria = esc(p.categoria);
    const desc = esc(p.descripcion);
    const imagen = (window.Security && typeof window.Security.sanitizeUrl === "function") ? window.Security.sanitizeUrl(p.imagen) : p.imagen;
    const loadingAttr = index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';

    return `
    <article class="product-card" data-product-id="${Number(p.id)}">
      <div class="product-image-wrap">
        <div class="product-badges">
          ${obtenerBadgeDisponibilidad(p.disponible)}
        </div>
        <img src="${imagen}" alt="${nombre}" ${loadingAttr} width="280" height="210" onerror="this.onerror=null; this.src='assets/images/productos/placeholder-tech.svg';">
      </div>
      
      <div class="product-body">
        <div class="product-meta">
          <span class="product-brand">${marca}</span>
          <span class="product-category-text">${categoria}</span>
        </div>
        
        <h3 class="product-title" title="${nombre}">${nombre}</h3>
        <p class="product-desc">${desc}</p>
        
        <div class="product-price-row">
          <div>
            <span class="product-price-label">Precio</span>
            <div class="product-price">${formatearPrecioCOP(p.precio)}</div>
          </div>
        </div>

        <div class="product-actions">
          <button type="button" class="btn btn-outline btn-sm" onclick="mostrarDetalleProducto(${Number(p.id)})">
            Ver detalles
          </button>
          <button type="button" class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${Number(p.id)})" ${p.disponible === 'agotado' ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''} aria-label="Agregar ${nombre} al carrito de compras">
            <svg style="width: 15px; height: 15px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            ${p.disponible === 'agotado' ? 'Agotado' : '+ Carrito'}
          </button>
        </div>
      </div>
    </article>
  `;
  }).join("");
}

/**
 * Abre el modal con ficha técnica exhaustiva del producto
 * @param {number} idProducto - ID del producto
 */
function mostrarDetalleProducto(idProducto) {
  if (!window.PRODUCTOS_DATA) return;
  const p = window.PRODUCTOS_DATA.find(item => item.id === idProducto);
  if (!p) return;

  const esc = (window.Security && typeof window.Security.escapeHTML === "function")
    ? window.Security.escapeHTML
    : (str => String(str || "").replace(/[&<>"']/g, ""));

  const nombreSeguro = esc(p.nombre);
  const marcaSegura = esc(p.marca);
  const descSegura = esc(p.descripcion);
  const imagenSegura = (window.Security && typeof window.Security.sanitizeUrl === "function") ? window.Security.sanitizeUrl(p.imagen) : p.imagen;
  const precioFormateado = formatearPrecioCOP(p.precio);

  // Armar tabla de especificaciones
  let filasSpecs = "";
  if (p.especificaciones && typeof p.especificaciones === "object") {
    for (const [clave, valor] of Object.entries(p.especificaciones)) {
      filasSpecs += `
        <tr>
          <th>${esc(clave)}</th>
          <td>${esc(valor)}</td>
        </tr>
      `;
    }
  }

  const bodyHtml = `
    <div class="product-detail-modal">
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: center;">
        <div style="flex: 1; min-width: 240px; background-color: var(--color-bg-secondary); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border);">
          <img src="${imagenSegura}" alt="${nombreSeguro}" style="max-height: 200px; object-fit: contain;" onerror="this.onerror=null; this.src='assets/images/productos/placeholder-tech.svg';">
        </div>
        <div style="flex: 1.2; min-width: 240px;">
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
            <span class="badge badge-category">${marcaSegura}</span>
            ${obtenerBadgeDisponibilidad(p.disponible)}
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${nombreSeguro}</h3>
          <p class="text-sm" style="margin-bottom: 1rem;">${descSegura}</p>
          <div style="background-color: var(--color-bg-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <span class="text-xs text-muted" style="text-transform: uppercase;">Precio de referencia</span>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary);">${precioFormateado}</div>
          </div>
        </div>
      </div>

      <h4 style="margin-bottom: 0.5rem;">Ficha técnica y especificaciones</h4>
      <table class="specs-table">
        <tbody>
          ${filasSpecs}
        </tbody>
      </table>

      <p class="text-xs text-muted" style="margin-top: 1rem;">
        * Nota: Los precios y disponibilidad son orientativos. Al no contar con inventario en tiempo real, puedes confirmar existencias directas escribiéndonos a WhatsApp.
      </p>
    </div>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>
    <button type="button" class="btn btn-primary" onclick="agregarAlCarrito(${Number(p.id)}); cerrarModal();" ${p.disponible === 'agotado' ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''}>
      <svg style="width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      Agregar al carrito
    </button>
    <button type="button" class="btn btn-whatsapp" id="btn-modal-wa-consultar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      Consultar en WhatsApp
    </button>
  `;

  abrirModal(nombreSeguro, bodyHtml, footerHtml);

  // Vincular evento de forma segura sin interpolación en atributo inline
  setTimeout(() => {
    const btnWa = document.getElementById("btn-modal-wa-consultar");
    if (btnWa) {
      btnWa.addEventListener("click", () => {
        if (typeof window.consultarProductoWhatsApp === "function") {
          window.consultarProductoWhatsApp(p.nombre, precioFormateado, p.marca);
        }
        cerrarModal();
      });
    }
  }, 50);
}

// Exponer en el objeto global
window.formatearPrecioCOP = formatearPrecioCOP;
window.obtenerBadgeDisponibilidad = obtenerBadgeDisponibilidad;
window.renderizarProductos = renderizarProductos;
window.mostrarDetalleProducto = mostrarDetalleProducto;
