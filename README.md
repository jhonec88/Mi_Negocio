# TecnoFix Colombia — Servicio Técnico y Tienda Tecnológica

Sitio web comercial y catálogo digital interactivo desarrollado exclusivamente con **HTML5, CSS3 y JavaScript puro (Vanilla ES6+)**, sin frameworks, dependencias externas ni backend, conforme a la especificación técnica frontend para el mercado de Colombia.

---

## 🚀 Características Principales

1. **Carrito de Compras Interactivo**:
   - Botón de carrito con contador dinámico (badge animado) accesible desde la cabecera en todas las páginas.
   - Panel lateral deslizable (*Slide-Over Drawer*) con listado de productos acumulados.
   - Controles de cantidad (+ / -), botón de eliminación individual y opción de vaciar carrito.
   - Persistencia automática en `localStorage` (los productos agregados se conservan al navegar entre páginas).
   - Generación de mensaje estructurado para **finalizar y enviar el pedido consolidado directamente a WhatsApp**.
2. **Rutas Comerciales Duales**:
   - **Ruta 1 (Reparación):** Solicitud rápida de diagnóstico, mantenimiento preventivo y reparación de portátiles y PCs.
   - **Ruta 2 (Tienda):** Catálogo de productos tecnológicos con precios en Pesos Colombianos (COP), filtros, ordenamiento y ficha técnica.
3. **Herramientas Diferenciales Interactivas**:
   - **Diagnóstico Orientativo:** Asistente interactivo "¿Qué problema tiene tu computador?" con orientación previa y solución sugerida.
   - **Slider Antes y Después:** Comparador visual interactivo de mantenimiento térmico y limpieza de hardware.
   - **Recomendador de Actualizaciones:** Calculadora orientativa de combinaciones SSD/RAM según tipo de equipo y uso.
4. **Integración con WhatsApp**:
   - Generación de enlaces contextuales con mensajes preparados y codificados (`https://wa.me/57...`).
   - Botón flotante accesible en todas las páginas.
5. **Formulario Asistido y Validado**:
   - Validación accesible en tiempo real (nombre, teléfono de 10 dígitos, email opcional, tipo de solicitud, mensaje y aceptación de la Ley 1581 de protección de datos).
   - Modal de transparencia que prepara la solicitud para enviarla vía WhatsApp.
6. **Accesibilidad y Rendimiento**:
   - Cumplimiento de criterios aplicables de **WCAG 2.2 AA** (contraste cromático, navegación por teclado, enlaces de salto, trampa de foco en modales y respeto a `prefers-reduced-motion`).
   - Diseño **Mobile-First** 100% responsivo para móviles, tabletas y computadores.
   - Tema Claro y Tema Oscuro seleccionable con persistencia en `localStorage`.

---

## 📁 Estructura del Proyecto

```text
MINEGOCIO/
├── index.html                     # Página principal con hero, rutas, destacados y diagnóstico
├── servicios.html                 # Catálogo de los 12 servicios técnicos especializados
├── productos.html                 # Catálogo interactivo con buscador, filtros y ordenamiento
├── nosotros.html                  # Perfil profesional, valores, galería de taller y testimonios
├── preguntas-frecuentes.html      # Acordeón accesible de FAQs con buscador en vivo
├── contacto.html                  # Datos de atención y formulario con validación
│
├── assets/
│   ├── css/
│   │   ├── variables.css          # Paleta oficial, tipografía y tokens de diseño
│   │   ├── reset.css              # Reset moderno y accesible
│   │   ├── global.css             # Clases globales, utilidades y tipografía
│   │   ├── components.css         # Tarjetas, modales, botones, formularios, drawer y badges
│   │   └── responsive.css         # Media queries y menú móvil drawer
│   │
│   ├── js/
│   │   ├── carrito.js             # Lógica del carrito de compras, persistencia y checkout WhatsApp
│   │   ├── whatsapp.js            # Configuración de número comercial y mensajes contextuales
│   │   ├── modal.js               # Gestor accesible de ventanas modales (WCAG 2.2 AA)
│   │   ├── productos-data.js      # Base de datos local de 16 productos con precios en COP
│   │   ├── productos.js           # Renderizado dinámico, botones + Carrito y ficha técnica
│   │   ├── filtros.js             # Búsqueda, filtrado multicriterio y ordenamiento nativo
│   │   ├── servicios.js           # Datos de 12 servicios y diagnóstico orientativo
│   │   ├── formulario.js          # Validación accesible de formulario de contacto
│   │   ├── faq.js                 # Acordeón accesible con soporte para teclado
│   │   ├── menu.js                # Menú hamburguesa, tema oscuro y eventos de scroll
│   │   └── main.js                # Orquestador general de la aplicación
│   │
│   └── images/
│       ├── productos/             # Ilustraciones vectoriales SVG de productos
│       ├── galeria/               # Comparativas antes/después y fotos de laboratorio
│       ├── servicios/             # Iconos y recursos de servicios
│       └── logo/                  # Logotipo del negocio
│
├── favicon.svg                    # Icono tecnológico vectorial
└── README.md                      # Documentación del proyecto
```

---

## 🛠️ Cómo Ejecutar Localmente

Al no requerir compilación, bundlers ni backend:

1. **Opción directa**: Abre el archivo `index.html` con doble clic en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).
2. **Con servidor local (Recomendado)**:
   - Si tienes Python:
     ```bash
     python -m http.server 8000
     ```
     Luego visita `http://localhost:8000` en tu navegador.
   - O usando la extensión **Live Server** de VS Code.

---

## 🧪 Suite de Testing Automatizado

El proyecto cuenta con un sistema completo de **Testing Automatizado** sin dependencias externas ni compiladores:

1. **Dashboard Visual Interactivo en el Navegador**:
   - Abre directamente el archivo `tests/index.html` con doble clic en cualquier navegador web.
   - Ejecuta en tiempo real todas las suites de pruebas unitarias y de integración:
     - 🛡️ **Seguridad Defensiva (`security.spec.js`)**: Prevención de XSS (`escapeHTML`), sanitización de URLs y texto, control de frecuencia (*Rate Limiting*) y validación de integridad anti-tampering del carrito.
     - 🛒 **Carrito de Compras (`carrito.spec.js`)**: Adición, cálculo de totales en COP, actualización de cantidades, remoción automática, persistencia en `localStorage` y apertura/cierre accesible del Drawer.
     - 💬 **Integración WhatsApp (`whatsapp.spec.js`)**: Validación de formato internacional colombiano (`+57`), codificación URI y mensajes estructurados para servicios y pedidos.
     - 🔍 **Búsqueda y Filtros (`filtros.spec.js`)**: Búsqueda multicriterio, filtros por categoría, rango de precio, marca y algoritmos de ordenamiento nativos.
     - 📋 **Formulario de Contacto (`formulario.spec.js`)**: Validación de email RFC, formato de teléfono colombiano móvil/fijo y trampa honeypot anti-spam.
     - 📦 **Integridad de Datos (`data.spec.js`)**: Verificación de IDs únicos, existencia de imágenes locales y esquema de 16 productos y 12 servicios técnicos.
     - 🎨 **Componentes UI y Accesibilidad (`ui-components.spec.js` & `integrity.spec.js`)**: Modales accesibles (WCAG 2.2 AA), alternador de tema claro/oscuro, acordeón FAQ y atributos `alt` en imágenes.

2. **Ejecución desde Consola / CI (PowerShell)**:
   - Puedes ejecutar la suite completa desde la terminal ejecutando:
     ```powershell
     powershell -ExecutionPolicy Bypass -File tests\run-tests.ps1
     ```
   - Valida la integridad estática de los 6 documentos HTML, etiquetas SEO, metadatos estructurados JSON-LD, archivos CSS/JS/imágenes y ejecuta Microsoft Edge en modo headless.

---

## ⚙️ Guía de Personalización Comercial

Antes de publicar en producción, personaliza los siguientes archivos:

1. **Número de WhatsApp y Nombre del Negocio**:
   - Edita `assets/js/whatsapp.js`:
     ```javascript
     const WHATSAPP_CONFIG = {
       phone: "573001234567", // Tu número comercial real de Colombia
       businessName: "TecnoFix Colombia"
     };
     ```
2. **Productos y Precios**:
   - Edita `assets/js/productos-data.js` para añadir, modificar o quitar productos, precios en COP o estado de inventario (`"disponible"`, `"consultar"` o `"agotado"`).
3. **Servicios y Precios Base**:
   - Edita `assets/js/servicios.js` para adaptar los 12 servicios, tareas incluidas y precios de referencia.
4. **Datos de Contacto y Dirección**:
   - Modifica los textos de cabecera y pie de página en los archivos `.html` con tu dirección física, horarios de atención y correo electrónico.

---

## 📄 Licencia y Tratamiento de Datos

Proyecto desarrollado conforme a las directrices de diseño web accesible y la Ley Estatutaria 1581 de 2012 de Colombia sobre protección y tratamiento de datos personales.
