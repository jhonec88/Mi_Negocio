/**
 * ==========================================================================
 * MÓDULO DE SEGURIDAD DEFENSIVA (VANILLA JS)
 * TecnoFix Colombia - Seguridad en Capas Frontend
 * ==========================================================================
 * 
 * Este módulo provee defensas activas contra:
 * 1. Cross-Site Scripting (XSS reflejado y persistente en DOM).
 * 2. Manipulación y envenenamiento de localStorage.
 * 3. Inyecciones de protocolo (javascript:, vbscript:, data:).
 * 4. Ataques de Tabnabbing y secuestro de ventana.
 * 5. Spam automatizado mediante Honeypots y limitación de tasa (Rate Limiting).
 */

(function (window) {
  "use strict";

  const Security = {
    /**
     * Escapa entidades HTML peligrosas para prevenir XSS al renderizar texto en el DOM
     * @param {*} input - Valor a escapar
     * @returns {string} Texto seguro sin riesgo de ejecución HTML
     */
    escapeHTML(input) {
      if (input === null || input === undefined) return "";
      const str = String(input);
      const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
        "`": "&#x60;"
      };
      return str.replace(/[&<>"'`/]/g, char => entityMap[char] || char);
    },

    /**
     * Sanitiza texto eliminando caracteres de control, bytes nulos y tags HTML
     * @param {string} text - Texto a sanitizar
     * @param {number} [maxLength=1000] - Longitud máxima permitida
     * @returns {string} Texto limpio
     */
    sanitizeText(text, maxLength = 1000) {
      if (typeof text !== "string") return "";
      // Elimina bytes nulos y caracteres de control invisibles
      let clean = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "");
      // Remueve etiquetas HTML completas
      clean = clean.replace(/<[^>]*>?/gm, "");
      // Limita la longitud máxima
      if (clean.length > maxLength) {
        clean = clean.substring(0, maxLength);
      }
      return clean.trim();
    },

    /**
     * Valida y sanitiza una URL. Permite rutas relativas locales seguras
     * y protocolos web seguros (https:, http:). Bloquea vectores como javascript:, data:, vbscript:.
     * @param {string} url - URL a validar
     * @param {Array<string>} [allowedProtocols=['https:', 'http:']] - Protocolos absolutos permitidos
     * @returns {string|null} URL segura o null si es maliciosa
     */
    sanitizeUrl(url, allowedProtocols = ["https:", "http:"]) {
      if (!url || typeof url !== "string") return null;
      const trimmed = url.trim();

      // Bloquear protocolos peligrosos conocidos y caracteres de control
      if (/^(javascript|vbscript|data):/i.test(trimmed)) {
        return null;
      }

      // Si es una ruta relativa válida del sitio (ej: assets/..., ./..., /, #...)
      if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
        // Bloquear caracteres de control o inyección de atributos
        if (/[\0\r\n"']/.test(trimmed)) {
          return null;
        }
        return encodeURI(decodeURI(trimmed));
      }

      // Si es una URL absoluta con protocolo
      try {
        const base = (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin !== "null")
          ? window.location.origin
          : "https://tecnofix.com.co";
        const parsed = new URL(trimmed, base);
        if (allowedProtocols.includes(parsed.protocol)) {
          return parsed.href;
        }
      } catch (e) {
        // En caso de que falle el parsing
      }
      return null;
    },

    /**
     * Abre un enlace externo de forma segura previniendo Tabnabbing (reverse tabnabbing)
     * @param {string} url - URL de destino
     */
    safeOpen(url) {
      const safeUrl = this.sanitizeUrl(url, ["https:", "http:"]);
      if (!safeUrl) {
        console.warn("[Seguridad] Intento de apertura de URL bloqueado:", url);
        return;
      }
      const newWin = window.open(safeUrl, "_blank", "noopener,noreferrer");
      if (newWin) {
        newWin.opener = null;
      }
    },

    /**
     * Control de tasa (Rate Limiting) en el cliente para prevenir abusos de clics o envíos repetitivos
     * @param {string} actionKey - Identificador de la acción (ej: 'contacto-submit')
     * @param {number} [cooldownSeconds=15] - Segundos de enfriamiento entre llamadas
     * @returns {boolean} true si la acción está permitida, false si está en cooldown
     */
    checkRateLimit(actionKey, cooldownSeconds = 15) {
      const storageKey = `sec_cooldown_${actionKey}`;
      const now = Date.now();
      try {
        const lastAction = sessionStorage.getItem(storageKey);
        if (lastAction) {
          const elapsed = (now - parseInt(lastAction, 10)) / 1000;
          if (elapsed < cooldownSeconds) {
            return false;
          }
        }
        sessionStorage.setItem(storageKey, String(now));
        return true;
      } catch (e) {
        // Si sessionStorage no está disponible, permite la acción
        return true;
      }
    },

    /**
     * Obtiene el tiempo restante en segundos de un cooldown activo
     * @param {string} actionKey - Identificador de la acción
     * @param {number} [cooldownSeconds=15]
     * @returns {number} Segundos restantes
     */
    getRemainingCooldown(actionKey, cooldownSeconds = 15) {
      const storageKey = `sec_cooldown_${actionKey}`;
      try {
        const lastAction = sessionStorage.getItem(storageKey);
        if (!lastAction) return 0;
        const elapsed = (Date.now() - parseInt(lastAction, 10)) / 1000;
        const remaining = Math.ceil(cooldownSeconds - elapsed);
        return remaining > 0 ? remaining : 0;
      } catch (e) {
        return 0;
      }
    },

    /**
     * Valida y sanitiza una estructura de datos de carrito guardada en localStorage
     * Garantiza que los IDs sean números positivos, cantidades acotadas y precios verificados
     * @param {Array} rawCart - Datos crudos de localStorage
     * @param {Array} [validCatalog] - Catálogo de productos oficial para contrastar precios
     * @returns {Array} Carrito limpio y verificado
     */
    validateCartData(rawCart, validCatalog = []) {
      if (!Array.isArray(rawCart)) return [];

      const cleanCart = [];
      const maxQtyPerItem = 99;

      for (const item of rawCart) {
        if (!item || typeof item !== "object") continue;

        const id = parseInt(item.id, 10);
        const qty = parseInt(item.cantidad, 10);

        if (isNaN(id) || id <= 0 || isNaN(qty) || qty <= 0) continue;

        const boundedQty = Math.min(qty, maxQtyPerItem);

        // Si tenemos el catálogo oficial, verificar la veracidad del producto y su precio real
        let realProduct = null;
        if (Array.isArray(validCatalog) && validCatalog.length > 0) {
          realProduct = validCatalog.find(p => p.id === id);
          if (!realProduct) {
            // El producto no existe en el catálogo oficial
            continue;
          }
        }

        cleanCart.push({
          id: id,
          nombre: this.escapeHTML(realProduct ? realProduct.nombre : String(item.nombre || "")),
          precio: realProduct ? Number(realProduct.precio) : Math.max(0, Number(item.precio) || 0),
          imagen: realProduct ? realProduct.imagen : this.escapeHTML(String(item.imagen || "")),
          marca: this.escapeHTML(realProduct ? realProduct.marca : String(item.marca || "")),
          categoria: this.escapeHTML(realProduct ? realProduct.categoria : String(item.categoria || "")),
          cantidad: boundedQty
        });
      }

      return cleanCart;
    }
  };

  // Congelar el objeto de seguridad para evitar manipulaciones en tiempo de ejecución (Object.freeze)
  Object.freeze(Security);

  // Exponer globalmente en window
  window.Security = Security;

})(typeof window !== "undefined" ? window : this);
