# Guía de Arquitectura e Implementación de Open Graph y Metadatos para Redes Sociales

**Proyecto:** TecnoFix Colombia — Servicio Técnico Especializado y Tienda Tecnológica  
**Tecnologías:** HTML5 Semántico, CSS3 Vanilla, JavaScript Vanilla (ES6+)  
**Estado de Implementación:** 100% Implementado y Validado

---

## 1. ¿Qué es Open Graph Protocol?

El protocolo **Open Graph (OG)** es un estándar abierto desarrollado originalmente por Facebook que permite a cualquier página web convertirse en un objeto enriquecido dentro del gráfico social.

Cuando un usuario comparte un enlace de tu sitio web en plataformas de mensajería o redes sociales como:

* **WhatsApp**
* **Facebook**
* **LinkedIn**
* **X (Twitter)**
* **Telegram**
* **Discord** / **Slack**

El rastreador (*scraper* o *bot*) de la plataforma realiza una solicitud HTTP GET directa a la URL. Si la página contiene metadatos Open Graph en el elemento `<head>`, la red social genera una **tarjeta de vista previa (rich snippet)** con título, descripción persuasiva, imagen en alta resolución y nombre del sitio, en lugar de un enlace de texto plano sin contexto.

---

## 2. Etiquetas Estandarizadas Implementadas

Cada página HTML del proyecto incluye ahora las siguientes etiquetas estrictamente organizadas:

### 2.1 Metadatos Open Graph Core

```html
<!-- Open Graph / Redes Sociales (Facebook, WhatsApp, LinkedIn, Telegram) -->
<meta property="og:type" content="website">
<meta property="og:title" content="Título específico y persuasivo de la página">
<meta property="og:description" content="Descripción optimizada entre 120 y 160 caracteres">
<meta property="og:url" content="https://tecnofix.com.co/ruta-canonica">
<meta property="og:site_name" content="TecnoFix Colombia">
<meta property="og:locale" content="es_CO">
<meta property="og:image" content="https://tecnofix.com.co/assets/images/og/og-pagina.jpg">
<meta property="og:image:secure_url" content="https://tecnofix.com.co/assets/images/og/og-pagina.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Descripción accesible de la imagen del banner">
```

### 2.2 Metadatos para X (Twitter Cards)

```html
<!-- Metadatos Twitter (X Cards) -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Título específico de la página">
<meta name="twitter:description" content="Descripción atractiva para Twitter/X">
<meta name="twitter:image" content="https://tecnofix.com.co/assets/images/og/og-pagina.jpg">
<meta name="twitter:image:alt" content="Descripción accesible del banner">
```

### 2.3 Metadatos SEO y Canónicas Complementarias

```html
<title>Título Único de la Página | TecnoFix Colombia</title>
<meta name="description" content="Descripción idéntica o complementaria al og:description">
<link rel="canonical" href="https://tecnofix.com.co/ruta-canonica">
<link rel="alternate" hreflang="es-CO" href="https://tecnofix.com.co/ruta-canonica">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
```

---

## 3. Páginas Modificadas e Imágenes Asociadas

Todas las páginas públicas del proyecto fueron actualizadas con imágenes exclusivas en formato JPEG de 1200 × 630 píxeles (~110 KB):

| Archivo HTML | Título Open Graph | Imagen Asociada (1200 × 630) | Propósito / Enfoque |
| :--- | :--- | :--- | :--- |
| `index.html` | Servicio Técnico de Computadores y Venta de Tecnología | `assets/images/og/og-home.jpg` | Representación general de la marca y servicios |
| `servicios.html` | Servicios de Reparación y Mantenimiento de Computadores | `assets/images/og/og-servicios.jpg` | Los 12 servicios técnicos, diagnóstico y tarifas |
| `productos.html` | Catálogo de Productos Tecnológicos y Repuestos | `assets/images/og/og-productos.jpg` | SSD SATA/NVMe, memorias RAM y accesorios en COP |
| `nosotros.html` | Sobre Nosotros \| Servicio Técnico Profesional | `assets/images/og/og-nosotros.jpg` | Laboratorio técnico, trayectoria y honestidad |
| `preguntas-frecuentes.html` | Preguntas Frecuentes y Respuestas Técnicas | `assets/images/og/og-preguntas-frecuentes.jpg` | Tarifas, garantías por escrito y domicilios en Bogotá |
| `contacto.html` | Contacto y Cotizaciones \| Servicio Técnico | `assets/images/og/og-contacto.jpg` | WhatsApp directo, taller en Chapinero y formulario |
| *Fallback Universal* | Servicio Técnico Especializado de Computadores | `assets/images/og/og-default.jpg` | Imagen de respaldo para páginas sin banner propio |

---

## 4. Guía Operativa: Cómo Realizar Cambios

### 4.1 Cómo cambiar títulos y descripciones

Para cambiar el texto que aparece en WhatsApp o redes sociales al compartir una página:

1. Abre el archivo HTML correspondiente (ej. `servicios.html`).
2. Localiza las líneas entre `<meta property="og:title">` y `<meta property="og:description">`.
3. Modifica los atributos `content` tanto de las etiquetas `og:*` como de las etiquetas `twitter:*` y `<title>`:

```html
<!-- Ejemplo para cambiar el título -->
<title>Nuevo Título | TecnoFix Colombia</title>
<meta property="og:title" content="Nuevo Título | TecnoFix Colombia">
<meta name="twitter:title" content="Nuevo Título | TecnoFix Colombia">
```

> **Consejo:** Mantén la coherencia entre `<title>` y `og:title`, y entre `<meta name="description">` y `og:description`.

### 4.2 Cómo reemplazar o actualizar imágenes

1. Crea tu nueva imagen con las siguientes especificaciones:
   * **Dimensiones:** `1200` píxeles de ancho por `630` píxeles de alto.
   * **Relación de aspecto:** `1.91:1`.
   * **Formato:** `JPEG` o `PNG` (evitar SVG para Open Graph, ya que los scrapers de WhatsApp y Facebook no renderizan vectores).
   * **Peso:** Menos de 300 KB para garantizar carga inmediata en redes móviles.
2. Guarda el archivo en la carpeta `assets/images/og/` (ejemplo: `assets/images/og/og-mi-nueva-imagen.jpg`).
3. En el archivo HTML, actualiza la URL absoluta:

```html
<meta property="og:image" content="https://tecnofix.com.co/assets/images/og/og-mi-nueva-imagen.jpg">
<meta property="og:image:secure_url" content="https://tecnofix.com.co/assets/images/og/og-mi-nueva-imagen.jpg">
<meta name="twitter:image" content="https://tecnofix.com.co/assets/images/og/og-mi-nueva-imagen.jpg">
```

### 4.3 Cómo configurar el dominio de producción

Actualmente el dominio base configurado es:
```text
https://tecnofix.com.co
```

Si en el despliegue final utilizas un dominio diferente (por ejemplo, `https://mitienda.com` o un subdominio de pruebas):

1. **En los archivos HTML:** Realiza un reemplazo global de `https://tecnofix.com.co` por tu nuevo dominio en todas las etiquetas `<link rel="canonical">`, `<meta property="og:url">`, `<meta property="og:image">` y en el JSON-LD.
2. **En la configuración centralizada:** Abre [assets/js/seo-metadata-config.js](file:///c:/Users/JHON/Desktop/MINEGOCIO/assets/js/seo-metadata-config.js) y modifica la propiedad `baseUrl`:
   ```javascript
   baseUrl: "https://tu-nuevo-dominio.com",
   ```
3. **En los archivos técnicos:** Actualiza la directiva `Sitemap:` en [robots.txt](file:///c:/Users/JHON/Desktop/MINEGOCIO/robots.txt) y las etiquetas `<loc>` en [sitemap.xml](file:///c:/Users/JHON/Desktop/MINEGOCIO/sitemap.xml).

---

## 5. Cómo Crear Nuevas Páginas con Open Graph

Para agregar una página nueva al sitio web garantizando que cumpla todos los estándares:

1. Duplica el archivo [template-pagina.html](file:///c:/Users/JHON/Desktop/MINEGOCIO/template-pagina.html).
2. Renombra la copia con la nueva URL (por ejemplo, `garantias.html`).
3. Reemplaza los campos entre corchetes `[TEXTO]`:
   * `[Título Específico]`
   * `[Descripción]`
   * `[nombre-pagina]`
   * `assets/images/og/og-[nombre-pagina].jpg` (puedes usar `assets/images/og/og-default.jpg` mientras creas la imagen específica).
4. Agrega la nueva URL a [sitemap.xml](file:///c:/Users/JHON/Desktop/MINEGOCIO/sitemap.xml).
5. Opcionalmente, registra la página en [assets/js/seo-metadata-config.js](file:///c:/Users/JHON/Desktop/MINEGOCIO/assets/js/seo-metadata-config.js) para mantener el inventario técnico centralizado.

---

## 6. Validación de Metadatos y Caché en Redes Sociales

Las redes sociales almacenan en caché (*cachean*) las vistas previas durante días o semanas. Si modificas un título o imagen y al compartirlo sigue apareciendo el anterior, debes forzar al scraper a refrescar su caché usando las herramientas oficiales:

1. **Facebook & WhatsApp:**
   * Utiliza el [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).
   * Ingresa la URL y haz clic en **"Scrape Again"** (Depurar de nuevo). Esto actualiza simultáneamente la memoria caché de Facebook y de los servidores de WhatsApp.
2. **LinkedIn:**
   * Utiliza el [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
   * Ingresa la URL para forzar la actualización de la tarjeta de vista previa.
3. **X / Twitter:**
   * Comparte el enlace en un borrador de tweet o utiliza el [Twitter Card Validator](https://cards-dev.twitter.com/validator) para inspeccionar los metadatos `twitter:card` y `twitter:image`.
4. **Telegram:**
   * Escribe al bot oficial `@WebpageBot` en Telegram y envíale la URL para que borre el caché de previsualizaciones del enlace.

---

## 7. Limitaciones Técnicas del Frontend Estático

Es vital comprender cómo operan los rastreadores para evitar expectativas técnicas inviables:

1. **Rastreadores sin JavaScript:**  
   Los scrapers de WhatsApp, Facebook, LinkedIn y Twitter descargan únicamente el código HTML sin procesar scripts. **Cualquier meta etiqueta inyectada mediante `document.createElement('meta')` en JavaScript será invisible para ellos.** Por esta razón, el proyecto utiliza metadatos estáticos impresos directamente en el HTML de cada archivo.
2. **Productos en Modales Dinámicos:**  
   En `productos.html`, los productos se visualizan mediante ventanas modales interactivas alimentadas por `productos-data.js`. Dado que no existen páginas HTML individuales por producto (como `producto-ssd-kingston.html`), compartir el enlace `https://tecnofix.com.co/productos.html` generará siempre la vista previa del catálogo general de productos y no la de un producto individual. Si en el futuro se requieren tarjetas independientes por producto, será necesario crear archivos HTML estáticos individuales o pre-renderizarlos.
3. **Imágenes Relativas vs. Absolutas:**  
   Las especificaciones de Open Graph exigen **URLs absolutas** (`https://...`). Una ruta relativa como `assets/images/og/og-home.jpg` es ignorada por WhatsApp y Facebook. Todas las etiquetas del proyecto están configuradas con URLs absolutas completas.
