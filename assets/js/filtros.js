/**
 * ==========================================================================
 * SISTEMA DE BÚSQUEDA, FILTROS Y ORDENAMIENTO DE CATÁLOGO (CLIENT-SIDE)
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

const estadoFiltros = {
  texto: "",
  categoria: "todas",
  marca: "todas",
  disponibilidad: "todas",
  precioMin: 0,
  precioMax: 5000000,
  orden: "relevancia"
};

/**
 * Aplica los filtros sobre la colección de productos y dispara la renderización
 */
function aplicarFiltros() {
  if (!window.PRODUCTOS_DATA || !Array.isArray(window.PRODUCTOS_DATA)) return;

  let filtrados = window.PRODUCTOS_DATA.filter(p => {
    // 1. Filtro de búsqueda por texto (nombre, marca, categoría o descripción)
    if (estadoFiltros.texto) {
      const q = estadoFiltros.texto.toLowerCase().trim();
      const coincide = 
        p.nombre.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q);
      if (!coincide) return false;
    }

    // 2. Filtro de categoría
    if (estadoFiltros.categoria !== "todas" && p.categoria !== estadoFiltros.categoria) {
      return false;
    }

    // 3. Filtro de marca
    if (estadoFiltros.marca !== "todas" && p.marca.toLowerCase() !== estadoFiltros.marca.toLowerCase()) {
      return false;
    }

    // 4. Filtro de disponibilidad
    if (estadoFiltros.disponibilidad !== "todas" && p.disponible !== estadoFiltros.disponibilidad) {
      return false;
    }

    // 5. Filtro por rango de precio
    if (p.precio < estadoFiltros.precioMin || p.precio > estadoFiltros.precioMax) {
      return false;
    }

    return true;
  });

  // 6. Ordenamiento nativo de JavaScript
  switch (estadoFiltros.orden) {
    case "precio-asc":
      filtrados.sort((a, b) => a.precio - b.precio);
      break;
    case "precio-desc":
      filtrados.sort((a, b) => b.precio - a.precio);
      break;
    case "nombre-asc":
      filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
      break;
    case "nombre-desc":
      filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
      break;
    default:
      // Relevancia o destacados primero
      filtrados.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  }

  // Actualizar contador
  const contadorEl = document.getElementById("conteo-productos");
  if (contadorEl) {
    contadorEl.textContent = `Mostrando ${filtrados.length} de ${window.PRODUCTOS_DATA.length} productos`;
  }

  // Renderizar resultados en el contenedor
  if (typeof window.renderizarProductos === "function") {
    window.renderizarProductos(filtrados, "productos-grid-container");
  }
}

/**
 * Restablece todos los filtros a sus valores predeterminados
 */
function resetearFiltros() {
  estadoFiltros.texto = "";
  estadoFiltros.categoria = "todas";
  estadoFiltros.marca = "todas";
  estadoFiltros.disponibilidad = "todas";
  estadoFiltros.precioMin = 0;
  estadoFiltros.precioMax = 5000000;
  estadoFiltros.orden = "relevancia";

  // Sincronizar controles en el DOM si existen
  const searchInput = document.getElementById("search-input");
  const catSelect = document.getElementById("filter-categoria");
  const brandSelect = document.getElementById("filter-marca");
  const stockSelect = document.getElementById("filter-stock");
  const sortSelect = document.getElementById("sort-select");
  const priceRange = document.getElementById("price-range");
  const priceValue = document.getElementById("price-range-value");

  if (searchInput) searchInput.value = "";
  if (catSelect) catSelect.value = "todas";
  if (brandSelect) brandSelect.value = "todas";
  if (stockSelect) stockSelect.value = "todas";
  if (sortSelect) sortSelect.value = "relevancia";
  if (priceRange) priceRange.value = 5000000;
  if (priceValue) priceValue.textContent = "$ 5.000.000 COP";

  // Desmarcar pastillas de categorías si se usan
  document.querySelectorAll(".category-pill").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.category === "todas");
  });

  aplicarFiltros();
}

/**
 * Vincula los escuchadores de eventos para los filtros
 */
function inicializarFiltros() {
  const searchInput = document.getElementById("search-input");
  const catSelect = document.getElementById("filter-categoria");
  const brandSelect = document.getElementById("filter-marca");
  const stockSelect = document.getElementById("filter-stock");
  const sortSelect = document.getElementById("sort-select");
  const priceRange = document.getElementById("price-range");
  const priceValue = document.getElementById("price-range-value");
  const resetBtn = document.getElementById("btn-reset-filters");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      estadoFiltros.texto = e.target.value;
      aplicarFiltros();
    });
  }

  if (catSelect) {
    catSelect.addEventListener("change", (e) => {
      estadoFiltros.categoria = e.target.value;
      aplicarFiltros();
    });
  }

  // Soporte para pastillas de categorías interactivas
  document.querySelectorAll(".category-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      estadoFiltros.categoria = pill.dataset.category || "todas";
      if (catSelect) catSelect.value = estadoFiltros.categoria;
      aplicarFiltros();
    });
  });

  if (brandSelect) {
    brandSelect.addEventListener("change", (e) => {
      estadoFiltros.marca = e.target.value;
      aplicarFiltros();
    });
  }

  if (stockSelect) {
    stockSelect.addEventListener("change", (e) => {
      estadoFiltros.disponibilidad = e.target.value;
      aplicarFiltros();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      estadoFiltros.orden = e.target.value;
      aplicarFiltros();
    });
  }

  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      estadoFiltros.precioMax = Number(e.target.value);
      if (priceValue) {
        priceValue.textContent = `$ ${Number(e.target.value).toLocaleString("es-CO")} COP`;
      }
      aplicarFiltros();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetearFiltros);
  }
}

// Exponer en el objeto global
window.estadoFiltros = estadoFiltros;
window.aplicarFiltros = aplicarFiltros;
window.resetearFiltros = resetearFiltros;
window.inicializarFiltros = inicializarFiltros;
