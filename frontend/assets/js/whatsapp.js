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
  businessName: "JecTech Soluciones"
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

// ============================================================================
// SINCRONIZACIÓN DINÁMICA DE CONFIGURACIÓN COMERCIAL Y WHATSAPP EN EL FRONTEND
// ============================================================================

/**
 * Formatea un número telefónico para presentación legible (ej. +57 300 123 4567)
 * @param {string} tel - Cadena con el número telefónico
 * @returns {string}
 */
function formatearTelefonoVisible(tel) {
  const digits = String(tel || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("57")) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  if (digits.length === 10) {
    return `+57 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return digits ? `+${digits}` : "+57 300 123 4567";
}

/**
 * Actualiza todos los enlaces y botones de WhatsApp existentes en el DOM de la página
 * @param {string} rawPhone - Número oficial sin símbolos
 */
function actualizarEnlacesWhatsAppEnDOM(rawPhone) {
  if (!rawPhone) return;
  const telLimpio = String(rawPhone).replace(/\D/g, "");
  if (!telLimpio) return;

  // 1. Actualizar enlaces que apunten a wa.me o api.whatsapp.com
  document.querySelectorAll('a[href*="wa.me/"], a[href*="whatsapp.com"]').forEach(link => {
    try {
      const href = link.getAttribute('href') || '';
      const match = href.match(/https?:\/\/(wa\.me|api\.whatsapp\.com\/send\/?\??)/);
      if (match) {
        const urlObj = new URL(href.startsWith('http') ? href : `https://${href}`);
        const params = urlObj.search; // Mantiene parámetros de mensaje si existen (?text=...)
        link.setAttribute('href', `https://wa.me/${telLimpio}${params}`);
      }
    } catch (e) {
      link.setAttribute('href', `https://wa.me/${telLimpio}`);
    }
  });

  // 2. Asegurar que el botón flotante y el botón del header lleven el nuevo número
  document.querySelectorAll('.whatsapp-float, .btn-whatsapp-header').forEach(btn => {
    btn.setAttribute('href', `https://wa.me/${telLimpio}`);
  });
}

/**
 * Actualiza los datos de la pestaña / página de contacto (Teléfono, Email, Dirección, Horario)
 * @param {Object} config - Configuración comercial obtenida de la base de datos
 */
function actualizarDatosContactoEnDOM(config) {
  if (!config || typeof config !== 'object') return;

  const elTel = document.getElementById('contacto-info-telefono');
  if (elTel && config.whatsapp_phone) {
    elTel.textContent = formatearTelefonoVisible(config.whatsapp_phone);
  }

  const elEmail = document.getElementById('contacto-info-email');
  if (elEmail && config.email_contacto) {
    elEmail.textContent = config.email_contacto;
  }

  const elSede = document.getElementById('contacto-info-sede');
  if (elSede && config.direccion_taller) {
    elSede.textContent = config.direccion_taller;
  }

  const elHorario = document.getElementById('contacto-info-horario');
  if (elHorario && config.horario_atencion) {
    elHorario.textContent = config.horario_atencion;
  }

  const elGeo = document.getElementById('contacto-info-direccion-geo');
  if (elGeo && config.direccion_taller) {
    elGeo.textContent = config.direccion_taller;
  }
}

/**
 * Actualiza los datos comerciales mostrados en los footers de todas las páginas
 * @param {Object} config - Configuración comercial
 */
function actualizarDatosFooterEnDOM(config) {
  if (!config || typeof config !== 'object') return;

  // 1. Dirección del taller en el footer
  if (config.direccion_taller) {
    document.querySelectorAll('[data-footer-field="direccion"]').forEach(el => {
      el.textContent = config.direccion_taller;
    });
  }

  // 2. Teléfono / WhatsApp oficial en el footer
  if (config.whatsapp_phone) {
    const telefonoFormateado = formatearTelefonoVisible(config.whatsapp_phone);
    document.querySelectorAll('[data-footer-field="telefono"]').forEach(el => {
      el.textContent = telefonoFormateado;
    });
    document.querySelectorAll('.footer-col .footer-contact-item span:not([data-footer-field])').forEach(span => {
      const txt = span.textContent.trim();
      if (txt.includes('+57') || /^\+?\d{9,15}$/.test(txt.replace(/\s+/g, ''))) {
        span.textContent = telefonoFormateado;
      }
    });
  }

  // 3. Correo electrónico de contacto en el footer
  if (config.email_contacto) {
    document.querySelectorAll('[data-footer-field="email"]').forEach(el => {
      el.textContent = config.email_contacto;
    });
  }

  // 4. Horario de atención en el footer
  if (config.horario_atencion) {
    document.querySelectorAll('[data-footer-field="horario"]').forEach(el => {
      el.textContent = config.horario_atencion;
    });
  }

  // 5. Nombre comercial de la empresa en el footer y barra de copyright
  if (config.business_name) {
    const nombreLimpio = String(config.business_name).trim();
    const partes = nombreLimpio.split(/\s+/);
    const primeraPalabra = partes[0] || nombreLimpio;
    const restoPalabras = partes.slice(1).join(' ');

    document.querySelectorAll('.site-header .brand-title, .site-footer .brand-title').forEach(titleEl => {
      titleEl.innerHTML = '';
      titleEl.appendChild(document.createTextNode(primeraPalabra + (restoPalabras ? ' ' : '')));
      if (restoPalabras) {
        const spanHighlight = document.createElement('span');
        spanHighlight.style.color = 'var(--color-primary)';
        spanHighlight.textContent = restoPalabras;
        titleEl.appendChild(spanHighlight);
      }
    });

    document.querySelectorAll('.site-footer .footer-bottom > div:first-child').forEach(copyEl => {
      copyEl.textContent = `© 2026 ${nombreLimpio}. Todos los derechos reservados.`;
    });
  }
}

/**
 * Aplica la configuración comercial en memoria y en todos los elementos del DOM
 * @param {Object} config
 */
function aplicarConfiguracionEnFrontend(config) {
  if (!config || typeof config !== 'object') return;

  if (config.whatsapp_phone) {
    WHATSAPP_CONFIG.phone = String(config.whatsapp_phone).replace(/\D/g, "");
  }
  if (config.business_name) {
    WHATSAPP_CONFIG.businessName = config.business_name;
  }
  if (config.email_contacto) {
    WHATSAPP_CONFIG.email = config.email_contacto;
  }
  if (config.direccion_taller) {
    WHATSAPP_CONFIG.address = config.direccion_taller;
  }
  if (config.horario_atencion) {
    WHATSAPP_CONFIG.hours = config.horario_atencion;
  }

  // Actualizar enlaces WhatsApp en toda la página
  if (config.whatsapp_phone) {
    actualizarEnlacesWhatsAppEnDOM(config.whatsapp_phone);
  }

  // Actualizar datos en página de Contacto
  actualizarDatosContactoEnDOM(config);

  // Actualizar footers
  actualizarDatosFooterEnDOM(config);
}

/**
 * Sincroniza dinámicamente los datos comerciales desde el backend o caché local
 */
async function sincronizarConfiguracionDesdeAPI() {
  // 1. Cargar caché previo si existe para respuesta instantánea
  try {
    const cached = localStorage.getItem('tecnofix_business_config');
    if (cached) {
      const parsed = JSON.parse(cached);
      aplicarConfiguracionEnFrontend(parsed);
    }
  } catch (e) {}

  // 2. Consultar versión fresca desde el backend
  try {
    const isLocalBackend = window.location.port === '3000' || window.location.origin.includes(':3000');
    const apiBase = isLocalBackend ? '/api' : 'http://localhost:3000/api';
    const res = await fetch(`${apiBase}/config?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.ok && data.config) {
        localStorage.setItem('tecnofix_business_config', JSON.stringify(data.config));
        aplicarConfiguracionEnFrontend(data.config);
      }
    }
  } catch (err) {
    // Modo estático o sin conexión al backend
  }
}

// Inicialización y reactividad automática
document.addEventListener('DOMContentLoaded', sincronizarConfiguracionDesdeAPI);
window.addEventListener('focus', sincronizarConfiguracionDesdeAPI);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    sincronizarConfiguracionDesdeAPI();
  }
});

// Reactividad entre pestañas (BroadcastChannel y StorageEvent)
if (typeof window.BroadcastChannel === 'function') {
  try {
    const canal = new BroadcastChannel('tecnofix_catalog_channel');
    canal.onmessage = (e) => {
      if (e.data && (e.data.type === 'config' || e.data.type === 'todos')) {
        sincronizarConfiguracionDesdeAPI();
      }
    };
  } catch (e) {}
}

window.addEventListener('storage', (e) => {
  if (e.key === 'tecnofix_config_updated' || e.key === 'tecnofix_business_config') {
    sincronizarConfiguracionDesdeAPI();
  }
});

// Exponer en el objeto global para acceso directo desde HTML y otros módulos
window.WHATSAPP_CONFIG = WHATSAPP_CONFIG;
window.contactarWhatsApp = contactarWhatsApp;
window.solicitarServicioWhatsApp = solicitarServicioWhatsApp;
window.consultarProductoWhatsApp = consultarProductoWhatsApp;
window.sincronizarConfiguracionDesdeAPI = sincronizarConfiguracionDesdeAPI;
window.aplicarConfiguracionEnFrontend = aplicarConfiguracionEnFrontend;
