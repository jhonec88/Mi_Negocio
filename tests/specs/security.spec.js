/**
 * ==========================================================================
 * TESTS: Módulo de Seguridad y Sanitización Defensiva (security.js)
 * ==========================================================================
 */

describe("Módulo de Seguridad Defensiva (Security)", () => {
  it("Security debe estar definido y congelado (Object.isFrozen)", () => {
    expect(window.Security).toBeDefined();
    expect(Object.isFrozen(window.Security)).toBe(true, "El objeto Security debe ser inmutable");
  });

  describe("Security.escapeHTML()", () => {
    it("debe escapar caracteres peligrosos para prevenir XSS", () => {
      const malicious = '<script>alert("XSS")</script>';
      const escaped = window.Security.escapeHTML(malicious);
      expect(escaped).toBe("&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;");
    });

    it("debe escapar comillas simples, dobles y ampersands", () => {
      const input = `Tom & 'Jerry' "Show" / \``;
      const escaped = window.Security.escapeHTML(input);
      expect(escaped.includes("&amp;")).toBe(true);
      expect(escaped.includes("&quot;")).toBe(true);
      expect(escaped.includes("&#x27;")).toBe(true);
      expect(escaped.includes("&#x2F;")).toBe(true);
      expect(escaped.includes("&#x60;")).toBe(true);
    });

    it("debe manejar valores nulos, indefinidos y números", () => {
      expect(window.Security.escapeHTML(null)).toBe("");
      expect(window.Security.escapeHTML(undefined)).toBe("");
      expect(window.Security.escapeHTML(145000)).toBe("145000");
    });
  });

  describe("Security.sanitizeText()", () => {
    it("debe eliminar etiquetas HTML completas", () => {
      const dirty = "<p>Hola <b>Mundo</b></p>";
      const clean = window.Security.sanitizeText(dirty);
      expect(clean).toBe("Hola Mundo");
    });

    it("debe eliminar bytes nulos y caracteres de control invisibles", () => {
      const controlChars = "Hola\u0000\u0008Mundo\u001F!";
      const clean = window.Security.sanitizeText(controlChars);
      expect(clean).toBe("HolaMundo!");
    });

    it("debe respetar la longitud máxima especificada", () => {
      const longText = "a".repeat(150);
      const clean = window.Security.sanitizeText(longText, 50);
      expect(clean.length).toBe(50);
    });
  });

  describe("Security.sanitizeUrl()", () => {
    it("debe permitir rutas relativas seguras locales", () => {
      const path1 = "assets/images/productos/ssd-kingston.jpg";
      const path2 = "./assets/css/variables.css";
      const path3 = "/servicios.html";
      expect(window.Security.sanitizeUrl(path1)).toBe(path1);
      expect(window.Security.sanitizeUrl(path2)).toBe(path2);
      expect(window.Security.sanitizeUrl(path3)).toBe(path3);
    });

    it("debe permitir URLs absolutas https y http seguras", () => {
      const httpsUrl = "https://wa.me/573001234567";
      const httpUrl = "http://localhost:8000/index.html";
      expect(window.Security.sanitizeUrl(httpsUrl)).toBe(httpsUrl);
      expect(window.Security.sanitizeUrl(httpUrl)).toBe(httpUrl);
    });

    it("debe bloquear protocolos peligrosos (javascript:, data:, vbscript:)", () => {
      expect(window.Security.sanitizeUrl("javascript:alert(1)")).toBeNull();
      expect(window.Security.sanitizeUrl("JAVASCRIPT:void(0)")).toBeNull();
      expect(window.Security.sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
      expect(window.Security.sanitizeUrl("vbscript:msgbox(1)")).toBeNull();
    });

    it("debe bloquear inyecciones con comillas y caracteres nulos en rutas relativas", () => {
      expect(window.Security.sanitizeUrl('assets/img.jpg" onerror="alert(1)')).toBeNull();
      expect(window.Security.sanitizeUrl("assets/img.jpg\u0000")).toBeNull();
    });
  });

  describe("Security.checkRateLimit() y getRemainingCooldown()", () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it("debe permitir la primera acción y bloquear acciones inmediatas subsecuentes", () => {
      const action = "test_action";
      const cooldown = 5;
      const allowedFirst = window.Security.checkRateLimit(action, cooldown);
      expect(allowedFirst).toBe(true, "Primera acción debe estar permitida");

      const allowedSecond = window.Security.checkRateLimit(action, cooldown);
      expect(allowedSecond).toBe(false, "Segunda acción inmediata debe ser bloqueada por rate limit");

      const remaining = window.Security.getRemainingCooldown(action, cooldown);
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThan(cooldown + 1);
    });
  });

  describe("Security.validateCartData()", () => {
    const catalogoEjemplo = [
      { id: 1, nombre: "SSD Kingston", precio: 145000, imagen: "assets/img1.jpg", marca: "Kingston", categoria: "SSD" },
      { id: 2, nombre: "RAM Fury", precio: 95000, imagen: "assets/img2.jpg", marca: "Kingston", categoria: "RAM" }
    ];

    it("debe verificar precios reales contra el catálogo y evitar manipulación de precios", () => {
      const carritoManipulado = [
        { id: 1, nombre: "SSD Kingston", precio: 1, cantidad: 2 } // Intento de hackear precio a $1 COP
      ];
      const validado = window.Security.validateCartData(carritoManipulado, catalogoEjemplo);
      expect(validado.length).toBe(1);
      expect(validado[0].precio).toBe(145000, "El precio debe ser restaurado al catálogo oficial");
      expect(validado[0].cantidad).toBe(2);
    });

    it("debe descartar productos con IDs inexistentes en el catálogo", () => {
      const carritoInvalido = [
        { id: 9999, nombre: "Producto Fantasma", precio: 5000, cantidad: 1 }
      ];
      const validado = window.Security.validateCartData(carritoInvalido, catalogoEjemplo);
      expect(validado.length).toBe(0, "Productos fantasmas deben ser descartados");
    });

    it("debe acotar cantidades mayores a 99 unidades para prevenir desbordamientos", () => {
      const carritoAbusivo = [
        { id: 1, nombre: "SSD Kingston", precio: 145000, cantidad: 999999 }
      ];
      const validado = window.Security.validateCartData(carritoAbusivo, catalogoEjemplo);
      expect(validado[0].cantidad).toBe(99, "La cantidad debe acotarse al máximo de 99 unidades");
    });

    it("debe descartar items con IDs negativos o cantidades cero / negativas", () => {
      const datosCorruptos = [
        { id: -1, cantidad: 5 },
        { id: "abc", cantidad: 2 },
        { id: 1, cantidad: 0 },
        { id: 2, cantidad: -4 }
      ];
      const validado = window.Security.validateCartData(datosCorruptos, catalogoEjemplo);
      expect(validado.length).toBe(0);
    });
  });
});
