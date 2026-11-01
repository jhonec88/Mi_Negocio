# Especificación Técnica Frontend UI/UX

## Plataforma web para servicios técnicos informáticos y venta de productos tecnológicos

**Versión:** 1.0  
**Tipo de proyecto:** Sitio web comercial y catálogo digital  
**Arquitectura:** Frontend estático  
**Especialidad:** Diseño UI/UX y desarrollo web responsive  
**Tecnologías permitidas:** HTML5, CSS3 y JavaScript ES6+  
**Mercado objetivo:** Colombia

---

## 1. Alcance tecnológico

El proyecto se desarrollará exclusivamente con tecnologías web base:

- HTML5 para estructura y semántica.
- CSS3 para diseño visual, componentes, animaciones y responsive design.
- JavaScript puro (Vanilla JS) para interactividad y manipulación del DOM.

No se utilizarán React, Angular, Vue, Bootstrap, Tailwind, backend, bases de datos, autenticación ni pasarelas de pago.

---

## 2. Modelo de negocio

El sitio combinará dos líneas principales:

1. **Servicios técnicos:** reparación, diagnóstico, mantenimiento y optimización de computadores.
2. **Venta de tecnología:** catálogo de computadores, componentes, periféricos, accesorios y otros productos tecnológicos.

La estrategia recomendada es un **sitio comercial con catálogo interactivo y ventas asistidas mediante WhatsApp**, evitando inicialmente la complejidad de un comercio electrónico completo.

---

## 3. Referencias de diseño y experiencia

Como referencias conceptuales se consideran sitios del sector como **iFixit**, por su enfoque en reparación, dispositivos y componentes, y **Micro Center**, por la integración de catálogo tecnológico, categorías y servicios.

La propuesta debe adoptar las mejores prácticas de este tipo de sitios: navegación clara, categorías reconocibles, fotografías de calidad, fichas de productos, información técnica comprensible, llamadas a la acción visibles y acceso rápido al soporte.

---

## 4. Objetivo general

Diseñar y desarrollar una interfaz web comercial, moderna, responsive, accesible y rápida que permita presentar servicios profesionales de reparación y mantenimiento de computadores, exhibir productos tecnológicos y facilitar la comunicación con potenciales clientes.

### Objetivos específicos

- Promocionar servicios de reparación y mantenimiento.
- Presentar un catálogo digital de productos tecnológicos.
- Facilitar solicitudes de cotización mediante WhatsApp.
- Generar confianza mediante información profesional.
- Ofrecer navegación sencilla en computador, tableta y celular.
- Implementar interacciones dinámicas sin frameworks.
- Optimizar rendimiento, SEO y accesibilidad.
- Construir una identidad visual moderna y tecnológica.

---

## 5. Identidad visual UI

### Concepto

La interfaz transmitirá profesionalismo, confianza, innovación, seguridad, claridad y cercanía.

Se evitarán diseños sobrecargados y animaciones innecesarias.

### Paleta propuesta

| Elemento | Color | HEX |
|---|---|---|
| Principal | Azul tecnológico | `#2563EB` |
| Secundario | Azul oscuro | `#0F172A` |
| Acento | Cian | `#06B6D4` |
| Fondo principal | Blanco | `#FFFFFF` |
| Fondo secundario | Gris claro | `#F8FAFC` |
| Texto principal | Gris oscuro | `#1E293B` |
| Texto secundario | Gris medio | `#64748B` |
| Éxito | Verde | `#16A34A` |
| Error | Rojo | `#DC2626` |

El azul se utilizará para acciones principales y el verde principalmente para WhatsApp o estados positivos.

### Tipografía

Se recomienda utilizar fuentes del sistema:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont,
             "Segoe UI", Arial, sans-serif;
```

Jerarquía aproximada:

| Elemento | Escritorio | Móvil |
|---|---:|---:|
| H1 | 48 px | 32 px |
| H2 | 36 px | 26 px |
| H3 | 24 px | 20 px |
| Texto | 16 px | 16 px |
| Secundario | 14 px | 14 px |
| Botones | 16 px | 16 px |

---

## 6. Arquitectura de información

El sitio contará con las siguientes áreas principales:

| Sección | Objetivo |
|---|---|
| Inicio | Presentar el negocio, servicios y productos destacados |
| Servicios | Mostrar soluciones de reparación y mantenimiento |
| Productos | Exhibir el catálogo tecnológico |
| Nosotros | Generar confianza y presentar experiencia |
| Preguntas frecuentes | Resolver dudas comunes |
| Contacto | Facilitar cotizaciones y comunicación |

---

## 7. Página de inicio

### Header

Incluirá:

- Logotipo.
- Nombre comercial.
- Inicio.
- Servicios.
- Productos.
- Nosotros.
- Contacto.
- Botón de WhatsApp.
- Menú hamburguesa en móviles.

El encabezado podrá utilizar comportamiento `sticky` y deberá ser accesible mediante teclado.

### Hero

Mensaje principal sugerido:

> **Soluciones tecnológicas para tu día a día**

Descripción:

> Servicio profesional de reparación, mantenimiento y optimización de computadores. También encontrarás equipos, accesorios y productos tecnológicos para tus necesidades.

Llamadas a la acción:

- **Solicitar servicio técnico**
- **Explorar productos**

En escritorio se utilizará una composición de dos columnas y en móvil una distribución vertical.

---

## 8. Módulo de servicios técnicos

Servicios iniciales:

- Mantenimiento preventivo.
- Mantenimiento correctivo.
- Reparación de portátiles.
- Reparación de computadores de escritorio.
- Instalación de sistemas operativos.
- Eliminación de malware.
- Actualización de hardware.
- Recuperación de información.
- Instalación y configuración de software autorizado.
- Configuración de redes.
- Soporte remoto.
- Asesoría tecnológica.

### Tarjetas de servicio

Cada tarjeta tendrá:

- Icono o fotografía.
- Nombre.
- Descripción breve.
- Beneficios.
- Botón **Ver detalles**.
- Botón **Solicitar servicio**.

Los detalles podrán abrirse mediante un modal accesible controlado con JavaScript. El modal deberá cerrarse mediante botón, tecla Escape y controles adecuados de foco.

---

## 9. Catálogo de productos

### Categorías iniciales

- Computadores portátiles.
- Computadores de escritorio.
- SSD y almacenamiento.
- Memorias RAM.
- Teclados y mouse.
- Monitores.
- Impresoras y accesorios.
- Equipos de redes.
- Cables y adaptadores.
- Accesorios tecnológicos.

### Tarjeta de producto

Cada producto mostrará:

- Fotografía.
- Marca y modelo.
- Categoría.
- Descripción breve.
- Precio en COP.
- Estado de disponibilidad.
- Botón **Ver detalles**.
- Botón **Consultar por WhatsApp**.

### Funcionalidades

**Buscador dinámico:** búsqueda por nombre, marca, modelo, categoría o palabra clave.

**Filtros:** categoría, marca, rango de precio y disponibilidad.

**Ordenamiento:** precio ascendente/descendente y nombre A-Z/Z-A.

**Vista detallada:** galería, marca, modelo, especificaciones, precio, disponibilidad, descripción y contacto.

**Estado vacío:** se mostrará un mensaje útil cuando no existan coincidencias.

---

## 10. Integración con WhatsApp

WhatsApp funcionará como canal comercial principal mediante enlaces de apertura de conversación.

### Botón flotante

- Ubicado en la parte inferior derecha.
- Visible en todas las páginas.
- Accesible y responsive.
- Sin bloquear otros controles.

### Mensajes personalizados

Ejemplo para producto:

> Hola, estoy interesado en el SSD Kingston de 480 GB que aparece en su página web. ¿Me pueden confirmar precio y disponibilidad?

Ejemplo para servicio:

> Hola, necesito solicitar un servicio de mantenimiento preventivo para mi computador portátil. Quisiera conocer el procedimiento y el costo aproximado.

### JavaScript de referencia

```javascript
const numeroWhatsApp = "573001234567";

function contactarWhatsApp(mensaje) {
    const texto = encodeURIComponent(mensaje);
    const url = `https://wa.me/${numeroWhatsApp}?text=${texto}`;
    window.open(url, "_blank", "noopener,noreferrer");
}
```

El número deberá sustituirse por el número comercial real.

---

## 11. Contacto

Información a mostrar:

- Nombre comercial.
- Teléfono.
- WhatsApp.
- Correo.
- Municipio y departamento.
- Dirección, si aplica.
- Horarios.
- Enlace de ubicación, si aplica.

### Formulario

Campos:

- Nombre completo — obligatorio.
- Teléfono — obligatorio.
- Correo electrónico — opcional.
- Tipo de solicitud — obligatorio.
- Descripción — obligatorio.
- Aceptación de privacidad — obligatoria.

JavaScript validará campos requeridos, email, teléfono, longitud del mensaje y aceptación de privacidad.

Al no existir backend, el formulario podrá generar un mensaje estructurado y abrir WhatsApp para que el usuario decida enviarlo.

---

## 12. Sobre nosotros

La sección estará orientada a generar confianza e incluirá:

- Presentación profesional del técnico.
- Experiencia.
- Especialidades.
- Metodología de trabajo.
- Valores del negocio.
- Galería de trabajos realizados.

Especialidades sugeridas:

- Diagnóstico.
- Reparación de hardware.
- Mantenimiento preventivo.
- Optimización.
- Instalación de componentes.
- Asesoría tecnológica.

---

## 13. Preguntas frecuentes

Se utilizará un acordeón interactivo con JavaScript.

Preguntas iniciales:

- ¿Realizan mantenimiento de computadores portátiles?
- ¿Puedo solicitar una cotización por WhatsApp?
- ¿Venden SSD y memorias RAM?
- ¿Ofrecen soporte remoto?
- ¿Cuánto cuesta reparar un computador?

Las respuestas deberán reflejar las condiciones reales del negocio.

---

## 14. Experiencia de usuario UX

### Perfiles principales

| Perfil | Necesidad | Respuesta UX |
|---|---|---|
| Usuario particular | Reparar su computador | Acceso rápido a servicios |
| Estudiante/profesional | Mejorar rendimiento | Actualizaciones y asesoría |
| Comprador | Adquirir tecnología | Catálogo, filtros y precios |

### Flujo de reparación

```text
Inicio → Servicios → Seleccionar servicio → Ver información
       → Solicitar cotización → WhatsApp
```

### Flujo de compra

```text
Inicio → Catálogo → Buscar/filtrar → Ver producto
       → Consultar disponibilidad → WhatsApp
```

### Principios UX

- Claridad.
- Consistencia.
- Retroalimentación.
- Accesibilidad.
- Prevención de errores.
- Diseño mobile-first.

---

## 15. Responsive design

| Dispositivo | Referencia | Distribución |
|---|---:|---|
| Móvil pequeño | 320-374 px | 1 columna |
| Móvil | 375-767 px | 1 columna |
| Tableta | 768-1023 px | 2 columnas |
| Portátil | 1024-1439 px | 3 columnas |
| Escritorio grande | 1440 px+ | 3-4 columnas |

Requisitos:

- Menú hamburguesa.
- Imágenes fluidas.
- Tarjetas flexibles.
- Botones táctiles cómodos.
- Formularios a ancho completo en móvil.
- Sin desplazamiento horizontal accidental.

Ejemplo:

```css
.productos-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
}

@media (max-width: 1023px) {
    .productos-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
    .productos-grid {
        grid-template-columns: 1fr;
    }
}
```

---

## 16. Funcionalidades JavaScript

| Funcionalidad | Descripción |
|---|---|
| Menú móvil | Apertura y cierre |
| Buscador | Filtrado dinámico |
| Filtros | Categorías, marcas, precios, disponibilidad |
| Ordenamiento | Precio y nombre |
| Modal de producto | Información detallada |
| Modal de servicio | Información detallada |
| Galería | Cambio de imágenes |
| Formulario | Validación |
| WhatsApp | Generación de mensajes |
| FAQ | Acordeón |
| Volver arriba | Navegación |
| Tema oscuro | Función opcional |

---

## 17. Gestión de productos sin backend

Los productos podrán mantenerse en un archivo JavaScript:

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
        descripcion: "Unidad de almacenamiento SSD SATA III",
        especificaciones: {
            capacidad: "480 GB",
            interfaz: "SATA III",
            formato: "2.5 pulgadas"
        }
    }
];
```

Los precios son únicamente ilustrativos.

### Ventajas

- No requiere base de datos.
- Permite renderizado dinámico.
- Facilita búsquedas y filtros.
- Puede alojarse como sitio estático.

### Limitaciones

- Precios y disponibilidad se actualizan manualmente.
- Los cambios realizados desde el navegador no modifican el catálogo publicado.
- No existe sincronización de inventario en tiempo real.

---

## 18. Estructura técnica del proyecto

```text
tech-service/
│
├── index.html
├── servicios.html
├── productos.html
├── nosotros.html
├── preguntas-frecuentes.html
├── contacto.html
│
├── assets/
│   ├── css/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── components.css
│   │   └── responsive.css
│   │
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
│   │
│   ├── images/
│   │   ├── logo/
│   │   ├── servicios/
│   │   ├── productos/
│   │   ├── banners/
│   │   └── galeria/
│   │
│   └── icons/
│
├── favicon.ico
└── README.md
```

---

## 19. Accesibilidad

Objetivo: aplicar criterios pertinentes de WCAG 2.2 AA.

- HTML semántico.
- `alt` en imágenes.
- Contraste adecuado.
- Navegación mediante teclado.
- Estados de foco visibles.
- Etiquetas en formularios.
- Errores comprensibles.
- Áreas táctiles adecuadas.
- Respeto de `prefers-reduced-motion`.
- Gestión de foco en modales.
- No depender únicamente del color.

---

## 20. Rendimiento

Objetivos técnicos:

| Métrica | Objetivo |
|---|---:|
| LCP | ≤ 2,5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0,1 |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 90 |
| Lighthouse SEO | ≥ 90 |

Estrategias:

- WebP/AVIF.
- Dimensiones explícitas de imágenes.
- Lazy loading.
- JavaScript con `defer` cuando corresponda.
- CSS optimizado.
- Evitar recursos innecesarios.
- Animaciones ligeras.
- Caché cuando el hosting lo permita.

---

## 21. SEO

Requisitos:

- Un H1 principal por página.
- Jerarquía correcta de encabezados.
- Títulos descriptivos.
- Metadescripciones.
- URLs comprensibles.
- Contenido relevante.
- `alt` descriptivos.
- Diseño móvil.
- Open Graph.
- Datos estructurados cuando sean aplicables y verificables.

Título sugerido:

> **Reparación y mantenimiento de computadores | [Nombre del negocio]**

Descripción sugerida:

> Servicio técnico de computadores portátiles y de escritorio. Mantenimiento, reparación, instalación de SSD, memorias RAM y venta de accesorios tecnológicos.

---

## 22. Seguridad y privacidad frontend

- Evitar `innerHTML` para contenido no confiable.
- Preferir `textContent` para texto dinámico.
- Validar formularios.
- No almacenar contraseñas.
- No exponer credenciales en JavaScript.
- Evitar almacenar datos personales innecesarios en `localStorage`.
- Utilizar HTTPS en producción.
- Incluir información sobre tratamiento de datos personales.

---

## 23. Requisitos funcionales

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | Mostrar página de inicio | Alta |
| RF-02 | Navegar entre secciones | Alta |
| RF-03 | Visualizar servicios | Alta |
| RF-04 | Consultar detalles de servicios | Alta |
| RF-05 | Visualizar catálogo | Alta |
| RF-06 | Buscar productos | Alta |
| RF-07 | Filtrar productos | Alta |
| RF-08 | Ordenar productos | Media |
| RF-09 | Visualizar detalles | Alta |
| RF-10 | Contactar mediante WhatsApp | Alta |
| RF-11 | Generar solicitudes de cotización | Alta |
| RF-12 | Validar formulario | Alta |
| RF-13 | Mostrar FAQ | Media |
| RF-14 | Mostrar galería | Media |
| RF-15 | Tema oscuro | Baja |
| RF-16 | Diseño responsive | Alta |

---

## 24. Requisitos no funcionales

| ID | Requisito | Descripción |
|---|---|---|
| RNF-01 | Rendimiento | Carga optimizada |
| RNF-02 | Responsive | Diferentes pantallas |
| RNF-03 | Accesibilidad | Objetivo WCAG 2.2 AA |
| RNF-04 | Compatibilidad | Navegadores modernos |
| RNF-05 | Mantenibilidad | Código modular |
| RNF-06 | Escalabilidad visual | Componentes reutilizables |
| RNF-07 | Usabilidad | Navegación sencilla |
| RNF-08 | SEO | Estructura optimizada |
| RNF-09 | Seguridad | Buenas prácticas frontend |
| RNF-10 | Independencia | Sin frameworks |

---

## 25. Criterios de aceptación

| Prueba | Resultado esperado |
|---|---|
| Abrir en computador | Interfaz correctamente distribuida |
| Abrir en celular | Diseño adaptado sin desbordamiento |
| Seleccionar servicio | Información correspondiente |
| Buscar producto | Resultados filtrados |
| Filtrar categoría | Productos correspondientes |
| Ordenar precio | Orden correcto |
| Ver producto | Información completa |
| Pulsar WhatsApp | Conversación con mensaje preparado |
| Usar formulario | Validación correcta |
| Navegar con teclado | Controles utilizables |
| Reducir movimiento | Preferencia respetada |
| Búsqueda sin coincidencias | Mensaje de estado vacío |

---

## 26. Funciones diferenciales recomendadas

### 26.1 Diagnóstico orientativo

Sección **¿Qué problema tiene tu computador?** con opciones como:

- Está lento.
- No enciende.
- Se apaga.
- Se calienta demasiado.
- No reconoce el disco.
- No se conecta a Internet.

JavaScript mostrará orientación general y recomendará evaluación técnica. No se presentará como diagnóstico definitivo.

### 26.2 Antes y después

Galería comparativa para mostrar mantenimientos, limpiezas, actualizaciones de HDD a SSD y otros trabajos reales.

### 26.3 Recomendador de actualizaciones

El usuario podrá indicar tipo de equipo, uso, problema y presupuesto aproximado. El frontend mostrará sugerencias orientativas sobre SSD, RAM u otras mejoras, sujetas a verificación de compatibilidad.

---

## 27. Fases de desarrollo

| Fase | Actividades | Entregable |
|---|---|---|
| 1 | Diseño UI/UX | Propuesta visual |
| 2 | Maquetación HTML | Estructura navegable |
| 3 | CSS | Diseño visual responsive |
| 4 | JavaScript | Interactividad |
| 5 | Integración comercial | WhatsApp y catálogo |
| 6 | Optimización | Rendimiento, accesibilidad y SEO |
| 7 | Pruebas | Versión final |

---

## 28. Incluido y excluido

### Incluido

- Diseño UI/UX.
- HTML5.
- CSS3.
- JavaScript puro.
- Catálogo interactivo.
- Buscador y filtros.
- Servicios.
- WhatsApp.
- Formularios con validación.
- Responsive design.
- SEO básico.
- Accesibilidad.
- Animaciones ligeras.

### No incluido

- Backend.
- Bases de datos.
- Panel administrativo conectado a servidor.
- Registro/inicio de sesión.
- Pasarelas de pago.
- Procesamiento de pedidos.
- Inventario en tiempo real.
- Envío automático de correos.
- Almacenamiento de solicitudes en servidor.

---

## 29. Recomendación de estrategia UI/UX

La página de inicio debe ofrecer dos rutas comerciales claramente diferenciadas:

### Ruta 1: Necesito reparar mi computador

Dirige hacia servicios, explicación del proceso y solicitud de cotización.

### Ruta 2: Quiero comprar un producto tecnológico

Dirige hacia catálogo, filtros, especificaciones, precio y consulta de disponibilidad.

Esta separación reduce fricción porque un cliente de reparación busca confianza y rapidez, mientras que un comprador necesita comparar productos y características.

---

## 30. Resultado esperado

El producto final será una **vitrina comercial digital** para el técnico, capaz de:

- Presentar profesionalmente el negocio.
- Promocionar servicios.
- Mostrar productos tecnológicos.
- Generar solicitudes de cotización.
- Facilitar el contacto mediante WhatsApp.
- Funcionar correctamente en computadores, tabletas y celulares.
- Mantener una arquitectura sencilla y ampliable usando únicamente HTML, CSS y JavaScript.

### Datos que deberán personalizarse antes de producción

1. Nombre comercial.
2. Logotipo.
3. Municipio y zona de cobertura.
4. Número de WhatsApp.
5. Teléfono y correo.
6. Horarios.
7. Modalidad de atención: local, domicilio, remoto o combinada.
8. Productos reales, fotografías y precios.
9. Servicios reales y condiciones.
10. Política de tratamiento de datos.

---

**Documento:** Especificación Técnica Frontend UI/UX  
**Tecnologías:** HTML5 + CSS3 + JavaScript puro
