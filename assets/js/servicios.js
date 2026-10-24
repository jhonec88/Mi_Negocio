/**
 * ==========================================================================
 * MÓDULO DE SERVICIOS TÉCNICOS Y HERRAMIENTAS INTERACTIVAS
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

const SERVICIOS_DATA = [
  {
    id: 1,
    nombre: "Mantenimiento Preventivo",
    categoria: "mantenimiento",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    descripcion: "Limpieza interna profunda, desensamble cuidadoso, cambio de pasta térmica de alto rendimiento y lubricación de ventiladores.",
    beneficios: [
      "Reduce temperaturas de trabajo hasta en 20°C",
      "Elimina polvo acumulado y evita cortocircuitos",
      "Alarga significativamente la vida útil de CPU y GPU"
    ],
    equiposCompatibles: "Portátiles de todas las marcas y Computadores de escritorio / Torres Gamer",
    tareasIncluidas: [
      "Desarme completo y aspirado con brocha antiestática",
      "Limpieza de disipadores y soplado de ventiladores",
      "Remoción de pasta térmica seca y aplicación de compuesto térmico premium",
      "Limpieza química externa de carcasa, teclado y pantalla",
      "Test de estrés térmico de 30 minutos"
    ],
    tiempoEstimado: "2 a 4 horas hábiles",
    precioReferencia: "Desde $60.000 COP",
    destacado: true
  },
  {
    id: 2,
    nombre: "Mantenimiento Correctivo y Diagnóstico",
    categoria: "mantenimiento",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    descripcion: "Identificación precisa de fallas de encendido, bloqueos, pantallas azules y comportamiento errático con instrumental especializado.",
    beneficios: [
      "Diagnóstico certero con pruebas de banco",
      "Cotización previa sin sorpresas antes de reparar",
      "Revisión de componentes individuales"
    ],
    equiposCompatibles: "Portátiles, All-in-One y Computadores de Torre",
    tareasIncluidas: [
      "Inspección visual de placa madre bajo microscopio",
      "Medición de líneas de voltaje principales con multímetro y osciloscopio",
      "Prueba de salud de disco con análisis S.M.A.R.T.",
      "Prueba exhaustiva de memoria RAM con MemTest86",
      "Informe técnico detallado para el cliente"
    ],
    tiempoEstimado: "24 a 48 horas",
    precioReferencia: "Cotización según diagnóstico",
    destacado: true
  },
  {
    id: 3,
    nombre: "Reparación Especializada de Portátiles",
    categoria: "hardware",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>`,
    descripcion: "Cambio de pantallas partidas, reparación de bisagras rotas, sustitución de teclados, puertos de carga Jack DC y baterías.",
    beneficios: [
      "Repuestos clase A y originales con garantía",
      "Reconstrucción estructural de chasis y bisagras",
      "Ajuste y alineación precisa de tapas"
    ],
    equiposCompatibles: "Lenovo, HP, Dell, ASUS, Acer, Apple MacBook, Toshiba y más",
    tareasIncluidas: [
      "Sustitución de display LCD / LED / IPS sin manchas",
      "Reconstrucción epóxica reforzada de anclajes de bisagras",
      "Cambio de teclados remachados o modulares",
      "Microsoldadura de pin de carga dañado",
      "Garantía directa de 3 a 6 meses en repuestos"
    ],
    tiempoEstimado: "24 a 72 horas (según repuesto)",
    precioReferencia: "Cotización previa",
    destacado: true
  },
  {
    id: 4,
    nombre: "Reparación de Equipos de Escritorio",
    categoria: "hardware",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="16" y2="10"></line><circle cx="12" cy="16" r="2"></circle></svg>`,
    descripcion: "Diagnóstico y cambio de fuentes de poder dañadas, tarjetas de video, placas madre, procesadores y sistemas de refrigeración líquida.",
    beneficios: [
      "Sustitución de partes con componentes testeados",
      "Gestión organizada de cableado para mejor flujo de aire",
      "Pruebas de estabilidad bajo carga máxima"
    ],
    equiposCompatibles: "Torres de oficina, estaciones de trabajo y PCs Gamer",
    tareasIncluidas: [
      "Revisión de fuente de poder y rieles de 12V, 5V y 3.3V",
      "Prueba de tarjeta gráfica contra artefactos visuales",
      "Actualización de BIOS/UEFI de placa madre",
      "Mantenimiento a ventiladores de chasis",
      "Ensamble y reordenamiento de cables internos"
    ],
    tiempoEstimado: "24 horas",
    precioReferencia: "Desde $50.000 COP + Repuestos",
    destacado: false
  },
  {
    id: 5,
    nombre: "Instalación de Sistemas Operativos",
    categoria: "software",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>`,
    descripcion: "Instalación limpia y optimizada de Windows 10, Windows 11 o distribuciones Linux, con controladores oficiales y utilidades básicas.",
    beneficios: [
      "Sistema sin software basura ni ralentizaciones",
      "Drivers oficiales certificados por el fabricante",
      "Particionamiento adecuado y optimización de arranque"
    ],
    equiposCompatibles: "Cualquier computador con arquitectura x64",
    tareasIncluidas: [
      "Respaldo preventivo de archivos personales si el cliente lo requiere",
      "Formateo en modo UEFI / GPT seguro",
      "Instalación de Windows o Linux (Ubuntu, Mint, Fedora)",
      "Instalación completa de controladores de video, audio, wifi y chipset",
      "Configuración de navegador, visor PDF, compresor y antivirus"
    ],
    tiempoEstimado: "3 a 5 horas",
    precioReferencia: "$60.000 COP",
    destacado: true
  },
  {
    id: 6,
    nombre: "Eliminación de Malware y Virus",
    categoria: "software",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    descripcion: "Detección profunda y desinfección de troyanos, adware publicitario, spyware, ransomware y secuestradores de navegador.",
    beneficios: [
      "Recupera la velocidad y privacidad del equipo",
      "Sin pérdida de archivos personales",
      "Eliminación de ventanas emergentes molestas"
    ],
    equiposCompatibles: "Windows 10, 11 y versiones anteriores",
    tareasIncluidas: [
      "Escaneo sin conexión mediante entorno de rescate",
      "Limpieza de registros del sistema adulterados",
      "Eliminación de extensiones maliciosas en navegadores",
      "Cierre de puertos y servicios sospechosos de inicio",
      "Configuración de protección en tiempo real"
    ],
    tiempoEstimado: "4 a 6 horas",
    precioReferencia: "$50.000 COP",
    destacado: false
  },
  {
    id: 7,
    nombre: "Actualización de Hardware (SSD y RAM)",
    categoria: "hardware",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
    descripcion: "Multiplica la velocidad de tu equipo cambiando el disco duro mecánico por un SSD y ampliando la memoria RAM.",
    beneficios: [
      "Hasta 10 veces más rápido en encendido y apertura de programas",
      "Mayor capacidad de respuesta en multitarea",
      "Migración idéntica de tu sistema y programas sin reinstalar todo"
    ],
    equiposCompatibles: "Portátiles y computadores de escritorio de más de 3 años",
    tareasIncluidas: [
      "Revisión de slots libres y compatibilidad de frecuencia",
      "Instalación física de unidad SSD (SATA o NVMe M.2)",
      "Clonación exacta de disco antiguo o instalación limpia",
      "Prueba de velocidad de lectura/escritura",
      "Adaptación del disco viejo como almacenamiento secundario si aplica"
    ],
    tiempoEstimado: "2 a 4 horas",
    precioReferencia: "$40.000 COP (Mano de obra) + Componentes",
    destacado: true
  },
  {
    id: 8,
    nombre: "Recuperación de Información y Datos",
    categoria: "software",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
    descripcion: "Evaluación y rescate de archivos en discos duros con sectores dañados, memorias USB ilegibles o borrado accidental.",
    beneficios: [
      "Estricta confidencialidad de tus archivos y fotos",
      "Evaluación técnica previa de viabilidad",
      "Entrega de datos en unidad externa segura"
    ],
    equiposCompatibles: "Discos duros mecánicos (HDD), SSDs, memorias USB y tarjetas SD",
    tareasIncluidas: [
      "Diagnóstico del tipo de daño (lógico o mecánico)",
      "Creación de imagen bit a bit para no degradar el medio",
      "Extracción forense de estructuras de carpetas y archivos",
      "Verificación de integridad de fotos, documentos y bases de datos"
    ],
    tiempoEstimado: "24 a 72 horas",
    precioReferencia: "Sujeto a evaluación previa",
    destacado: false
  },
  {
    id: 9,
    nombre: "Instalación de Programas y Software Autorizado",
    categoria: "software",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6-6-6"></path><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
    descripcion: "Configuración de suites ofimáticas, programas de diseño, utilidades de compresión, lectores de PDF y herramientas contables.",
    beneficios: [
      "Software configurado correctamente y optimizado",
      "Evita descargas infectadas de internet",
      "Asesoría en licenciamiento oficial o alternativas Open Source"
    ],
    equiposCompatibles: "Windows y macOS",
    tareasIncluidas: [
      "Instalación de paquetes de productividad",
      "Activación con licencias proporcionadas por el cliente",
      "Configuración de perfiles y carpetas predeterminadas",
      "Comprobación de compatibilidad con impresoras y periféricos"
    ],
    tiempoEstimado: "1 a 2 horas",
    precioReferencia: "Desde $35.000 COP",
    destacado: false
  },
  {
    id: 10,
    nombre: "Configuración de Redes y Conectividad",
    categoria: "redes",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
    descripcion: "Optimización de red Wi-Fi, instalación de repetidores, routers de alta velocidad, cableado estructurado e impresoras compartidas.",
    beneficios: [
      "Elimina zonas muertas de señal en casas u oficinas",
      "Mayor estabilidad para videollamadas y teletrabajo",
      "Seguridad inalámbrica robusta con cifrado WPA3"
    ],
    equiposCompatibles: "Redes domésticas, locales comerciales y oficinas",
    tareasIncluidas: [
      "Análisis de espectro y canales Wi-Fi saturados",
      "Configuración de routers, puntos de acceso y switches",
      "Conexión de impresoras en red para múltiples computadores",
      "Crimpeado y verificación de cables de red UTP Cat 6"
    ],
    tiempoEstimado: "2 a 4 horas",
    precioReferencia: "Desde $70.000 COP",
    destacado: false
  },
  {
    id: 11,
    nombre: "Soporte Remoto Asistido",
    categoria: "software",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
    descripcion: "Solución ágil a distancia de problemas de software, impresoras, configuración de correo y limpieza ligera sin salir de casa.",
    beneficios: [
      "Atención inmediata sin desplazamientos",
      "Conexión 100% cifrada y bajo tu supervisión en pantalla",
      "Económico y práctico para urgencias de oficina"
    ],
    equiposCompatibles: "Computadores con conexión a internet estable",
    tareasIncluidas: [
      "Enlace mediante AnyDesk o TeamViewer seguro",
      "Diagnóstico de errores de software y lentitud",
      "Instalación de controladores de periféricos",
      "Depuración de archivos temporales"
    ],
    tiempoEstimado: "45 a 90 minutos",
    precioReferencia: "$40.000 COP / Sesión",
    destacado: false
  },
  {
    id: 12,
    nombre: "Asesoría Tecnológica Personalizada",
    categoria: "mantenimiento",
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    descripcion: "Orientación profesional para compra de equipos, renovación de tecnología y optimización de presupuesto informático.",
    beneficios: [
      "Evita compras inadecuadas o componentes incompatibles",
      "Recomendaciones imparciales basadas en tu necesidad real",
      "Cotizaciones ajustadas a tu presupuesto disponible"
    ],
    equiposCompatibles: "Particulares, profesionales independientes y empresas",
    tareasIncluidas: [
      "Análisis de requerimientos de uso (diseño, ingeniería, oficina, estudio)",
      "Comparativa técnica entre modelos de mercado",
      "Recomendación de especificaciones mínimas requeridas",
      "Acompañamiento en adquisición y primera configuración"
    ],
    tiempoEstimado: "1 hora",
    precioReferencia: "$30.000 COP (Gratis al contratar servicio)",
    destacado: false
  }
];

/**
 * Renderiza tarjetas de servicios en el contenedor indicado
 * @param {Array} servicios - Lista de servicios a mostrar
 * @param {string} contenedorId - ID del contenedor DOM
 */
function renderizarServicios(servicios, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  if (servicios.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state text-center" style="grid-column: 1 / -1; padding: 3rem;">
        <p class="text-muted">No se encontraron servicios técnicos en esta categoría.</p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = servicios.map(s => `
    <article class="service-card" data-service-id="${s.id}">
      <div class="service-icon-box" aria-hidden="true">
        ${s.icono}
      </div>
      <h3 class="service-title">${s.nombre}</h3>
      <p class="service-desc">${s.descripcion}</p>
      
      <div class="service-benefits">
        ${s.beneficios.map(b => `
          <div class="service-benefit-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${b}</span>
          </div>
        `).join("")}
      </div>

      <div class="service-actions">
        <button type="button" class="btn btn-outline btn-sm btn-detalle-servicio" onclick="mostrarDetalleServicio(${s.id})">
          Ver detalles
        </button>
        <button type="button" class="btn btn-whatsapp btn-sm" onclick="solicitarServicioWhatsApp('${s.nombre}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
          Cotizar
        </button>
      </div>
    </article>
  `).join("");
}

/**
 * Abre el modal con información completa del servicio técnico
 * @param {number} idServicio - ID numérico del servicio
 */
function mostrarDetalleServicio(idServicio) {
  const servicio = SERVICIOS_DATA.find(s => s.id === idServicio);
  if (!servicio) return;

  const bodyHtml = `
    <div class="service-modal-content">
      <p style="font-size: 1.05rem; margin-bottom: 1.25rem;">${servicio.descripcion}</p>
      
      <div style="background-color: var(--color-bg-secondary); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; border: 1px solid var(--color-border);">
        <strong style="color: var(--color-text-primary); display: block; margin-bottom: 0.25rem;">Equipos y marcas compatibles:</strong>
        <span class="text-sm text-muted">${servicio.equiposCompatibles}</span>
      </div>

      <h4 style="margin-bottom: 0.75rem;">¿Qué incluye este servicio técnico?</h4>
      <ul style="list-style: none; padding-left: 0; margin-bottom: 1.25rem;">
        ${servicio.tareasIncluidas.map(t => `
          <li style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.925rem; color: var(--color-text-secondary);">
            <svg style="width: 16px; height: 16px; color: var(--color-success); flex-shrink: 0; margin-top: 3px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${t}</span>
          </li>
        `).join("")}
      </ul>

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-top: 1px solid var(--color-border); font-size: 0.9rem;">
        <div>
          <span class="text-muted">Tiempo estimado:</span> <strong>${servicio.tiempoEstimado}</strong>
        </div>
        <div>
          <span class="text-muted">Referencia:</span> <strong style="color: var(--color-primary);">${servicio.precioReferencia}</strong>
        </div>
      </div>
    </div>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>
    <button type="button" class="btn btn-whatsapp" onclick="solicitarServicioWhatsApp('${servicio.nombre}'); cerrarModal();">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
      Solicitar por WhatsApp
    </button>
  `;

  abrirModal(servicio.nombre, bodyHtml, footerHtml);
}

/**
 * --------------------------------------------------------------------------
 * HERRAMIENTA DIFERENCIAL 1: DIAGNÓSTICO ORIENTATIVO INTERACTIVO (RF-24.A)
 * --------------------------------------------------------------------------
 */
const GUIA_DIAGNOSTICO = {
  lento: {
    titulo: "Computador lento o demorado al iniciar",
    causa: "Disco duro mecánico con alto uso o degradación, exceso de programas en segundo plano o memoria RAM insuficiente.",
    solucionRecomendada: "Actualización a disco de estado sólido SSD y optimización del sistema operativo.",
    servicioAsociado: "Actualización de Hardware (SSD y RAM)",
    tiempoEstimado: "2 a 4 horas"
  },
  no_enciende: {
    titulo: "No enciende, no da luces o no da imagen",
    causa: "Falla en fuente de poder, cargador, batería, corto en placa base o falso contacto en memorias RAM.",
    solucionRecomendada: "Diagnóstico electrónico en banco de pruebas con medición de voltajes y líneas primarias.",
    servicioAsociado: "Mantenimiento Correctivo y Diagnóstico",
    tiempoEstimado: "24 a 48 horas"
  },
  calienta: {
    titulo: "Se calienta mucho o ventiladores ruidosos",
    causa: "Pasta térmica reseca que perdió conductividad y acumulación de polvo en rejillas de ventilación.",
    solucionRecomendada: "Mantenimiento preventivo integral, limpieza física profunda y pasta térmica premium.",
    servicioAsociado: "Mantenimiento Preventivo",
    tiempoEstimado: "2 a 3 horas"
  },
  pantalla_azul: {
    titulo: "Pantallas azules (BSOD) o reinicios inesperados",
    causa: "Controladores corruptos, fallas lógicas de disco, memoria RAM inestable o fallo en el sistema operativo.",
    solucionRecomendada: "Testeo de memoria RAM y reinstalación limpia del sistema con drivers certificados.",
    servicioAsociado: "Instalación de Sistemas Operativos",
    tiempoEstimado: "3 a 5 horas"
  },
  virus: {
    titulo: "Publicidad invasiva, lentitud repentina o posible virus",
    causa: "Infección por malware, spyware, secuestradores de navegador o software malicioso instalado sin autorización.",
    solucionRecomendada: "Desinfección con entorno seguro sin pérdida de archivos personales.",
    servicioAsociado: "Eliminación de Malware y Virus",
    tiempoEstimado: "4 a 6 horas"
  },
  internet: {
    titulo: "No conecta a Wi-Fi o desconexiones constantes",
    causa: "Falla de controlador de red, tarjeta inalámbrica desajustada o saturación de canales en el router.",
    solucionRecomendada: "Revisión física de tarjeta de red o configuración de conectividad.",
    servicioAsociado: "Configuración de Redes y Conectividad",
    tiempoEstimado: "1 a 2 horas"
  }
};

/**
 * Procesa la selección del usuario en el diagnóstico orientativo
 * @param {string} tipoProblema - Clave del problema reportado
 */
function ejecutarDiagnostico(tipoProblema) {
  const resultado = GUIA_DIAGNOSTICO[tipoProblema];
  const contenedorResultado = document.getElementById("resultado-diagnostico");
  if (!resultado || !contenedorResultado) return;

  // Marcar botón activo
  document.querySelectorAll(".diagnostic-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.problem === tipoProblema);
  });

  contenedorResultado.innerHTML = `
    <div class="diagnostic-result-box">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span class="badge badge-category" style="background-color: var(--color-primary-light); color: var(--color-primary);">Orientación técnica inicial</span>
      </div>
      <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem;">${resultado.titulo}</h3>
      <p style="margin-bottom: 0.75rem;"><strong style="color: var(--color-text-primary);">Causa probable:</strong> ${resultado.causa}</p>
      <p style="margin-bottom: 1.25rem;"><strong style="color: var(--color-text-primary);">Solución recomendada:</strong> ${resultado.solucionRecomendada}</p>
      
      <div style="background-color: var(--color-bg-secondary); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 1.25rem; font-size: 0.875rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <span>Servicio sugerido: <strong>${resultado.servicioAsociado}</strong></span>
          <span>Tiempo orientativo: <strong>${resultado.tiempoEstimado}</strong></span>
        </div>
      </div>

      <p class="text-xs text-muted" style="margin-bottom: 1.25rem;">
        * Nota: Esta herramienta proporciona una orientación preliminar basada en síntomas frecuentes y no sustituye una revisión técnica física en nuestro taller.
      </p>

      <button type="button" class="btn btn-whatsapp" onclick="solicitarServicioWhatsApp('${resultado.servicioAsociado}', 'Presenta síntomas de: ${resultado.titulo}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
        Consultar este problema por WhatsApp
      </button>
    </div>
  `;
}

// Exponer en el objeto global
window.SERVICIOS_DATA = SERVICIOS_DATA;
window.GUIA_DIAGNOSTICO = GUIA_DIAGNOSTICO;
window.renderizarServicios = renderizarServicios;
window.mostrarDetalleServicio = mostrarDetalleServicio;
window.ejecutarDiagnostico = ejecutarDiagnostico;
