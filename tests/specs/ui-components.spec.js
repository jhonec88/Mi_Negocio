/**
 * ==========================================================================
 * TESTS: Componentes de Interfaz de Usuario (Modal, Tema, FAQ, Diagnóstico)
 * ==========================================================================
 */

describe("Componentes de UI y Experiencia de Usuario", () => {
  describe("Gestor de Modales Accesibles (modal.js)", () => {
    afterEach(() => {
      window.cerrarModal();
    });

    it("abrirModal debe crear o reutilizar el contenedor y colocar foco accesible", () => {
      window.abrirModal("Prueba Modal", "<p id='modal-test-p'>Contenido de prueba</p>");
      const modal = document.getElementById("accessible-modal");
      expect(modal).toBeDefined();
      expect(modal.classList.contains("is-open")).toBe(true);
      expect(modal.getAttribute("aria-hidden")).toBe("false");
      expect(modal.querySelector("#modal-title-text").textContent).toBe("Prueba Modal");
      expect(modal.querySelector("#modal-test-p")).toBeDefined();
    });

    it("cerrarModal debe remover la clase is-open y restaurar aria-hidden='true'", () => {
      window.abrirModal("Titulo", "<p>Cuerpo</p>");
      window.cerrarModal();
      const modal = document.getElementById("accessible-modal");
      expect(modal.classList.contains("is-open")).toBe(false);
      expect(modal.getAttribute("aria-hidden")).toBe("true");
    });
  });

  describe("Alternador de Tema Claro / Oscuro (menu.js)", () => {
    it("aplicarTema debe establecer data-theme en el elemento html", () => {
      window.aplicarTema("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

      window.aplicarTema("light");
      expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    });
  });

  describe("Diagnóstico Orientativo Interactivo (servicios.js)", () => {
    let mockContainer;

    beforeEach(() => {
      mockContainer = document.createElement("div");
      mockContainer.id = "resultado-diagnostico";
      document.body.appendChild(mockContainer);
    });

    afterEach(() => {
      mockContainer.remove();
    });

    it("ejecutarDiagnostico debe renderizar la causa probable y solución orientativa", () => {
      window.ejecutarDiagnostico("lento");
      expect(mockContainer.innerHTML.includes("Computador lento o demorado al iniciar")).toBe(true);
      expect(mockContainer.innerHTML.includes("disco de estado sólido SSD")).toBe(true);
    });

    it("ejecutarDiagnostico para sobrecalentamiento debe sugerir Mantenimiento Preventivo", () => {
      window.ejecutarDiagnostico("calienta");
      expect(mockContainer.innerHTML.includes("Se calienta mucho o ventiladores ruidosos")).toBe(true);
      expect(mockContainer.innerHTML.includes("Mantenimiento Preventivo")).toBe(true);
    });
  });

  describe("Acordeón de Preguntas Frecuentes (faq.js)", () => {
    let accordionContainer, triggerBtn, contentDiv;

    beforeEach(() => {
      accordionContainer = document.createElement("div");
      accordionContainer.id = "faq-accordion";
      accordionContainer.innerHTML = `
        <div class="accordion-item">
          <button type="button" class="accordion-trigger" aria-expanded="false" id="test-faq-btn">
            ¿Cuánto demora un diagnóstico?
          </button>
          <div class="accordion-content" hidden id="test-faq-content">
            Nuestro diagnóstico toma entre 24 y 48 horas hábiles.
          </div>
        </div>
      `;
      document.body.appendChild(accordionContainer);
      triggerBtn = accordionContainer.querySelector("#test-faq-btn");
      contentDiv = accordionContainer.querySelector("#test-faq-content");
    });

    afterEach(() => {
      accordionContainer.remove();
    });

    it("alternarItemFAQ debe abrir el acordeón y actualizar aria-expanded='true'", () => {
      window.alternarItemFAQ(triggerBtn);
      expect(triggerBtn.getAttribute("aria-expanded")).toBe("true");
      expect(contentDiv.hidden).toBe(false);

      // Segundo clic debe cerrarlo
      window.alternarItemFAQ(triggerBtn);
      expect(triggerBtn.getAttribute("aria-expanded")).toBe("false");
      expect(contentDiv.hidden).toBe(true);
    });
  });
});
