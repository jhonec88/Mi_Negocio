/**
 * ==========================================================================
 * TESTS: Módulo de Formulario y Validación de Contacto (formulario.js)
 * ==========================================================================
 */

describe("Módulo de Validación de Formulario (formulario.js)", () => {
  describe("validarEmail()", () => {
    it("debe validar correos con sintaxis estándar válida", () => {
      expect(window.validarEmail("cliente@gmail.com")).toBe(true);
      expect(window.validarEmail("soporte.tecnico@empresa.com.co")).toBe(true);
      expect(window.validarEmail("usuario+tag@dominio.co")).toBe(true);
    });

    it("debe rechazar correos con sintaxis inválida", () => {
      expect(window.validarEmail("")).toBe(false);
      expect(window.validarEmail("correo-sin-arroba.com")).toBe(false);
      expect(window.validarEmail("correo@sin-tld")).toBe(false);
      expect(window.validarEmail("@sin-nombre.com")).toBe(false);
      expect(window.validarEmail("espacios en@correo.com")).toBe(false);
    });
  });

  describe("validarTelefono()", () => {
    it("debe aceptar números móviles estándar de Colombia de 10 dígitos", () => {
      expect(window.validarTelefono("3001234567")).toBe(true);
      expect(window.validarTelefono("315 987 6543")).toBe(true, "Debe ignorar espacios");
      expect(window.validarTelefono("+57 320-111-2233")).toBe(true, "Debe procesar números con formato internacional");
    });

    it("debe aceptar líneas fijas entre 7 y 10 dígitos", () => {
      expect(window.validarTelefono("6017654321")).toBe(true);
      expect(window.validarTelefono("7654321")).toBe(true);
    });

    it("debe rechazar números con menos de 7 o más de 10 dígitos", () => {
      expect(window.validarTelefono("12345")).toBe(false, "Menos de 7 dígitos debe ser inválido");
      expect(window.validarTelefono("3001234567890123")).toBe(false, "Más de 10 dígitos debe ser inválido");
      expect(window.validarTelefono("abcdefghij")).toBe(false, "Solo letras debe ser inválido");
    });
  });

  describe("Manejo de Errores Visuales y Accesibilidad", () => {
    let mockGroup, mockInput, mockErrorMsg;

    beforeEach(() => {
      mockGroup = document.createElement("div");
      mockGroup.className = "form-group";
      mockInput = document.createElement("input");
      mockInput.id = "test-input";
      mockErrorMsg = document.createElement("div");
      mockErrorMsg.className = "form-error-msg";

      mockGroup.appendChild(mockInput);
      mockGroup.appendChild(mockErrorMsg);
      document.body.appendChild(mockGroup);
    });

    afterEach(() => {
      mockGroup.remove();
    });

    it("setCampoError debe añadir clase has-error y aria-invalid='true'", () => {
      window.setCampoError(mockInput, "El teléfono es obligatorio");
      expect(mockGroup.classList.contains("has-error")).toBe(true);
      expect(mockInput.getAttribute("aria-invalid")).toBe("true");
      expect(mockErrorMsg.textContent).toBe("El teléfono es obligatorio");
    });

    it("setCampoError con mensaje vacío debe limpiar el error y el atributo aria-invalid", () => {
      window.setCampoError(mockInput, "Error previo");
      window.setCampoError(mockInput, "");
      expect(mockGroup.classList.contains("has-error")).toBe(false);
      expect(mockInput.hasAttribute("aria-invalid")).toBe(false);
      expect(mockErrorMsg.textContent).toBe("");
    });
  });
});
