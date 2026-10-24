/**
 * ==========================================================================
 * MÓDULO DE INTEGRACIÓN CON WHATSAPP
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

const WHATSAPP_CONFIG = {
  // Número comercial de atención en Colombia (formato internacional sin signos)
  // Sustituir por el número comercial real de la empresa
  phone: "573001234567",
  businessName: "TecnoFix Colombia"
};

/**
 * Abre WhatsApp con un mensaje predefinido y codificado para URL.
 * Cumple con la especificación: solo abre WhatsApp, no afirma envío o almacenamiento en backend.
 * @param {string} mensaje - Texto del mensaje que se precargará en la conversación.
 */
function contactarWhatsApp(mensaje) {
  if (!mensaje || typeof mensaje !== "string") {
    mensaje = `Hola ${WHATSAPP_CONFIG.businessName}, deseo solicitar información sobre sus servicios técnicos y catálogo.`;
  }
  
  // Limpieza y sanitización de texto para WhatsApp
  const mensajeLimpio = (window.Security && typeof window.Security.sanitizeText === "function")
    ? window.Security.sanitizeText(mensaje, 2000)
    : mensaje.trim();

  // Asegurar que el teléfono contenga solo números
  const telefonoLimpio = String(WHATSAPP_CONFIG.phone || "").replace(/\D/g, "");
  const textoCodificado = encodeURIComponent(mensajeLimpio);
  const url = `https://wa.me/${telefonoLimpio}?text=${textoCodificado}`;
  
  // Apertura segura con mitigación de reverse tabnabbing y validación de protocolo
  if (window.Security && typeof window.Security.safeOpen === "function") {
    window.Security.safeOpen(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Genera el mensaje contextual para cotizar o solicitar un servicio técnico.
 * @param {string} nombreServicio - Nombre del servicio técnico.
 * @param {string} [detallesExtra] - Detalles adicionales del equipo o falla.
 */
function solicitarServicioWhatsApp(nombreServicio, detallesExtra = "") {
  let mensaje = `Hola ${WHATSAPP_CONFIG.businessName}, necesito solicitar el servicio de *${nombreServicio}* para mi equipo.`;
  if (detallesExtra) {
    mensaje += `\n\n*Detalles del equipo/falla:* ${detallesExtra}`;
  }
  mensaje += `\nQuisiera conocer el procedimiento, tiempos estimados y costo aproximado.`;
  
  contactarWhatsApp(mensaje);
}

/**
 * Genera el mensaje contextual para consultar disponibilidad y precio de un producto.
 * @param {string} nombreProducto - Nombre del producto en catálogo.
 * @param {string|number} precio - Precio en COP.
 * @param {string} [marca] - Marca del producto.
 */
function consultarProductoWhatsApp(nombreProducto, precio, marca = "") {
  let mensaje = `Hola ${WHATSAPP_CONFIG.businessName}, estoy interesado en el producto: *${nombreProducto}*`;
  if (marca) {
    mensaje += ` (Marca: ${marca})`;
  }
  if (precio) {
    mensaje += ` con precio de referencia de *${precio}*`;
  }
  mensaje += ` que vi en su catálogo web.\n¿Me pueden confirmar disponibilidad inmediata y proceso de entrega?`;
  
  contactarWhatsApp(mensaje);
}

// Exponer en el objeto global para acceso directo desde HTML y otros módulos
window.WHATSAPP_CONFIG = WHATSAPP_CONFIG;
window.contactarWhatsApp = contactarWhatsApp;
window.solicitarServicioWhatsApp = solicitarServicioWhatsApp;
window.consultarProductoWhatsApp = consultarProductoWhatsApp;
