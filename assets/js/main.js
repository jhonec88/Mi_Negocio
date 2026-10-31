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
    // Cargar secciones y banners dinámicos con imagen y texto encima
    cargarSeccionesHome();
    inicializarSincronizacionSeccionesHome();

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
    cargarSeccionesHome();
    inicializarSincronizacionSeccionesHome();
    if (typeof window.inicializarFormularioContacto === "function") {
      window.inicializarFormularioContacto();
    }
  }

  // --- Página de Nosotros (nosotros.html) ---
  if (pagina === "nosotros.html") {
    cargarSeccionesHome();
    inicializarSincronizacionSeccionesHome();
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


/**
 * --------------------------------------------------------------------------
 * SECCIONES DINÁMICAS DE LA PÁGINA PRINCIPAL (IMÁGENES + TEXTO ENCIMA)
 * --------------------------------------------------------------------------
 */
async function cargarSeccionesHome() {
  const archivoActual = window.location.pathname.split("/").pop() || "index.html";
  let paginaKey = "inicio";
  let wrapperId = "secciones-dinamicas-home";
  let gridId = "home-banners-grid";

  if (archivoActual === "nosotros.html") {
    paginaKey = "nosotros";
    wrapperId = "secciones-dinamicas-nosotros";
    gridId = "nosotros-banners-grid";
  } else if (archivoActual === "contacto.html") {
    paginaKey = "contacto";
    wrapperId = "secciones-dinamicas-contacto";
    gridId = "contacto-banners-grid";
  }

  const wrapper = document.getElementById(wrapperId);
  const grid = document.getElementById(gridId);

  try {
    const response = await fetch(`/api/secciones-home?admin=true&pagina=${paginaKey}&t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;

    const data = await response.json();
    const todasLasSecciones = Array.isArray(data.secciones) ? data.secciones : [];

    const escapeStr = (str) => {
      if (typeof window.sanitizarTexto === "function") return window.sanitizarTexto(str);
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    };

    const renderCustomOverlayBanner = (containerEl, sec, afterSelector) => {
      let customBanner = containerEl.querySelector(".section-custom-uploaded-banner");
      if (sec.imagen && sec.imagen.includes("uploads/")) {
        const pos = ["izquierda", "centro", "derecha"].includes(sec.posicion_texto) ? sec.posicion_texto : "centro";
        if (!customBanner) {
          customBanner = document.createElement("div");
          customBanner.className = "section-custom-uploaded-banner";
          customBanner.style.marginTop = "1.5rem";
          customBanner.style.marginBottom = "1.5rem";
          const refEl = afterSelector ? containerEl.querySelector(afterSelector) : null;
          if (refEl) {
            refEl.insertAdjacentElement("afterend", customBanner);
          } else {
            containerEl.prepend(customBanner);
          }
        }
        customBanner.innerHTML = `
          <article class="home-banner-card">
            <img src="${escapeStr(sec.imagen)}" alt="${escapeStr(sec.titulo)}" class="home-banner-bg" loading="lazy">
            <div class="home-banner-overlay pos-${pos}">
              <div class="home-banner-content">
                ${sec.subtitulo ? `<span class="home-banner-tag">${escapeStr(sec.subtitulo)}</span>` : ""}
                <h3 class="home-banner-title">${escapeStr(sec.titulo)}</h3>
                <p class="home-banner-desc">${escapeStr(sec.descripcion)}</p>
              </div>
            </div>
          </article>
        `;
      } else if (customBanner) {
        customBanner.remove();
      }
    };

    // 1. Evaluar todas las secciones existentes en el HTML actual ([data-home-section])
    const mapaExistentes = new Map();
    todasLasSecciones.forEach(s => {
      if (s.clave_seccion) mapaExistentes.set(s.clave_seccion, s);
    });

    document.querySelectorAll("[data-home-section]").forEach(sectionEl => {
      const clave = sectionEl.getAttribute("data-home-section");
      const sec = mapaExistentes.get(clave);

      // Si fue eliminada desde la Consola Administrativa o desactivada, ocultarla del frontend
      if (!sec || !sec.activo) {
        sectionEl.style.display = "none";
        return;
      }
      sectionEl.style.display = "";

      if (clave === "hero") {
        const tagSpan = sectionEl.querySelector(".section-tag span");
        if (tagSpan && sec.subtitulo !== undefined) tagSpan.textContent = sec.subtitulo;

        const h1 = sectionEl.querySelector("h1");
        if (h1 && sec.titulo) h1.textContent = sec.titulo;

        const descP = sectionEl.querySelector("h1 + p");
        if (descP && sec.descripcion) descP.textContent = sec.descripcion;

        const primaryBtn = sectionEl.querySelector(".hero-actions a.btn-primary");
        if (primaryBtn && sec.texto_boton) {
          if (sec.enlace_boton) primaryBtn.setAttribute("href", sec.enlace_boton);
          const svg = primaryBtn.querySelector("svg");
          primaryBtn.textContent = " " + sec.texto_boton;
          if (svg) primaryBtn.prepend(svg);
        }

        const heroImg = sectionEl.querySelector("img");
        if (heroImg && sec.imagen) {
          heroImg.src = sec.imagen.endsWith(".svg") ? `${sec.imagen}?v=2` : sec.imagen;
          heroImg.alt = sec.titulo || heroImg.alt;
        }
      } else if (clave === "antes_despues" || clave === "nosotros_galeria") {
        const tagEl = sectionEl.querySelector(".section-tag");
        if (tagEl && sec.subtitulo !== undefined) tagEl.textContent = sec.subtitulo;

        const titleEl = sectionEl.querySelector(".section-title");
        if (titleEl && sec.titulo) titleEl.textContent = sec.titulo;

        const subEl = sectionEl.querySelector(".section-subtitle");
        if (subEl && sec.descripcion) subEl.textContent = sec.descripcion;

        const imgAfter = sectionEl.querySelector(".ba-image-after");
        if (imgAfter && sec.imagen) imgAfter.src = sec.imagen.endsWith(".svg") ? `${sec.imagen}?v=2` : sec.imagen;
      } else if (clave === "cta_final") {
        const h2 = sectionEl.querySelector("h2");
        if (h2 && sec.titulo) h2.textContent = sec.titulo;

        const p = sectionEl.querySelector("p");
        if (p && sec.descripcion) p.textContent = sec.descripcion;

        const outlineBtn = sectionEl.querySelector("a.btn-outline");
        if (outlineBtn && sec.texto_boton) {
          outlineBtn.textContent = sec.texto_boton;
          if (sec.enlace_boton) outlineBtn.setAttribute("href", sec.enlace_boton);
        }

        if (sec.imagen && sec.imagen !== "assets/images/galeria/taller-1.svg") {
          sectionEl.style.backgroundImage = `linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.92) 100%), url('${sec.imagen}')`;
          sectionEl.style.backgroundSize = "cover";
          sectionEl.style.backgroundPosition = "center";
        } else {
          sectionEl.style.backgroundImage = "";
        }
      } else if (clave === "nosotros_cabecera" || clave === "contacto_cabecera") {
        const tagEl = sectionEl.querySelector(".section-tag");
        if (tagEl && sec.subtitulo !== undefined) tagEl.textContent = sec.subtitulo;

        const h1 = sectionEl.querySelector("h1");
        if (h1 && sec.titulo) h1.textContent = sec.titulo;

        const subEl = sectionEl.querySelector(".section-subtitle");
        if (subEl && sec.descripcion) subEl.textContent = sec.descripcion;

        renderCustomOverlayBanner(sectionEl.querySelector(".container") || sectionEl, sec, ".text-center");
      } else if (clave === "nosotros_historia") {
        const tagEl = sectionEl.querySelector(".section-tag");
        if (tagEl && sec.subtitulo !== undefined) tagEl.textContent = sec.subtitulo;

        const h2 = sectionEl.querySelector("h2");
        if (h2 && sec.titulo) h2.textContent = sec.titulo;

        const descP = sectionEl.querySelector(".nosotros-historia-desc") || sectionEl.querySelector("p");
        if (descP && sec.descripcion) descP.textContent = sec.descripcion;

        const outlineBtn = sectionEl.querySelector("a.btn-outline");
        if (outlineBtn && sec.texto_boton) {
          outlineBtn.textContent = sec.texto_boton;
          if (sec.enlace_boton) outlineBtn.setAttribute("href", sec.enlace_boton);
        }

        const img = sectionEl.querySelector("img");
        if (img && sec.imagen) {
          img.src = sec.imagen.endsWith(".svg") ? `${sec.imagen}?v=2` : sec.imagen;
          img.alt = sec.titulo || img.alt;
        }
      } else if (clave === "contacto_datos") {
        const tagEl = sectionEl.querySelector(".section-tag");
        if (tagEl && sec.subtitulo !== undefined) tagEl.textContent = sec.subtitulo;

        const h2 = sectionEl.querySelector("h2");
        if (h2 && sec.titulo) h2.textContent = sec.titulo;

        const descP = sectionEl.querySelector(".contacto-datos-desc") || sectionEl.querySelector("p");
        if (descP && sec.descripcion) descP.textContent = sec.descripcion;

        renderCustomOverlayBanner(sectionEl, sec, ".contacto-datos-desc");
      } else if (clave === "contacto_ubicacion") {
        const titleEl = sectionEl.querySelector(".contacto-ubicacion-titulo");
        if (titleEl && sec.titulo) titleEl.textContent = sec.titulo;

        const addrEl = sectionEl.querySelector("#contacto-info-direccion-geo");
        if (addrEl && sec.subtitulo) addrEl.textContent = sec.subtitulo;

        const descEl = sectionEl.querySelector(".contacto-ubicacion-desc");
        if (descEl && sec.descripcion) descEl.textContent = sec.descripcion;

        renderCustomOverlayBanner(sectionEl, sec, null);
      } else if (clave === "contacto_formulario") {
        const titleEl = sectionEl.querySelector(".contacto-form-titulo") || sectionEl.querySelector("h3");
        if (titleEl && sec.titulo) titleEl.textContent = sec.titulo;

        const descEl = sectionEl.querySelector(".contacto-form-desc") || sectionEl.querySelector("p");
        if (descEl && sec.descripcion) descEl.textContent = sec.descripcion;

        const submitBtn = sectionEl.querySelector("button[type='submit']");
        if (submitBtn && sec.texto_boton) {
          const svg = submitBtn.querySelector("svg");
          submitBtn.textContent = " " + sec.texto_boton;
          if (svg) submitBtn.prepend(svg);
        }

        renderCustomOverlayBanner(sectionEl, sec, ".contacto-form-desc");
      } else {
        // Secciones estándar con .section-header (rutas, diagnostico, servicios_destacados, productos_destacados, valores, aeo_local, nosotros_valores, nosotros_testimonios)
        const tagEl = sectionEl.querySelector(".section-header .section-tag");
        if (tagEl && sec.subtitulo !== undefined) tagEl.textContent = sec.subtitulo;

        const titleEl = sectionEl.querySelector(".section-header .section-title");
        if (titleEl && sec.titulo) titleEl.textContent = sec.titulo;

        const subEl = sectionEl.querySelector(".section-header .section-subtitle");
        if (subEl && sec.descripcion) subEl.textContent = sec.descripcion;

        renderCustomOverlayBanner(sectionEl, sec, ".section-header");
      }
    });

    // 2. Renderizar las secciones nuevas adicionales (creadas con "+ Nueva Sección")
    if (wrapper && grid) {
      const seccionesNuevas = todasLasSecciones.filter(s => !s.clave_seccion && s.activo !== false);
      if (seccionesNuevas.length === 0) {
        wrapper.style.display = "none";
        grid.innerHTML = "";
      } else {
        grid.innerHTML = seccionesNuevas.map(sec => {
          const pos = ["izquierda", "centro", "derecha"].includes(sec.posicion_texto)
            ? sec.posicion_texto
            : "izquierda";
          const imgUrl = sec.imagen || "assets/images/hero/hero-taller.svg";
          const subHtml = sec.subtitulo
            ? `<span class="home-banner-tag">${escapeStr(sec.subtitulo)}</span>`
            : "";
          const btnHtml = sec.texto_boton
            ? `<a href="${escapeStr(sec.enlace_boton || "contacto.html")}" class="btn btn-primary">${escapeStr(sec.texto_boton)}</a>`
            : "";

          return `
            <article class="home-banner-card">
              <img src="${escapeStr(imgUrl)}" alt="${escapeStr(sec.titulo)}" class="home-banner-bg" loading="lazy" onerror="this.src='assets/images/hero/hero-taller.svg'">
              <div class="home-banner-overlay pos-${pos}">
                <div class="home-banner-content">
                  ${subHtml}
                  <h2 class="home-banner-title">${escapeStr(sec.titulo)}</h2>
                  <p class="home-banner-desc">${escapeStr(sec.descripcion)}</p>
                  ${btnHtml}
                </div>
              </div>
            </article>
          `;
        }).join("");
        wrapper.style.display = "block";
      }
    }
  } catch (err) {
    // En modo offline estático mantiene los textos originales del HTML
  }
}

function inicializarSincronizacionSeccionesHome() {
  if (typeof BroadcastChannel !== "undefined") {
    try {
      const canal = new BroadcastChannel("tecnofix_catalog_channel");
      canal.addEventListener("message", (event) => {
        if (event.data && (event.data.type === "secciones-home" || event.data.type === "todos")) {
          cargarSeccionesHome();
        }
      });
    } catch (e) {}
  }

  window.addEventListener("storage", (e) => {
    if (e.key === "tecnofix_catalog_updated") {
      cargarSeccionesHome();
    }
  });

  window.addEventListener("focus", () => {
    cargarSeccionesHome();
  });
}

window.cargarSeccionesHome = cargarSeccionesHome;
