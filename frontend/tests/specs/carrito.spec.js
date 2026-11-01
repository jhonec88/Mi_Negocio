/**
 * ==========================================================================
 * TESTS: Módulo del Carrito de Compras (carrito.js)
 * ==========================================================================
 */

describe("Módulo del Carrito de Compras (Carrito)", () => {
  beforeEach(() => {
    localStorage.removeItem("tecnofix-cart");
    // Mock o reset de badge en DOM
    document.querySelectorAll(".cart-count-badge").forEach(b => b.textContent = "0");
  });

  afterEach(() => {
    localStorage.removeItem("tecnofix-cart");
  });

  it("obtenerCarrito debe devolver un arreglo vacío cuando no hay datos", () => {
    const carrito = window.obtenerCarrito();
    expect(Array.isArray(carrito)).toBe(true);
    expect(carrito.length).toBe(0);
  });

  it("guardarCarrito debe persistir los datos en localStorage", () => {
    const mockItems = [{ id: 1, nombre: "Test", precio: 100000, cantidad: 1 }];
    window.guardarCarrito(mockItems);
    
    const stored = JSON.parse(localStorage.getItem("tecnofix-cart"));
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(1);
  });

  it("calcularTotalesCarrito debe calcular correctamente la suma de artículos y monto en COP", () => {
    const items = [
      { id: 1, precio: 145000, cantidad: 2 }, // 290.000
      { id: 2, precio: 95000, cantidad: 1 },  // 95.000
      { id: 3, precio: 50000, cantidad: 3 }   // 150.000
    ];
    const { articulos, total } = window.calcularTotalesCarrito(items);
    expect(articulos).toBe(6);
    expect(total).toBe(535000);
  });

  it("agregarAlCarrito debe añadir un producto nuevo o incrementar cantidad si ya existe", () => {
    // Tomar primer producto de PRODUCTOS_DATA
    const primerProd = window.PRODUCTOS_DATA[0];
    expect(primerProd).toBeDefined();

    window.agregarAlCarrito(primerProd.id, 1);
    let carrito = window.obtenerCarrito();
    expect(carrito.length).toBe(1);
    expect(carrito[0].id).toBe(primerProd.id);
    expect(carrito[0].cantidad).toBe(1);

    // Agregar de nuevo el mismo producto
    window.agregarAlCarrito(primerProd.id, 2);
    carrito = window.obtenerCarrito();
    expect(carrito.length).toBe(1, "No debe duplicar la fila del producto");
    expect(carrito[0].cantidad).toBe(3);
  });

  it("actualizarCantidadCarrito debe incrementar y decrementar", () => {
    const prod = window.PRODUCTOS_DATA[0];
    window.agregarAlCarrito(prod.id, 2);

    window.actualizarCantidadCarrito(prod.id, 1);
    let carrito = window.obtenerCarrito();
    expect(carrito[0].cantidad).toBe(3);

    window.actualizarCantidadCarrito(prod.id, -1);
    carrito = window.obtenerCarrito();
    expect(carrito[0].cantidad).toBe(2);
  });

  it("actualizarCantidadCarrito debe remover el producto automáticamente si llega a 0", () => {
    const prod = window.PRODUCTOS_DATA[0];
    window.agregarAlCarrito(prod.id, 1);

    window.actualizarCantidadCarrito(prod.id, -1);
    const carrito = window.obtenerCarrito();
    expect(carrito.length).toBe(0, "El producto con cantidad 0 debe eliminarse del carrito");
  });

  it("eliminarDelCarrito debe eliminar un producto específico por su ID", () => {
    const p1 = window.PRODUCTOS_DATA[0];
    const p2 = window.PRODUCTOS_DATA[1];
    window.agregarAlCarrito(p1.id, 1);
    window.agregarAlCarrito(p2.id, 1);

    expect(window.obtenerCarrito().length).toBe(2);

    window.eliminarDelCarrito(p1.id);
    const carrito = window.obtenerCarrito();
    expect(carrito.length).toBe(1);
    expect(carrito[0].id).toBe(p2.id);
  });

  it("asegurarDrawerCarrito debe crear la estructura del Drawer con atributos de accesibilidad ARIA", () => {
    const drawer = window.asegurarDrawerCarrito();
    expect(drawer).toBeDefined();
    expect(drawer.getAttribute("role")).toBe("dialog");
    expect(drawer.getAttribute("aria-modal")).toBe("true");
    expect(drawer.querySelector("#btn-cerrar-cart")).toBeDefined();
    expect(drawer.querySelector("#cart-items-container")).toBeDefined();
  });

  it("abrirCarrito y cerrarCarrito deben alternar la clase is-open y overflow del body", () => {
    window.abrirCarrito();
    const drawer = document.getElementById("cart-drawer-backdrop");
    expect(drawer.classList.contains("is-open")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    window.cerrarCarrito();
    expect(drawer.classList.contains("is-open")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });
});
