/**
 * ==========================================================================
 * TESTS: Módulo de Búsqueda, Filtros y Ordenamiento (filtros.js)
 * ==========================================================================
 */

describe("Módulo de Catálogo y Filtros (filtros.js)", () => {
  beforeEach(() => {
    window.resetearFiltros();
  });

  it("estadoFiltros debe tener los valores iniciales por defecto", () => {
    expect(window.estadoFiltros.texto).toBe("");
    expect(window.estadoFiltros.categoria).toBe("todas");
    expect(window.estadoFiltros.marca).toBe("todas");
    expect(window.estadoFiltros.disponibilidad).toBe("todas");
    expect(window.estadoFiltros.orden).toBe("relevancia");
  });

  it("debe filtrar correctamente por texto de búsqueda en nombre, marca o descripción", () => {
    let capturados = [];
    window.renderizarProductos = (prods) => { capturados = prods; };

    window.estadoFiltros.texto = "Kingston";
    window.aplicarFiltros();

    expect(capturados.length).toBeGreaterThan(0);
    capturados.forEach(p => {
      const coincide = 
        p.nombre.toLowerCase().includes("kingston") ||
        p.marca.toLowerCase().includes("kingston") ||
        p.descripcion.toLowerCase().includes("kingston");
      expect(coincide).toBe(true, `El producto ${p.nombre} debe contener 'Kingston'`);
    });
  });

  it("debe filtrar correctamente por categoría exacta", () => {
    let capturados = [];
    window.renderizarProductos = (prods) => { capturados = prods; };

    window.estadoFiltros.categoria = "SSD y almacenamiento";
    window.aplicarFiltros();

    expect(capturados.length).toBeGreaterThan(0);
    capturados.forEach(p => {
      expect(p.categoria).toBe("SSD y almacenamiento");
    });
  });

  it("debe filtrar correctamente por rango de precios", () => {
    let capturados = [];
    window.renderizarProductos = (prods) => { capturados = prods; };

    window.estadoFiltros.precioMin = 100000;
    window.estadoFiltros.precioMax = 300000;
    window.aplicarFiltros();

    expect(capturados.length).toBeGreaterThan(0);
    capturados.forEach(p => {
      expect(p.precio).toBeGreaterThanOrEqual(100000);
      expect(p.precio).toBeLessThan(300001);
    });
  });

  it("debe ordenar productos por precio ascendente (menor a mayor)", () => {
    let capturados = [];
    window.renderizarProductos = (prods) => { capturados = prods; };

    window.estadoFiltros.orden = "precio-asc";
    window.aplicarFiltros();

    for (let i = 0; i < capturados.length - 1; i++) {
      expect(capturados[i].precio <= capturados[i + 1].precio).toBe(true, "El precio en i debe ser <= que en i+1");
    }
  });

  it("debe ordenar productos por precio descendente (mayor a menor)", () => {
    let capturados = [];
    window.renderizarProductos = (prods) => { capturados = prods; };

    window.estadoFiltros.orden = "precio-desc";
    window.aplicarFiltros();

    for (let i = 0; i < capturados.length - 1; i++) {
      expect(capturados[i].precio >= capturados[i + 1].precio).toBe(true, "El precio en i debe ser >= que en i+1");
    }
  });

  it("debe ordenar alfabéticamente por nombre", () => {
    let capturados = [];
    window.renderizarProductos = (prods) => { capturados = prods; };

    window.estadoFiltros.orden = "nombre-asc";
    window.aplicarFiltros();

    for (let i = 0; i < capturados.length - 1; i++) {
      const cmp = capturados[i].nombre.localeCompare(capturados[i + 1].nombre, "es");
      expect(cmp <= 0).toBe(true, "Los nombres deben estar ordenados alfabéticamente A-Z");
    }
  });

  it("resetearFiltros debe restaurar todos los parámetros a los valores iniciales", () => {
    window.estadoFiltros.texto = "algo";
    window.estadoFiltros.categoria = "SSD y almacenamiento";
    window.estadoFiltros.precioMin = 500000;
    window.estadoFiltros.orden = "precio-desc";

    window.resetearFiltros();

    expect(window.estadoFiltros.texto).toBe("");
    expect(window.estadoFiltros.categoria).toBe("todas");
    expect(window.estadoFiltros.precioMin).toBe(0);
    expect(window.estadoFiltros.orden).toBe("relevancia");
  });
});
