/**
 * ==========================================================================
 * NAVEGACIÓN, MENÚ MÓVIL, TEMA OSCURO Y SCROLL
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

/**
 * Inicializa el menú de navegación móvil y controles de cabecera
 */
function inicializarMenu() {
  const menuBtn = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const header = document.querySelector(".site-header");
  const backToTopBtn = document.getElementById("back-to-top");

  // 1. Control del Menú Móvil
  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
      const estaAbierto = mainNav.classList.contains("is-open");
      if (estaAbierto) {
        cerrarMenuMovil();
      } else {
        abrirMenuMovil();
      }
    });

    // Cerrar al pulsar en cualquier enlace del menú
    mainNav.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        cerrarMenuMovil();
      });
    });

    // Cerrar con la tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mainNav.classList.contains("is-open")) {
        cerrarMenuMovil();
        menuBtn.focus();
      }
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener("click", (e) => {
      if (mainNav.classList.contains("is-open") && !mainNav.contains(e.target) && !menuBtn.contains(e.target)) {
        cerrarMenuMovil();
      }
    });
  }

  function abrirMenuMovil() {
    mainNav.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function cerrarMenuMovil() {
    mainNav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  // 2. Detección y resaltado de la página activa en la navegación
  const enlacesNav = document.querySelectorAll(".nav-link");
  const rutaActual = window.location.pathname.split("/").pop() || "index.html";

  enlacesNav.forEach(link => {
    const linkRuta = link.getAttribute("href")?.split("/").pop() || "";
    if (linkRuta === rutaActual || (rutaActual === "" && linkRuta === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  // 3. Efecto sticky con elevación para el header
  window.addEventListener("scroll", () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // 4. Visibilidad del botón Volver arriba
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 5. Gestión del Tema Claro / Oscuro (RF-15)
  inicializarTemaOscuro();
}

/**
 * Controla el alternador de tema claro/oscuro con almacenamiento en localStorage
 */
function inicializarTemaOscuro() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  
  // Revisar preferencia guardada o preferencia del sistema operativo
  const temaGuardado = localStorage.getItem("tecnofix-theme");
  const preferenciaSistema = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const temaInicial = temaGuardado || preferenciaSistema;

  aplicarTema(temaInicial);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const temaActual = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const nuevoTema = temaActual === "dark" ? "light" : "dark";
      aplicarTema(nuevoTema);
      localStorage.setItem("tecnofix-theme", nuevoTema);
    });
  }
}

/**
 * Aplica el tema al elemento raíz <html> y actualiza iconos
 * @param {"light"|"dark"} tema
 */
function aplicarTema(tema) {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");

  if (tema === "dark") {
    root.setAttribute("data-theme", "dark");
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", "Cambiar a tema claro");
      themeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    }
  } else {
    root.removeAttribute("data-theme");
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", "Cambiar a tema oscuro");
      themeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }
}

// Exponer en el objeto global
window.inicializarMenu = inicializarMenu;
window.aplicarTema = aplicarTema;
