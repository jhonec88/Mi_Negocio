/**
 * ==========================================================================
 * REGISTRO CENTRALIZADO DE METADATOS SEO Y OPEN GRAPH
 * TecnoFix Colombia - Servicio Técnico Especializado y Tienda Tecnológica
 * ==========================================================================
 * 
 * NOTA TÉCNICA IMPORTANTE SOBRE OPEN GRAPH EN CLIENTES FRONTEND ESTÁTICOS:
 * Los rastreadores de redes sociales (Facebook, WhatsApp, LinkedIn, X/Twitter,
 * Telegram, Discord, etc.) realizan peticiones HTTP GET crudas y NO ejecutan
 * JavaScript del navegador. Por lo tanto, los metadatos definitivos DEBEN estar
 * impresos de forma estática en el código HTML de cada página (<head>).
 * 
 * Este archivo sirve como:
 * 1. Fuente única de verdad (Single Source of Truth) para la configuración.
 * 2. Diccionario de referencia para desarrolladores al crear nuevas páginas.
 * 3. Utilidad de inspección y validación en tiempo de ejecución para el navegador.
 */

const SEO_OPEN_GRAPH_CONFIG = {
  // Dominio canónico de producción (Configurable si cambia el dominio)
  baseUrl: "https://tecnofix.com.co",

  // Datos de identidad corporativa
  siteName: "TecnoFix Colombia",
  locale: "es_CO",
  defaultType: "website",
  twitterCard: "summary_large_image",

  // Ubicación por defecto de la imagen fallback (1200x630 px, JPG)
  defaultImage: "https://tecnofix.com.co/assets/images/og/og-default.jpg",
  defaultImageAlt: "TecnoFix Colombia - Servicio Técnico Especializado de Computadores en Bogotá",
  imageWidth: 1200,
  imageHeight: 630,
  imageType: "image/jpeg",

  // Datos geográficos (Local SEO / GEO)
  geo: {
    region: "CO-DC",
    placename: "Bogotá, Colombia",
    position: "4.6645;-74.0583",
    icbm: "4.6645, -74.0583"
  },

  // Páginas del sitio con sus metadatos estandarizados
  pages: {
    home: {
      path: "/",
      file: "index.html",
      title: "Servicio Técnico de Computadores y Venta de Tecnología | TecnoFix Colombia",
      description: "Reparación, mantenimiento y optimización de computadores portátiles y PC en Bogotá. Diagnóstico certero, instalación de SSD, memoria RAM y garantía escrita.",
      image: "assets/images/og/og-home.jpg",
      imageAlt: "TecnoFix Colombia - Servicio Técnico Especializado y Tienda Tecnológica en Bogotá"
    },
    servicios: {
      path: "/servicios.html",
      file: "servicios.html",
      title: "Servicios de Reparación y Mantenimiento de Computadores | TecnoFix",
      description: "Conoce nuestros 12 servicios técnicos especializados: diagnóstico certero, pantallas de portátiles, reparación de tarjetas madre, instalación de SSD y formateo en Bogotá.",
      image: "assets/images/og/og-servicios.jpg",
      imageAlt: "Servicios Técnicos de Computadores y Portátiles en Bogotá - TecnoFix Colombia"
    },
    productos: {
      path: "/productos.html",
      file: "productos.html",
      title: "Catálogo de Productos Tecnológicos y Repuestos | TecnoFix Colombia",
      description: "Explora computadores, unidades SSD SATA y NVMe M.2, memorias RAM DDR4/DDR5, periféricos y accesorios con precios transparentes en pesos colombianos (COP).",
      image: "assets/images/og/og-productos.jpg",
      imageAlt: "Catálogo de Componentes Tecnológicos, Discos SSD y Memorias RAM - TecnoFix Colombia"
    },
    nosotros: {
      path: "/nosotros.html",
      file: "nosotros.html",
      title: "Sobre Nosotros | Servicio Técnico Profesional | TecnoFix Colombia",
      description: "Conoce nuestro trabajo, experiencia de más de 10 años y compromiso con la reparación y mantenimiento de computadores en Bogotá.",
      image: "assets/images/og/og-nosotros.jpg",
      imageAlt: "Sobre Nosotros - Trayectoria y Laboratorio Técnico TecnoFix Colombia"
    },
    preguntasFrecuentes: {
      path: "/preguntas-frecuentes.html",
      file: "preguntas-frecuentes.html",
      title: "Preguntas Frecuentes y Respuestas Técnicas | TecnoFix Colombia",
      description: "Resolvemos todas tus dudas sobre precios en pesos colombianos, tiempos de reparación (2 a 4 horas), garantías por escrito y servicio a domicilio en Bogotá.",
      image: "assets/images/og/og-preguntas-frecuentes.jpg",
      imageAlt: "Preguntas Frecuentes y Soporte Técnico - TecnoFix Colombia"
    },
    contacto: {
      path: "/contacto.html",
      file: "contacto.html",
      title: "Contacto y Cotizaciones | Servicio Técnico • TecnoFix Colombia",
      description: "Solicita información sobre reparación de computadores, mantenimiento preventivo y productos tecnológicos en Bogotá. Taller en Chapinero y WhatsApp directo.",
      image: "assets/images/og/og-contacto.jpg",
      imageAlt: "Contacto y Ubicación en Bogotá - TecnoFix Colombia"
    }
  },

  /**
   * Helper para obtener la URL absoluta de cualquier recurso del sitio
   * @param {string} relativePath Ruta relativa (ej: 'assets/images/og/og-home.jpg')
   * @returns {string} URL absoluta lista para Open Graph
   */
  getAbsoluteUrl(relativePath) {
    const cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
    return `${this.baseUrl}/${cleanPath}`;
  }
};

// Exportar globalmente para entornos de navegador sin módulos
if (typeof window !== "undefined") {
  window.SEO_OPEN_GRAPH_CONFIG = SEO_OPEN_GRAPH_CONFIG;
}
