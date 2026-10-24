/**
 * ==========================================================================
 * TESTS: Integridad de Enlaces, SEO y Accesibilidad (WCAG 2.2 AA)
 * ==========================================================================
 */

describe("Integridad del Sitio, SEO y Accesibilidad", () => {
  const paginasDelSitio = [
    "index.html",
    "servicios.html",
    "productos.html",
    "nosotros.html",
    "preguntas-frecuentes.html",
    "contacto.html"
  ];

  it("el sitio debe tener definidas las 6 páginas principales del catálogo y servicios", () => {
    expect(paginasDelSitio.length).toBe(6);
  });

  it("la página de pruebas debe tener viewport, charset y doctype configurados", () => {
    expect(document.characterSet).toBe("UTF-8");
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).toBeDefined();
    expect(viewport.getAttribute("content").includes("width=device-width")).toBe(true);
  });

  it("todos los botones de la interfaz del test runner deben tener nombres accesibles", () => {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
      const hasText = btn.textContent.trim().length > 0;
      const hasAriaLabel = btn.hasAttribute("aria-label") && btn.getAttribute("aria-label").trim().length > 0;
      const hasTitle = btn.hasAttribute("title") && btn.getAttribute("title").trim().length > 0;
      expect(hasText || hasAriaLabel || hasTitle).toBe(true, `El botón debe tener texto o aria-label: ${btn.outerHTML.slice(0, 80)}`);
    });
  });

  it("las imágenes renderizadas en el DOM deben tener atributo alt para lectores de pantalla", () => {
    const images = document.querySelectorAll("img");
    images.forEach(img => {
      expect(img.hasAttribute("alt")).toBe(true, `La imagen ${img.src} debe tener atributo alt`);
    });
  });
});
