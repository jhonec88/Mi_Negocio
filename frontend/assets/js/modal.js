/**
 * ==========================================================================
 * GESTOR DE MODALES ACCESIBLES (WCAG 2.2 AA)
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

let elementoPrevioFoco = null;
let modalActivo = null;

/**
 * Inicializa el contenedor del modal si no existe en el DOM
 */
function asegurarContenedorModal() {
  let modalBackdrop = document.getElementById("accessible-modal");
  if (!modalBackdrop) {
    modalBackdrop = document.createElement("div");
    modalBackdrop.id = "accessible-modal";
    modalBackdrop.className = "modal-backdrop";
    modalBackdrop.setAttribute("role", "dialog");
    modalBackdrop.setAttribute("aria-modal", "true");
    modalBackdrop.setAttribute("aria-hidden", "true");
    modalBackdrop.setAttribute("tabindex", "-1");

    modalBackdrop.innerHTML = `
      <div class="modal-container" role="document">
        <div class="modal-header">
          <h2 class="modal-title" id="modal-title-text">Detalles</h2>
          <button type="button" class="modal-close-btn" id="modal-close-button" aria-label="Cerrar ventana modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body" id="modal-body-content">
          <!-- Contenido dinámico -->
        </div>
        <div class="modal-footer" id="modal-footer-content">
          <button type="button" class="btn btn-outline" id="modal-btn-cancelar">Cerrar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    // Eventos de cierre
    const btnCerrar = modalBackdrop.querySelector("#modal-close-button");
    const btnCancelar = modalBackdrop.querySelector("#modal-btn-cancelar");

    if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);
    if (btnCancelar) btnCancelar.addEventListener("click", cerrarModal);

    // Cierre al pulsar sobre el fondo oscurecido
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        cerrarModal();
      }
    });

    // Control de teclado accesible
    modalBackdrop.addEventListener("keydown", gestionarTecladoModal);
  }
  return modalBackdrop;
}

/**
 * Abre un modal accesible y carga contenido de forma dinámica
 * @param {string} titulo - Título de la cabecera
 * @param {string} contenidoHtml - HTML del cuerpo del modal
 * @param {string} [footerHtml] - HTML opcional de acciones
 */
function abrirModal(titulo, contenidoHtml, footerHtml = "") {
  const modalBackdrop = asegurarContenedorModal();
  
  // Guardar el elemento con foco activo para restaurarlo al cerrar (WCAG 2.2)
  elementoPrevioFoco = document.activeElement;

  // Actualizar contenido
  const tituloEl = modalBackdrop.querySelector("#modal-title-text");
  const cuerpoEl = modalBackdrop.querySelector("#modal-body-content");
  const footerEl = modalBackdrop.querySelector("#modal-footer-content");

  if (tituloEl) tituloEl.textContent = titulo;
  if (cuerpoEl) cuerpoEl.innerHTML = contenidoHtml;
  if (footerHtml && footerEl) {
    footerEl.innerHTML = footerHtml;
  } else if (footerEl) {
    footerEl.innerHTML = `<button type="button" class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>`;
  }

  // Activar modal
  modalBackdrop.classList.add("is-open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Evita scroll de fondo
  modalActivo = modalBackdrop;

  // Enfocar el botón de cerrar o primer elemento enfocable
  setTimeout(() => {
    const primerEnfocable = modalBackdrop.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (primerEnfocable) {
      primerEnfocable.focus();
    } else {
      modalBackdrop.focus();
    }
  }, 50);
}

/**
 * Cierra el modal activo y devuelve el foco
 */
function cerrarModal() {
  const modalBackdrop = document.getElementById("accessible-modal");
  if (!modalBackdrop || !modalBackdrop.classList.contains("is-open")) return;

  modalBackdrop.classList.remove("is-open");
  modalBackdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalActivo = null;

  // Restaurar foco al elemento que activó el modal
  if (elementoPrevioFoco && typeof elementoPrevioFoco.focus === "function") {
    elementoPrevioFoco.focus();
  }
}

/**
 * Trampa de foco y manejo de tecla Escape (WCAG 2.2)
 */
function gestionarTecladoModal(e) {
  if (e.key === "Escape" || e.keyCode === 27) {
    e.preventDefault();
    cerrarModal();
    return;
  }

  if (e.key === "Tab" || e.keyCode === 9) {
    const modalBackdrop = document.getElementById("accessible-modal");
    if (!modalBackdrop) return;

    const elementosEnfocables = modalBackdrop.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (elementosEnfocables.length === 0) return;

    const primerElemento = elementosEnfocables[0];
    const ultimoElemento = elementosEnfocables[elementosEnfocables.length - 1];

    if (e.shiftKey) {
      // Shift + Tab hacia atrás
      if (document.activeElement === primerElemento) {
        e.preventDefault();
        ultimoElemento.focus();
      }
    } else {
      // Tab hacia adelante
      if (document.activeElement === ultimoElemento) {
        e.preventDefault();
        primerElemento.focus();
      }
    }
  }
}

// Inicializar al cargar el DOM
document.addEventListener("DOMContentLoaded", asegurarContenedorModal);

// Exponer en el objeto global
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
