/**
 * ==========================================================================
 * TESTS: Módulo de Integración con WhatsApp (whatsapp.js)
 * ==========================================================================
 */

describe("Módulo de Integración con WhatsApp", () => {
  it("WHATSAPP_CONFIG debe tener número y nombre comercial válidos para Colombia", () => {
    expect(window.WHATSAPP_CONFIG).toBeDefined();
    expect(typeof window.WHATSAPP_CONFIG.phone).toBe("string");
    expect(window.WHATSAPP_CONFIG.phone.startsWith("57")).toBe(true, "El teléfono debe tener indicativo 57 de Colombia");
    expect(window.WHATSAPP_CONFIG.phone.length).toBe(12, "Debe tener 12 dígitos (57 + 10 dígitos móviles)");
    expect(typeof window.WHATSAPP_CONFIG.businessName).toBe("string");
    expect(window.WHATSAPP_CONFIG.businessName.length).toBeGreaterThan(0);
  });

  it("contactarWhatsApp debe generar URLs con wa.me, teléfono limpio y texto codificado", () => {
    let capturedUrl = null;
    const originalSafeOpen = window.Security ? window.Security.safeOpen : null;
    const originalOpen = window.open;

    // Espiar apertura
    if (window.Security) {
      // Como Security está congelado, podemos espiar window.open temporalmente
    }
    window.open = function (url) {
      capturedUrl = url;
    };

    try {
      window.contactarWhatsApp("Hola, prueba de testing & verificación!");
      expect(capturedUrl).toBeDefined();
      expect(capturedUrl.startsWith("https://wa.me/")).toBe(true);
      expect(capturedUrl.includes("text=")).toBe(true);
      expect(capturedUrl.includes(window.WHATSAPP_CONFIG.phone)).toBe(true);
      // Validar codificación URI
      expect(capturedUrl.includes("%20")).toBe(true, "Los espacios deben estar codificados como %20");
      expect(capturedUrl.includes("%26")).toBe(true, "El carácter & debe estar codificado");
    } finally {
      window.open = originalOpen;
    }
  });

  it("solicitarServicioWhatsApp debe incluir el nombre del servicio técnico en el mensaje", () => {
    let capturedUrl = null;
    const originalOpen = window.open;
    window.open = (url) => { capturedUrl = url; };

    try {
      window.solicitarServicioWhatsApp("Mantenimiento Preventivo", "HP Pavilion con sobrecalentamiento");
      expect(capturedUrl).toBeDefined();
      const decoded = decodeURIComponent(capturedUrl);
      expect(decoded.includes("Mantenimiento Preventivo")).toBe(true);
      expect(decoded.includes("HP Pavilion con sobrecalentamiento")).toBe(true);
    } finally {
      window.open = originalOpen;
    }
  });

  it("consultarProductoWhatsApp debe incluir nombre, precio y marca en el mensaje", () => {
    let capturedUrl = null;
    const originalOpen = window.open;
    window.open = (url) => { capturedUrl = url; };

    try {
      window.consultarProductoWhatsApp("SSD Kingston A400", "$ 145.000 COP", "Kingston");
      expect(capturedUrl).toBeDefined();
      const decoded = decodeURIComponent(capturedUrl);
      expect(decoded.includes("SSD Kingston A400")).toBe(true);
      expect(decoded.includes("$ 145.000 COP")).toBe(true);
      expect(decoded.includes("Kingston")).toBe(true);
    } finally {
      window.open = originalOpen;
    }
  });
});
