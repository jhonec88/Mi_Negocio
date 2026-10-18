/**
 * ==========================================================================
 * MÓDULO DEL CARRITO DE COMPRAS (SHOPPING CART)
 * Persistencia en localStorage, Drawer lateral interactivo y Pedido vía WhatsApp
 * ==========================================================================
 */

const CARRITO_STORAGE_KEY = "tecnofix-cart";

/**
 * Obtiene los productos almacenados en el carrito
 * @returns {Array} Lista de items del carrito [{ id, nombre, precio, imagen, cantidad, marca }]
 */
function obtenerCarrito() {
  try {
    const data = localStorage.getItem(CARRITO_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error al leer carrito de localStorage:", e);
    return [];
  }
}

/**
 * Guarda los productos en localStorage y sincroniza la UI
 * @param {Array} carrito
 */
function guardarCarrito(carrito) {
  try {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
  } catch (e) {
    console.error("Error al guardar carrito en localStorage:", e);
  }
  actualizarBadgeCarrito();
  renderizarCarritoDrawer();
}

/**
 * Agrega un producto al carrito por su ID
 * @param {number} idProducto - ID del producto en PRODUCTOS_DATA
 * @param {number} [cantidad=1] - Cantidad a agregar
 */
function agregarAlCarrito(idProducto, cantidad = 1) {
  if (!window.PRODUCTOS_DATA) return;
  const producto = window.PRODUCTOS_DATA.find(p => p.id === idProducto);
  if (!producto) return;

  const carrito = obtenerCarrito();
  const indexExistente = carrito.findIndex(item => item.id === idProducto);

  if (indexExistente > -1) {
    carrito[indexExistente].cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      marca: producto.marca || "",
      categoria: producto.categoria || "",
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);

  // Notificación toast visual
  if (typeof window.mostrarToast === "function") {
    window.mostrarToast(`🛒 ¡${producto.nombre} agregado al carrito!`, "success");
  }

  // Animación del badge
  animarBadgeCarrito();
}

/**
 * Modifica la cantidad de un producto (+1 o -1)
 * @param {number} idProducto
 * @param {number} delta - +1 para sumar, -1 para restar
 */
function actualizarCantidadCarrito(idProducto, delta) {
  let carrito = obtenerCarrito();
  const index = carrito.findIndex(item => item.id === idProducto);
  if (index === -1) return;

  carrito[index].cantidad += delta;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
    if (typeof window.mostrarToast === "function") {
      window.mostrarToast("Producto eliminado del carrito", "info");
    }
  }

  guardarCarrito(carrito);
}

/**
 * Elimina un producto por completo del carrito
 * @param {number} idProducto
 */
function eliminarDelCarrito(idProducto) {
  let carrito = obtenerCarrito();
  const itemEliminado = carrito.find(item => item.id === idProducto);
  carrito = carrito.filter(item => item.id !== idProducto);
  
  guardarCarrito(carrito);

  if (itemEliminado && typeof window.mostrarToast === "function") {
    window.mostrarToast(`Eliminado: ${itemEliminado.nombre}`, "info");
  }
}

/**
 * Vacía completamente el carrito
 */
function vaciarCarrito() {
  if (obtenerCarrito().length === 0) return;
  
  if (confirm("¿Estás seguro de que deseas vaciar todos los productos del carrito?")) {
    guardarCarrito([]);
    if (typeof window.mostrarToast === "function") {
      window.mostrarToast("El carrito ha sido vaciado", "info");
    }
  }
}

/**
 * Calcula los totales del carrito
 * @param {Array} carrito
 * @returns {{ articulos: number, total: number }}
 */
function calcularTotalesCarrito(carrito) {
  return carrito.reduce((acc, item) => {
    acc.articulos += item.cantidad;
    acc.total += (item.precio * item.cantidad);
    return acc;
  }, { articulos: 0, total: 0 });
}

/**
 * Actualiza los badges de conteo en la cabecera
 */
function actualizarBadgeCarrito() {
  const carrito = obtenerCarrito();
  const { articulos } = calcularTotalesCarrito(carrito);

  document.querySelectorAll(".cart-count-badge").forEach(badge => {
    badge.textContent = articulos;
    if (articulos > 0) {
      badge.style.display = "inline-flex";
    } else {
      badge.style.display = "none";
    }
  });
}

/**
 * Efecto visual de pulso en el botón del carrito
 */
function animarBadgeCarrito() {
  document.querySelectorAll(".cart-count-badge").forEach(badge => {
    badge.classList.remove("cart-badge-bounce");
    // Forzar reflujo
    void badge.offsetWidth;
    badge.classList.add("cart-badge-bounce");
  });
}

/**
 * Genera el contenedor HTML del Drawer del carrito si no existe
 */
function asegurarDrawerCarrito() {
  let drawerBackdrop = document.getElementById("cart-drawer-backdrop");
  if (!drawerBackdrop) {
    drawerBackdrop = document.createElement("div");
    drawerBackdrop.id = "cart-drawer-backdrop";
    drawerBackdrop.className = "cart-drawer-backdrop";
    drawerBackdrop.setAttribute("role", "dialog");
    drawerBackdrop.setAttribute("aria-modal", "true");
    drawerBackdrop.setAttribute("aria-label", "Carrito de compras");

    drawerBackdrop.innerHTML = `
      <div class="cart-drawer" id="cart-drawer-panel">
        
        <!-- Cabecera del Carrito -->
        <div class="cart-drawer-header">
          <div class="flex items-center gap-2">
            <svg style="width: 24px; height: 24px; color: var(--color-primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2 class="cart-drawer-title">Tu Carrito de Compras</h2>
          </div>
          <button type="button" class="modal-close-btn" id="btn-cerrar-cart" aria-label="Cerrar carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Lista de productos en el carrito -->
        <div class="cart-drawer-body" id="cart-items-container">
          <!-- Renderizado dinámico -->
        </div>

        <!-- Pie del Carrito con Totales y Botón WhatsApp -->
        <div class="cart-drawer-footer" id="cart-footer-container">
          <!-- Renderizado dinámico -->
        </div>

      </div>
    `;

    document.body.appendChild(drawerBackdrop);

    // Eventos de cierre
    const btnCerrar = drawerBackdrop.querySelector("#btn-cerrar-cart");
    if (btnCerrar) btnCerrar.addEventListener("click", cerrarCarrito);

    drawerBackdrop.addEventListener("click", (e) => {
      if (e.target === drawerBackdrop) {
        cerrarCarrito();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawerBackdrop.classList.contains("is-open")) {
        cerrarCarrito();
      }
    });
  }
  return drawerBackdrop;
}

/**
 * Abre el panel deslizante del carrito
 */
function abrirCarrito() {
  const drawerBackdrop = asegurarDrawerCarrito();
  renderizarCarritoDrawer();
  drawerBackdrop.classList.add("is-open");
  document.body.style.overflow = "hidden";

  // Foco accesible en el botón de cerrar
  setTimeout(() => {
    const btnCerrar = drawerBackdrop.querySelector("#btn-cerrar-cart");
    if (btnCerrar) btnCerrar.focus();
  }, 100);
}

/**
 * Cierra el panel del carrito
 */
function cerrarCarrito() {
  const drawerBackdrop = document.getElementById("cart-drawer-backdrop");
  if (!drawerBackdrop) return;
  drawerBackdrop.classList.remove("is-open");
  document.body.style.overflow = "";
}

/**
 * Renderiza los elementos dentro del Drawer del carrito
 */
function renderizarCarritoDrawer() {
  const itemsContainer = document.getElementById("cart-items-container");
  const footerContainer = document.getElementById("cart-footer-container");
  if (!itemsContainer || !footerContainer) return;

  const carrito = obtenerCarrito();
  const { articulos, total } = calcularTotalesCarrito(carrito);

  // Estado Vacío
  if (carrito.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-state text-center">
        <div class="cart-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">Tu carrito está vacío</h3>
        <p class="text-sm text-muted" style="margin-bottom: 1.5rem; max-width: 300px; margin-left: auto; margin-right: auto;">
          Explora nuestro catálogo para añadir componentes, periféricos o accesorios a tu pedido.
        </p>
        <a href="productos.html" class="btn btn-primary btn-sm" onclick="cerrarCarrito()">
          Explorar productos
        </a>
      </div>
    `;

    footerContainer.innerHTML = "";
    footerContainer.style.display = "none";
    return;
  }

  footerContainer.style.display = "block";

  // Listado de productos
  itemsContainer.innerHTML = `
    <div class="cart-items-list">
      ${carrito.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
          <div class="cart-item-img-wrap">
            <img src="${item.imagen}" alt="${item.nombre}" width="60" height="60" onerror="this.onerror=null; this.src='assets/images/productos/placeholder-tech.svg';">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-title" title="${item.nombre}">${item.nombre}</div>
            <div class="cart-item-price-unit">${typeof window.formatearPrecioCOP === "function" ? window.formatearPrecioCOP(item.precio) : `$ ${item.precio.toLocaleString("es-CO")} COP`}</div>
            
            <div class="cart-item-actions">
              <div class="cart-qty-controls">
                <button type="button" class="cart-qty-btn" onclick="actualizarCantidadCarrito(${item.id}, -1)" aria-label="Reducir una unidad de ${item.nombre}">-</button>
                <span class="cart-qty-value">${item.cantidad}</span>
                <button type="button" class="cart-qty-btn" onclick="actualizarCantidadCarrito(${item.id}, 1)" aria-label="Aumentar una unidad de ${item.nombre}">+</button>
              </div>

              <div class="cart-item-subtotal">
                Subtotal: <strong>${typeof window.formatearPrecioCOP === "function" ? window.formatearPrecioCOP(item.precio * item.cantidad) : `$ ${(item.precio * item.cantidad).toLocaleString("es-CO")} COP`}</strong>
              </div>

              <button type="button" class="cart-item-remove-btn" onclick="eliminarDelCarrito(${item.id})" aria-label="Eliminar ${item.nombre} del carrito">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  // Pie con Totales y Botón de WhatsApp
  const totalFormateado = typeof window.formatearPrecioCOP === "function" 
    ? window.formatearPrecioCOP(total) 
    : `$ ${total.toLocaleString("es-CO")} COP`;

  footerContainer.innerHTML = `
    <div class="cart-summary-box">
      <div class="cart-summary-row">
        <span>Total de artículos:</span>
        <strong>${articulos} unidad(es)</strong>
      </div>
      <div class="cart-summary-row cart-total-row">
        <span>Total estimado:</span>
        <span class="cart-total-amount">${totalFormateado}</span>
      </div>
      <p class="text-xs text-muted" style="margin: 0.5rem 0 1rem; line-height: 1.3;">
        * Precios referenciales informativos para Colombia. El valor del envío se confirma según tu municipio o ciudad.
      </p>

      <div class="flex gap-2" style="flex-direction: column;">
        <button type="button" class="btn btn-whatsapp btn-block btn-lg" onclick="finalizarPedidoWhatsApp()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
          </svg>
          Finalizar pedido por WhatsApp
        </button>

        <button type="button" class="btn btn-ghost btn-sm btn-block" onclick="vaciarCarrito()" style="color: var(--color-error);">
          <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Vaciar carrito
        </button>
      </div>
    </div>
  `;
}

/**
 * Prepara el mensaje de compra estructurado y abre WhatsApp
 */
function finalizarPedidoWhatsApp() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return;

  const { articulos, total } = calcularTotalesCarrito(carrito);
  const totalFormateado = typeof window.formatearPrecioCOP === "function" 
    ? window.formatearPrecioCOP(total) 
    : `$ ${total.toLocaleString("es-CO")} COP`;

  let mensaje = `Hola ${window.WHATSAPP_CONFIG?.businessName || "TecnoFix Colombia"}, deseo realizar el siguiente pedido desde el carrito de compras de su tienda web:\n\n` +
    `🛒 *DETALLE DEL PEDIDO (${articulos} productos):*\n`;

  carrito.forEach((item, index) => {
    const subtotalItem = typeof window.formatearPrecioCOP === "function" 
      ? window.formatearPrecioCOP(item.precio * item.cantidad) 
      : `$ ${(item.precio * item.cantidad).toLocaleString("es-CO")} COP`;
    
    mensaje += `\n${index + 1}. *${item.nombre}*` +
      `\n   • Cantidad: ${item.cantidad} unidad(es)` +
      `\n   • Subtotal: ${subtotalItem}\n`;
  });

  mensaje += `\n💰 *TOTAL ESTIMADO:* ${totalFormateado}\n\n` +
    `¿Me pueden confirmar disponibilidad inmediata de estos productos y el costo del despacho hasta mi ubicación?`;

  if (typeof window.contactarWhatsApp === "function") {
    window.contactarWhatsApp(mensaje);
  }
}

// Inicialización automática
document.addEventListener("DOMContentLoaded", () => {
  asegurarDrawerCarrito();
  actualizarBadgeCarrito();

  // Escuchar botones de apertura de carrito
  document.querySelectorAll(".btn-open-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      abrirCarrito();
    });
  });
});

// Exponer en el objeto global
window.obtenerCarrito = obtenerCarrito;
window.guardarCarrito = guardarCarrito;
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCantidadCarrito = actualizarCantidadCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.actualizarBadgeCarrito = actualizarBadgeCarrito;
window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.finalizarPedidoWhatsApp = finalizarPedidoWhatsApp;
