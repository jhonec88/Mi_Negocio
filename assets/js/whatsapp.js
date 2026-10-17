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
  
  const textoCodificado = encodeURIComponent(mensaje.trim());
  const url = `https://wa.me/${WHATSAPP_CONFIG.phone}?text=${textoCodificado}`;
  
  // Apertura segura con noopener,noreferrer
  window.open(url, "_blank", "noopener,noreferrer");
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
