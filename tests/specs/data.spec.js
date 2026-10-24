/**
 * ==========================================================================
 * TESTS: Integridad de Catálogo y Datos de Servicios
 * ==========================================================================
 */

describe("Integridad de Base de Datos y Catálogo (productos-data y servicios)", () => {
  describe("Colección de Productos (PRODUCTOS_DATA)", () => {
    it("debe contener al menos 16 productos tecnológicos", () => {
      expect(Array.isArray(window.PRODUCTOS_DATA)).toBe(true);
      expect(window.PRODUCTOS_DATA.length).toBeGreaterThanOrEqual(16);
    });

    it("todos los productos deben tener IDs numéricos únicos y positivos", () => {
      const ids = new Set();
      window.PRODUCTOS_DATA.forEach(p => {
        expect(typeof p.id).toBe("number");
        expect(p.id).toBeGreaterThan(0);
        expect(ids.has(p.id)).toBe(false, `ID duplicado detectado: ${p.id}`);
        ids.add(p.id);
      });
    });

    it("todos los productos deben tener nombre, precio > 0, marca y categoría válida", () => {
      window.PRODUCTOS_DATA.forEach(p => {
        expect(typeof p.nombre).toBe("string", `Producto ID ${p.id} debe tener nombre`);
        expect(p.nombre.length).toBeGreaterThan(0);
        expect(typeof p.precio).toBe("number", `Producto ${p.nombre} debe tener precio numérico`);
        expect(p.precio).toBeGreaterThan(0, `Producto ${p.nombre} debe tener precio mayor a 0`);
        expect(typeof p.marca).toBe("string");
        expect(typeof p.categoria).toBe("string");
        expect(["disponible", "agotado", "consultar"].includes(p.disponible)).toBe(true);
      });
    });

    it("todos los productos deben tener ruta de imagen válida", () => {
      window.PRODUCTOS_DATA.forEach(p => {
        expect(typeof p.imagen).toBe("string");
        expect(p.imagen.startsWith("assets/images/productos/")).toBe(true, `Ruta de imagen de ${p.nombre} debe apuntar a assets/images/productos/`);
      });
    });

    it("todos los productos deben tener especificaciones técnicas detalladas", () => {
      window.PRODUCTOS_DATA.forEach(p => {
        expect(typeof p.especificaciones).toBe("object");
        expect(Object.keys(p.especificaciones).length).toBeGreaterThan(0, `Producto ${p.nombre} debe tener al menos una especificación técnica`);
      });
    });
  });

  describe("Colección de Servicios Técnicos (SERVICIOS_DATA)", () => {
    it("debe contener los 12 servicios técnicos especializados", () => {
      expect(Array.isArray(window.SERVICIOS_DATA)).toBe(true);
      expect(window.SERVICIOS_DATA.length).toBe(12);
    });

    it("cada servicio técnico debe tener nombre, beneficios, tareas y tiempo estimado", () => {
      window.SERVICIOS_DATA.forEach(s => {
        expect(typeof s.nombre).toBe("string");
        expect(s.nombre.length).toBeGreaterThan(0);
        expect(Array.isArray(s.beneficios)).toBe(true, `Servicio ${s.nombre} debe tener lista de beneficios`);
        expect(s.beneficios.length).toBeGreaterThan(0);
        expect(Array.isArray(s.tareasIncluidas)).toBe(true, `Servicio ${s.nombre} debe tener lista de tareas`);
        expect(s.tareasIncluidas.length).toBeGreaterThan(0);
        expect(typeof s.tiempoEstimado).toBe("string");
        expect(typeof s.precioReferencia).toBe("string");
      });
    });
  });

  describe("Herramienta de Diagnóstico Orientativo (GUIA_DIAGNOSTICO)", () => {
    it("debe contener soluciones para los 6 problemas más frecuentes", () => {
      const problemas = ["lento", "no_enciende", "calienta", "pantalla_azul", "virus", "internet"];
      problemas.forEach(slug => {
        const item = window.GUIA_DIAGNOSTICO[slug];
        expect(item).toBeDefined(`Problema '${slug}' debe existir en GUIA_DIAGNOSTICO`);
        expect(typeof item.titulo).toBe("string");
        expect(typeof item.causa).toBe("string");
        expect(typeof item.solucionRecomendada).toBe("string");
        expect(typeof item.servicioAsociado).toBe("string");
      });
    });
  });
});
