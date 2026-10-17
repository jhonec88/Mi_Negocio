# Especificación técnica frontend — Servicio técnico y tienda tecnológica

**Versión:** 1.0  
**Fecha:** 17 de octubre de 2026  
**Tipo:** Sitio web comercial y catálogo digital  
**Especialidad:** UI/UX y desarrollo responsive  
**Mercado objetivo:** Colombia  
**Tecnologías permitidas:** HTML5, CSS3 y JavaScript puro (ES6+)

> **Alcance estricto:** Proyecto exclusivamente frontend, sin backend, bases de datos, frameworks (React, Vue, Angular), bibliotecas de estilos (Bootstrap, Tailwind), autenticación ni pagos en línea.

## 1. Análisis de referencias

### iFixit — https://es.ifixit.com/
- Referencia para clasificar dispositivos, reparaciones, herramientas y repuestos.
- **Aplicación:** fichas de servicios, imágenes y explicaciones técnicas comprensibles.

### Micro Center — https://www.microcenter.com/
- Referencia para catálogo de computadores, componentes, periféricos y servicios.
- **Aplicación:** navegación por categorías, fichas técnicas, precios y consultas.

**Conclusión:** combinar una web de servicios técnicos que transmita confianza con un catálogo tecnológico que facilite la consulta por WhatsApp. Las referencias son inspiración de patrones, no diseños para copiar.

## 2. Objetivos

**General:** Crear un sitio web comercial, rápido, accesible y responsive que promocione servicios de reparación y mantenimiento de computadores, exhiba productos tecnológicos y facilite el contacto con clientes.

**Específicos:**
1. Promocionar reparación, mantenimiento, diagnóstico y actualización de equipos.
2. Mostrar catálogo con imágenes, precios en COP y especificaciones.
3. Facilitar cotizaciones por WhatsApp.
4. Transmitir confianza con información profesional y trabajos realizados.
5. Optimizar navegación móvil, accesibilidad, SEO y rendimiento.
6. Mantener toda la interactividad con JavaScript nativo.

## 3. Identidad visual UI

**Concepto:** tecnológico, profesional, moderno, minimalista y confiable.

| Uso | Color | HEX |
|---|---|---|
| Primario | Azul tecnológico | `#2563EB` |
| Secundario | Azul oscuro | `#0F172A` |
| Acento | Cian | `#06B6D4` |
| Fondo principal | Blanco | `#FFFFFF` |
| Fondo secundario | Gris claro | `#F8FAFC` |
| Texto principal | Gris oscuro | `#1E293B` |
| Texto secundario | Gris medio | `#64748B` |
| Éxito | Verde | `#16A34A` |
| Error | Rojo | `#DC2626` |

Tipografía recomendada, sin dependencias externas:

```css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Arial, sans-serif;
  line-height: 1.5;
}
```

| Elemento | Escritorio | Móvil |
|---|---:|---:|
| H1 | 48 px | 32 px |
| H2 | 36 px | 26 px |
| H3 | 24 px | 20 px |
| Texto general | 16 px | 16 px |
| Texto secundario | 14 px | 14 px |
| Botones | 16 px | 16 px |

Usar azul para acciones principales y verde para acciones de WhatsApp. Garantizar contraste adecuado.

## 4. Arquitectura de información

| Sección | Objetivo | Contenido y funciones |
|---|---|---|
| Inicio | Presentación comercial | Hero, servicios y productos destacados, CTA |
| Servicios | Soluciones técnicas | Tarjetas, detalles y cotización |
| Productos | Catálogo digital | Búsqueda, filtros, orden y ficha |
| Nosotros | Confianza | Perfil, experiencia, valores, galería |
| Preguntas frecuentes | Resolver dudas | Acordeón accesible |
| Contacto | Captación | Datos comerciales, formulario y WhatsApp |

Menú consistente en todas las páginas, con indicador de sección activa.

## 5. Página de inicio

### 5.1. Encabezado
- Logotipo y nombre comercial.
- Navegación: Inicio, Servicios, Productos, Nosotros, Contacto.
- CTA de WhatsApp.
- Menú hamburguesa en móviles; encabezado sticky y navegación por teclado.

### 5.2. Hero
**Título sugerido:** Soluciones tecnológicas para tu día a día.

**Descripción:** Servicio profesional de reparación, mantenimiento y optimización de computadores. También encontrarás equipos, accesorios y productos tecnológicos para tus necesidades.

**Acciones:** «Solicitar servicio técnico» y «Explorar productos».

Diseño en dos columnas en escritorio: texto/acciones e imagen profesional; una columna en móvil.

## 6. Módulo de servicios técnicos

| Servicio | Descripción |
|---|---|
| Mantenimiento preventivo | Limpieza, revisión y optimización |
| Mantenimiento correctivo | Diagnóstico y solución de fallas |
| Reparación de portátiles | Revisión y sustitución de componentes |
| Reparación de escritorio | Diagnóstico y reparación de hardware |
| Sistemas operativos | Instalación y configuración de Windows o Linux |
| Eliminación de malware | Revisión y eliminación de software malicioso |
| Actualización de hardware | SSD, RAM y otros componentes |
| Recuperación de información | Evaluación y recuperación cuando sea posible |
| Instalación de programas | Software autorizado y configuración |
| Configuración de redes | Redes domésticas y empresariales |
| Soporte remoto | Asistencia a distancia |
| Asesoría tecnológica | Orientación de compra o actualización |

Cada tarjeta incluirá imagen o icono, nombre, descripción, beneficios, «Ver detalles» y «Solicitar servicio». El detalle podrá mostrarse en modal accesible con descripción, equipos compatibles, tareas incluidas y CTA. El modal deberá cerrar con botón y Escape y gestionar correctamente el foco.

## 7. Catálogo de productos

**Categorías iniciales:** portátiles, computadores de escritorio, SSD y almacenamiento, memorias RAM, teclados y mouse, monitores, impresoras y accesorios, equipos de redes, cables/adaptadores y otros accesorios tecnológicos.

### Tarjeta de producto
- Fotografía, nombre, marca y modelo.
- Categoría, descripción breve y precio en pesos colombianos.
- Disponibilidad: disponible, agotado o consultar.
- Acciones «Ver detalles» y «Consultar por WhatsApp».

### Funciones
- Búsqueda por nombre, marca, modelo, categoría y palabras clave.
- Filtros por categoría, marca, rango de precio y disponibilidad.
- Orden por precio ascendente/descendente y nombre A–Z/Z–A.
- Vista detallada con galería, especificaciones, precio y CTA.
- Estado vacío con mensaje claro cuando no haya coincidencias.

**Nota:** precios y disponibilidad son informativos; no se sincronizan en tiempo real sin backend.

## 8. WhatsApp

Botón flotante visible, accesible y no intrusivo en todas las páginas. Cada servicio o producto generará un mensaje contextual.

**Ejemplo de producto:** «Hola, estoy interesado en el SSD Kingston de 480 GB que aparece en su página web. ¿Me pueden confirmar precio y disponibilidad?»

**Ejemplo de servicio:** «Hola, necesito solicitar mantenimiento preventivo para mi computador portátil. Quisiera conocer el procedimiento y el costo aproximado».

```javascript
const numeroWhatsApp = "573001234567"; // Sustituir por número real
function contactarWhatsApp(mensaje) {
  const texto = encodeURIComponent(mensaje);
  const url = `https://wa.me/${numeroWhatsApp}?text=${texto}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
```

La función **abre** WhatsApp con un mensaje preparado; no lo envía automáticamente ni confirma su recepción.

## 9. Contacto

Mostrar nombre comercial, teléfono, WhatsApp, correo, municipio, dirección si aplica, horarios y enlace a ubicación.

| Campo | Tipo | Obligatorio |
|---|---|---|
| Nombre completo | Texto | Sí |
| Teléfono | Teléfono | Sí |
| Correo | Email | No |
| Tipo de solicitud | Selector | Sí |
| Descripción | Texto largo | Sí |
| Aceptación de privacidad | Checkbox | Sí |

Validar campos obligatorios, formato de correo/teléfono, longitud de mensaje y aceptación de privacidad. Tras validar, preparar mensaje de WhatsApp. **No afirmar que se envió o almacenó la solicitud**.

## 10. Sobre nosotros

Presentación del técnico, experiencia, especialidades (diagnóstico, reparación, mantenimiento, hardware, software y asesoría), valores (responsabilidad, transparencia, atención personalizada, profesionalismo) y galería real de trabajos. Publicar fotografías con autorización y sin datos privados de clientes.

## 11. Preguntas frecuentes

Acordeón accesible con preguntas como:
- ¿Realizan mantenimiento de portátiles?
- ¿Puedo solicitar cotización por WhatsApp?
- ¿Venden SSD y memorias RAM?
- ¿Ofrecen soporte remoto?
- ¿Cuánto cuesta reparar un computador?

Las respuestas deben reflejar los servicios y condiciones reales del negocio.

## 12. Experiencia de usuario UX

| Perfil | Necesidad | Solución |
|---|---|---|
| Particular | Reparar equipo | Acceso rápido a servicios |
| Estudiante/profesional | Mejorar equipo | Guías de actualización |
| Comprador | Comprar tecnología | Catálogo filtrable |

**Flujo reparación:** Inicio → Servicios → Servicio específico → Información → Cotización → WhatsApp.

**Flujo compra:** Inicio → Productos → Búsqueda/filtros → Ficha → Consulta → WhatsApp.

**Principios:** claridad, consistencia, feedback, prevención de errores, accesibilidad y mobile-first.

## 13. Responsive

| Dispositivo | Referencia | Columnas de catálogo |
|---|---|---:|
| Móvil pequeño | 320–374 px | 1 |
| Móvil | 375–767 px | 1 |
| Tableta | 768–1023 px | 2 |
| Portátil | 1024–1439 px | 3 |
| Escritorio grande | ≥1440 px | 3–4 |

Son referencias ajustables al contenido, no límites rígidos. Usar menú móvil, imágenes fluidas, botones táctiles, formularios de ancho completo y evitar desbordamiento horizontal.

```css
.productos-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}
@media (max-width: 1023px) {
  .productos-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  .productos-grid { grid-template-columns: 1fr; }
}
```

## 14. Funcionalidades JavaScript

| Función | Implementación |
|---|---|
| Menú móvil | Eventos DOM |
| Búsqueda y filtros | Filtrado de arreglo de productos |
| Ordenamiento | Métodos nativos de arrays |
| Detalles de productos/servicios | Modal accesible |
| Galería | Cambio de imágenes |
| Formulario | Validación y mensaje contextual |
| WhatsApp | URL con texto codificado |
| FAQ | Acordeón |
| Volver arriba | Navegación/scroll |
| Tema oscuro opcional | CSS y preferencia local |

Sin librerías externas.

## 15. Datos del catálogo sin backend

Guardar el catálogo en un archivo JS local:

```javascript
const productos = [
  {
    id: 1,
    nombre: "SSD Kingston 480 GB",
    marca: "Kingston",
    categoria: "Almacenamiento",
    precio: 145000,
    disponible: true,
    imagen: "assets/images/productos/ssd-kingston.webp",
    descripcion: "Unidad SSD SATA III",
    especificaciones: {
      capacidad: "480 GB",
      interfaz: "SATA III",
      formato: "2.5 pulgadas"
    }
  },
  {
    id: 2,
    nombre: "Memoria RAM DDR4 8 GB",
    marca: "Kingston",
    categoria: "Memorias RAM",
    precio: 95000,
    disponible: true,
    imagen: "assets/images/productos/ram-ddr4.webp",
    descripcion: "Memoria RAM DDR4 de 8 GB",
    especificaciones: { capacidad: "8 GB", tipo: "DDR4" }
  }
];
```

*Datos y precios exclusivamente ilustrativos.* Actualizar productos, precios y existencias manualmente en el archivo fuente. Cambios en el navegador no modifican el catálogo publicado.

## 16. Estructura del proyecto

```text
tech-service/
├── index.html
├── servicios.html
├── productos.html
├── nosotros.html
├── preguntas-frecuentes.html
├── contacto.html
├── assets/
│   ├── css/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── menu.js
│   │   ├── productos-data.js
│   │   ├── productos.js
│   │   ├── filtros.js
│   │   ├── servicios.js
│   │   ├── modal.js
│   │   ├── whatsapp.js
│   │   ├── formulario.js
│   │   └── faq.js
│   ├── images/
│   │   ├── logo/
│   │   ├── servicios/
│   │   ├── productos/
│   │   ├── banners/
│   │   └── galeria/
│   └── icons/
├── favicon.ico
└── README.md
```

HTML para estructura semántica, CSS para estilos y JavaScript para datos e interacción.

## 17. Accesibilidad

**Objetivo:** WCAG 2.2 AA en los criterios aplicables. Incluir HTML semántico, alternativas textuales, contraste, navegación con teclado, foco visible, etiquetas de formulario, errores comprensibles, controles táctiles adecuados, respeto a `prefers-reduced-motion` y gestión del foco en modales.

## 18. Rendimiento

| Indicador | Objetivo |
|---|---:|
| LCP | ≤2,5 s |
| INP | ≤200 ms |
| CLS | ≤0,1 |
| Lighthouse Performance | ≥90 |
| Lighthouse Accessibility | ≥90 |
| Lighthouse SEO | ≥90 |

**Medidas:** WebP/AVIF, dimensiones de imágenes, lazy loading para imágenes secundarias, `defer` en scripts pertinentes, CSS liviano, reducción de animaciones y caché si el alojamiento lo permite. Son metas a comprobar, no garantías.

## 19. SEO

Un H1 por página, jerarquía de encabezados, títulos y metadescripciones únicas, URLs descriptivas, textos alternativos, compatibilidad móvil, Open Graph y datos estructurados pertinentes y verificables.

**Título ejemplo:** Reparación y mantenimiento de computadores | [Nombre del negocio].

**Descripción ejemplo:** Servicio técnico de computadores portátiles y de escritorio. Mantenimiento, reparación, instalación de SSD, memorias RAM y venta de accesorios tecnológicos.

Incorporar ubicación real para SEO local.

## 20. Seguridad y privacidad

- Evitar insertar texto no confiable con `innerHTML`; preferir `textContent`.
- Validar datos de formulario y no exponer credenciales en JavaScript.
- No almacenar contraseñas ni datos personales innecesarios en `localStorage`.
- Evitar scripts externos innecesarios y publicar mediante HTTPS.
- Mostrar información de tratamiento de datos personales.
- No presentar el frontend como sistema seguro de almacenamiento de clientes.

## 21. Requisitos funcionales

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | Mostrar inicio | Alta |
| RF-02 | Navegación entre páginas | Alta |
| RF-03 | Listar servicios | Alta |
| RF-04 | Mostrar detalle de servicio | Alta |
| RF-05 | Mostrar catálogo | Alta |
| RF-06 | Buscar productos | Alta |
| RF-07 | Filtrar categorías | Alta |
| RF-08 | Ordenar por precio | Media |
| RF-09 | Ver ficha de producto | Alta |
| RF-10 | Contactar por WhatsApp | Alta |
| RF-11 | Preparar cotización | Alta |
| RF-12 | Validar contacto | Alta |
| RF-13 | FAQ interactiva | Media |
| RF-14 | Galería de trabajos | Media |
| RF-15 | Tema oscuro | Baja |
| RF-16 | Responsive | Alta |

## 22. Requisitos no funcionales

| ID | Requisito | Criterio |
|---|---|---|
| RNF-01 | Rendimiento | Carga optimizada |
| RNF-02 | Responsive | Adaptación multidispositivo |
| RNF-03 | Accesibilidad | Objetivo WCAG 2.2 AA |
| RNF-04 | Compatibilidad | Navegadores modernos |
| RNF-05 | Mantenibilidad | Código modular |
| RNF-06 | Escalabilidad visual | Componentes reutilizables |
| RNF-07 | Usabilidad | Navegación clara |
| RNF-08 | SEO | Semántica y metadatos |
| RNF-09 | Seguridad | Buenas prácticas frontend |
| RNF-10 | Independencia | Sin frameworks |

## 23. Criterios de aceptación

- Inicio visible y bien distribuido en escritorio y móvil.
- Navegación funcional sin desbordamiento horizontal.
- Servicio abre su detalle correspondiente.
- Búsqueda, filtros y ordenamiento producen resultados correctos.
- Ficha muestra características completas del producto.
- WhatsApp abre mensaje contextual correcto.
- Formulario valida y prepara mensaje, sin afirmar envío automático.
- Sitio utilizable con teclado; foco y modales accesibles.
- Preferencias de movimiento reducido respetadas.
- Búsquedas sin coincidencias muestran un estado vacío útil.

## 24. Funciones diferenciales opcionales

### A. Diagnóstico orientativo
**«¿Qué problema tiene tu computador?»** Opciones: lento, no enciende, se apaga, se calienta, no reconoce disco, falla de internet. Mostrar consejos orientativos y CTA para revisión; **no sustituye diagnóstico profesional**.

### B. Antes y después
Galería con comparador interactivo de limpieza, cambio de HDD a SSD, refrigeración y restauración, con imágenes autorizadas.

### C. Recomendador de actualizaciones
Preguntar tipo de equipo, uso, problema y presupuesto; ofrecer sugerencias orientativas de SSD/RAM/servicio, sin prometer compatibilidad sin verificar modelo.

## 25. Fases

| Fase | Actividad | Entregable |
|---|---|---|
| 1 | Diseño UI/UX | Estructura y propuesta visual |
| 2 | Maquetación HTML | Páginas semánticas |
| 3 | CSS y responsive | Interfaz adaptable |
| 4 | JavaScript | Catálogo y componentes interactivos |
| 5 | Integración comercial | Consultas por WhatsApp |
| 6 | Optimización | Rendimiento, accesibilidad y SEO |
| 7 | Pruebas | Versión validada |

## 26. Alcance y exclusiones

**Incluido:** HTML5, CSS3, JS puro, UI/UX, catálogo, búsqueda, filtros, modales, presentación de servicios, WhatsApp, validación, responsive, SEO básico, accesibilidad y animaciones ligeras.

**Excluido:** backend, bases de datos, administración remota de inventario, cuentas de usuario, pagos, pedidos procesados en servidor, inventario en tiempo real, envío automático de emails y almacenamiento de solicitudes.

## 27. Recomendación final

Presentar desde el inicio **dos rutas comerciales** igualmente visibles:

1. **«Necesito reparar mi computador»** → Servicios → Información → Cotización → WhatsApp.
2. **«Quiero comprar un producto tecnológico»** → Catálogo → Filtros → Ficha → WhatsApp.

Esta diferenciación permite atender a usuarios con necesidades distintas y convierte la web en una vitrina comercial profesional sin complejidad de servidor.

### Datos pendientes para personalizar
1. Nombre comercial.
2. Municipio o cobertura de atención.
3. Modalidad: local, domicilio, remoto o combinación.
4. Preferencia visual: tema claro o oscuro.

---

**Documento de especificación:** define el diseño y comportamiento esperado; no implica que el sitio web esté desarrollado o publicado.
