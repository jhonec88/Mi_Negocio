/**
 * ==========================================================================
 * SCRIPT PRINCIPAL Y ORQUESTADOR DE LA APLICACIÓN (MAIN.JS)
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar navegación, menú móvil y tema oscuro
  if (typeof window.inicializarMenu === "function") {
    window.inicializarMenu();
  }

  // 2. Inicializar interactividad de Slider Antes/Después si está presente
  inicializarSlidersAntesDespues();

  // 3. Inicializar componentes específicos según la página activa
  const pagina = window.location.pathname.split("/").pop() || "index.html";

  // --- Página de Inicio (index.html) ---
  if (pagina === "index.html" || pagina === "") {
    // Renderizar servicios destacados (primeros 4)
    if (window.SERVICIOS_DATA && typeof window.renderizarServicios === "function") {
      const destacados = window.SERVICIOS_DATA.filter(s => s.destacado).slice(0, 4);
      window.renderizarServicios(destacados, "servicios-destacados-container");
    }

    // Renderizar productos destacados (primeros 4)
    if (window.PRODUCTOS_DATA && typeof window.renderizarProductos === "function") {
      const destacados = window.PRODUCTOS_DATA.filter(p => p.destacado).slice(0, 4);
      window.renderizarProductos(destacados, "productos-destacados-container");
    }

    // Inicializar botones del diagnóstico en inicio
    inicializarBotonesDiagnostico();
  }

  // --- Página de Servicios (servicios.html) ---
  if (pagina === "servicios.html") {
    if (window.SERVICIOS_DATA && typeof window.renderizarServicios === "function") {
      window.renderizarServicios(window.SERVICIOS_DATA, "todos-servicios-container");
    }

    // Filtros de servicios por categoría
    const botonesFiltroServicio = document.querySelectorAll(".service-filter-btn");
    botonesFiltroServicio.forEach(btn => {
      btn.addEventListener("click", () => {
        botonesFiltroServicio.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const categoria = btn.dataset.category || "todos";

        if (categoria === "todos") {
          window.renderizarServicios(window.SERVICIOS_DATA, "todos-servicios-container");
        } else {
          const filtrados = window.SERVICIOS_DATA.filter(s => s.categoria === categoria);
          window.renderizarServicios(filtrados, "todos-servicios-container");
        }
      });
    });

    inicializarBotonesDiagnostico();
  }

  // --- Página de Catálogo de Productos (productos.html) ---
  if (pagina === "productos.html") {
    if (typeof window.inicializarFiltros === "function") {
      window.inicializarFiltros();
    }
    if (typeof window.aplicarFiltros === "function") {
      window.aplicarFiltros();
    }

    // Inicializar Recomendador de Actualizaciones (RF-24.C) si existe
    inicializarRecomendadorHardware();
  }

  // --- Página de Contacto (contacto.html) ---
  if (pagina === "contacto.html") {
    if (typeof window.inicializarFormularioContacto === "function") {
      window.inicializarFormularioContacto();
    }
  }

  // --- Página de Preguntas Frecuentes (preguntas-frecuentes.html) ---
  if (pagina === "preguntas-frecuentes.html") {
    if (typeof window.inicializarAcordeonFAQ === "function") {
      window.inicializarAcordeonFAQ();
    }
  }
});

/**
 * Inicializa los eventos de botones del Diagnóstico Orientativo
 */
function inicializarBotonesDiagnostico() {
  const botonesDiagnostico = document.querySelectorAll(".diagnostic-btn");
  botonesDiagnostico.forEach(btn => {
    btn.addEventListener("click", () => {
      const problema = btn.dataset.problem;
      if (typeof window.ejecutarDiagnostico === "function") {
        window.ejecutarDiagnostico(problema);
      }
    });
  });

  // Disparar el primer problema por defecto si existe el contenedor
  const primerBtn = document.querySelector(".diagnostic-btn");
  if (primerBtn && document.getElementById("resultado-diagnostico")) {
    primerBtn.click();
  }
}

/**
 * --------------------------------------------------------------------------
 * HERRAMIENTA DIFERENCIAL 2: SLIDER ANTES Y DESPUÉS INTERACTIVO (RF-24.B)
 * --------------------------------------------------------------------------
 */
function inicializarSlidersAntesDespues() {
  const wrappers = document.querySelectorAll(".before-after-wrapper");
  wrappers.forEach(wrapper => {
    const handle = wrapper.querySelector(".ba-slider-handle");
    const imgBefore = wrapper.querySelector(".ba-image-before");

    if (!handle || !imgBefore) return;

    let arrastrando = false;

    function actualizarPosicion(clientX) {
      const rect = wrapper.getBoundingClientRect();
      let posicionX = clientX - rect.left;
      if (posicionX < 0) posicionX = 0;
      if (posicionX > rect.width) posicionX = rect.width;

      const porcentaje = (posicionX / rect.width) * 100;
      handle.style.left = `${porcentaje}%`;
      imgBefore.style.clipPath = `polygon(0 0, ${porcentaje}% 0, ${porcentaje}% 100%, 0 100%)`;
    }

    // Eventos de ratón
    handle.addEventListener("mousedown", () => { arrastrando = true; });
    window.addEventListener("mouseup", () => { arrastrando = false; });
    window.addEventListener("mousemove", (e) => {
      if (!arrastrando) return;
      actualizarPosicion(e.clientX);
    });

    // Eventos táctiles para móviles
    handle.addEventListener("touchstart", () => { arrastrando = true; }, { passive: true });
    window.addEventListener("touchend", () => { arrastrando = false; });
    window.addEventListener("touchmove", (e) => {
      if (!arrastrando || !e.touches[0]) return;
      actualizarPosicion(e.touches[0].clientX);
    }, { passive: true });
  });
}

/**
 * --------------------------------------------------------------------------
 * HERRAMIENTA DIFERENCIAL 3: RECOMENDADOR DE ACTUALIZACIONES (RF-24.C)
 * --------------------------------------------------------------------------
 */
function inicializarRecomendadorHardware() {
  const calcForm = document.getElementById("recommender-form");
  const resultBox = document.getElementById("recommender-result");
  if (!calcForm || !resultBox) return;

  calcForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const equipo = document.getElementById("rec-equipo")?.value || "portatil";
    const uso = document.getElementById("rec-uso")?.value || "oficina";
    const problema = document.getElementById("rec-problema")?.value || "lento";

    let recomendacion = "";
    let beneficio = "";
    let inversionAprox = "";

    if (problema === "lento") {
      recomendacion = "Actualización a Unidad SSD Kingston SATA 480 GB + Limpieza Térmica Preventiva";
      beneficio = "Multiplica la velocidad de arranque hasta 10 veces y elimina la lentitud general sin comprar equipo nuevo.";
      inversionAprox = "$145.000 COP (SSD) + $40.000 COP (Instalación y clonación)";
    } else if (problema === "multitarea") {
      recomendacion = "Ampliación de Memoria RAM a 16 GB Dual Channel + Optimización de Sistema";
      beneficio = "Permite abrir decenas de pestañas de navegador y programas simultáneos sin congelamientos ni demoras.";
      inversionAprox = "$95.000 a $185.000 COP (según tipo de RAM)";
    } else {
      recomendacion = "Combo Óptimo: SSD NVMe / SATA + Duplicar Memoria RAM + Mantenimiento Preventivo";
      beneficio = "Renovación completa de rendimiento, dejando el computador funcionando como salido de fábrica.";
      inversionAprox = "$260.000 a $340.000 COP aproximados";
    }

    resultBox.innerHTML = `
      <div style="background-color: var(--color-bg-card); border: 1px solid var(--color-primary); border-radius: var(--radius-lg); padding: 1.5rem; margin-top: 1.5rem; box-shadow: var(--shadow-md);">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span class="badge badge-category" style="background-color: var(--color-primary-light); color: var(--color-primary);">Propuesta sugerida</span>
        </div>
        <h4 style="font-size: 1.15rem; margin-bottom: 0.5rem;">${recomendacion}</h4>
        <p style="font-size: 0.95rem; margin-bottom: 0.75rem;">${beneficio}</p>
        <div style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 1.25rem;">
          Inversión aproximada: <strong style="color: var(--color-primary);">${inversionAprox}</strong>
        </div>
        <button type="button" class="btn btn-whatsapp btn-sm" onclick="solicitarServicioWhatsApp('Actualización recomendada', '${recomendacion}')">
          Consultar compatibilidad exacta de mi equipo por WhatsApp
        </button>
      </div>
    `;
  });
}

/**
 * Notificación Toast Accesible
 * @param {string} mensaje
 * @param {"success"|"info"|"warning"} tipo
 */
function mostrarToast(mensaje, tipo = "info") {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.setAttribute("role", "status");
  toast.innerHTML = `<span>${mensaje}</span>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

window.mostrarToast = mostrarToast;
