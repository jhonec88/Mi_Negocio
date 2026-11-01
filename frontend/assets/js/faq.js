/**
 * ==========================================================================
 * ACORDEÓN ACCESIBLE DE PREGUNTAS FRECUENTES (FAQ)
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

/**
 * Inicializa el acordeón accesible con soporte para teclado y ARIA
 */
function inicializarAcordeonFAQ() {
  const accordion = document.getElementById("faq-accordion");
  if (!accordion) return;

  const items = accordion.querySelectorAll(".accordion-item");
  const triggers = accordion.querySelectorAll(".accordion-trigger");

  triggers.forEach((trigger, index) => {
    // Evento de clic
    trigger.addEventListener("click", () => {
      alternarItemFAQ(trigger);
    });

    // Accesibilidad por teclado (WCAG 2.2 AA)
    trigger.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (index < triggers.length - 1) {
            triggers[index + 1].focus();
          } else {
            triggers[0].focus();
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (index > 0) {
            triggers[index - 1].focus();
          } else {
            triggers[triggers.length - 1].focus();
          }
          break;

        case "Home":
          e.preventDefault();
          triggers[0].focus();
          break;

        case "End":
          e.preventDefault();
          triggers[triggers.length - 1].focus();
          break;
      }
    });
  });

  // Buscador de preguntas frecuentes si existe el input
  const buscadorFAQ = document.getElementById("faq-search-input");
  if (buscadorFAQ) {
    buscadorFAQ.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      let coincidencias = 0;

      items.forEach(item => {
        const textoPregunta = item.querySelector(".accordion-trigger").textContent.toLowerCase();
        const textoRespuesta = item.querySelector(".accordion-content").textContent.toLowerCase();

        if (textoPregunta.includes(q) || textoRespuesta.includes(q)) {
          item.style.display = "";
          coincidencias++;
        } else {
          item.style.display = "none";
        }
      });

      const sinResultados = document.getElementById("faq-empty-state");
      if (sinResultados) {
        sinResultados.style.display = coincidencias === 0 ? "block" : "none";
      }
    });
  }
}

/**
 * Abre o cierra un ítem del acordeón
 * @param {HTMLElement} trigger - Botón activador
 */
function alternarItemFAQ(trigger) {
  const item = trigger.closest(".accordion-item");
  if (!item) return;

  const estaAbierto = trigger.getAttribute("aria-expanded") === "true";
  const content = item.querySelector(".accordion-content");

  if (estaAbierto) {
    trigger.setAttribute("aria-expanded", "false");
    item.classList.remove("is-active");
    if (content) content.hidden = true;
  } else {
    // Si se desea comportamiento exclusivo (cerrar otros)
    const accordion = item.closest(".accordion");
    if (accordion) {
      accordion.querySelectorAll(".accordion-item").forEach(otroItem => {
        if (otroItem !== item) {
          otroItem.classList.remove("is-active");
          const otroTrigger = otroItem.querySelector(".accordion-trigger");
          const otroContent = otroItem.querySelector(".accordion-content");
          if (otroTrigger) otroTrigger.setAttribute("aria-expanded", "false");
          if (otroContent) otroContent.hidden = true;
        }
      });
    }

    trigger.setAttribute("aria-expanded", "true");
    item.classList.add("is-active");
    if (content) content.hidden = false;
  }
}

// Exponer en el objeto global
window.inicializarAcordeonFAQ = inicializarAcordeonFAQ;
window.alternarItemFAQ = alternarItemFAQ;
