const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '../../..');
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

const { pool } = require('../config/db');

function updateFrontendHtmlFiles() {
  const htmlFiles = [
    'index.html',
    'servicios.html',
    'productos.html',
    'nosotros.html',
    'preguntas-frecuentes.html',
    'contacto.html',
    '404.html',
  ];

  for (const file of htmlFiles) {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Reemplazar el SVG dentro de <div class="brand-icon"...>...</div> por la imagen del logo JecTech
    content = content.replace(
      /<div class="brand-icon"[^>]*>[\s\S]*?<\/div>/g,
      '<div class="brand-icon" aria-hidden="true"><img src="assets/images/logo-jectech.png" alt="Logo JecTech Soluciones" class="brand-logo-img"></div>'
    );

    // 2. Reemplazar títulos de marca en cabecera y pie de página
    content = content.replace(
      /<span class="brand-title">Tecno<span>Fix<\/span><\/span>/g,
      '<span class="brand-title">JecTech <span>Soluciones</span></span>'
    );
    content = content.replace(
      /<span class="brand-title" style="color: #ffffff;">Tecno<span style="color: var\(--color-primary\);">Fix<\/span><\/span>/g,
      '<span class="brand-title" style="color: #ffffff;">JecTech <span style="color: var(--color-primary);">Soluciones</span></span>'
    );

    // 3. Reemplazar favicon
    content = content.replace(
      /<link rel="icon" type="image\/svg\+xml" href="favicon\.svg">/g,
      '<link rel="icon" type="image/png" href="assets/images/logo-jectech.png">'
    );

    // 4. Reemplazar menciones de TecnoFix Colombia y TecnoFix por JecTech Soluciones
    content = content.replace(/TecnoFix Colombia/g, 'JecTech Soluciones');
    content = content.replace(/TecnoFix/g, 'JecTech Soluciones');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Actualizado HTML: ${file}`);
  }
}

function updateJsAndBackendFiles() {
  const filesToUpdate = [
    'assets/js/whatsapp.js',
    'assets/js/carrito.js',
    'assets/js/main.js',
    'assets/js/productos-data.js',
    'assets/js/productos.js',
    'assets/js/servicios.js',
    'assets/js/modal.js',
    'assets/js/menu.js',
    'assets/js/filtros.js',
    'assets/js/security.js',
    'backend/src/admin/index.html',
    'backend/src/admin/admin.js',
    'backend/src/server.js',
    'backend/src/db/migrate_secciones.js',
    'backend/src/db/seed.sql',
  ];

  for (const relPath of filesToUpdate) {
    const filePath = path.join(rootDir, relPath);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/TecnoFix Colombia/g, 'JecTech Soluciones');
    content = content.replace(/TecnoFix/g, 'JecTech Soluciones');
    content = content.replace(/TECNOFIX/g, 'JECTECH SOLUCIONES');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Actualizado archivo: ${relPath}`);
  }
}

async function updateDatabaseRecords() {
  console.log('Actualizando registros en PostgreSQL a JecTech Soluciones...');

  await pool.query(`
    UPDATE configuracion
    SET valor = 'JecTech Soluciones', actualizado_en = CURRENT_TIMESTAMP
    WHERE clave = 'business_name';
  `);

  await pool.query(`
    UPDATE usuarios
    SET nombre = REPLACE(REPLACE(nombre, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones');
  `);

  await pool.query(`
    UPDATE secciones_home
    SET
      titulo = REPLACE(REPLACE(titulo, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones'),
      subtitulo = REPLACE(REPLACE(subtitulo, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones'),
      descripcion = REPLACE(REPLACE(descripcion, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones');
  `);

  await pool.query(`
    UPDATE faqs
    SET
      pregunta = REPLACE(REPLACE(pregunta, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones'),
      respuesta = REPLACE(REPLACE(respuesta, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones');
  `);

  await pool.query(`
    UPDATE productos
    SET
      nombre = REPLACE(REPLACE(nombre, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones'),
      descripcion = REPLACE(REPLACE(descripcion, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones');
  `);

  await pool.query(`
    UPDATE servicios
    SET
      nombre = REPLACE(REPLACE(nombre, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones'),
      descripcion = REPLACE(REPLACE(descripcion, 'TecnoFix Colombia', 'JecTech Soluciones'), 'TecnoFix', 'JecTech Soluciones');
  `);

  console.log('Base de datos actualizada a JecTech Soluciones.');
  await pool.end();
}

async function run() {
  updateFrontendHtmlFiles();
  updateJsAndBackendFiles();
  await updateDatabaseRecords();
}

run().catch(err => {
  console.error('Error en rebrand:', err);
  pool.end();
});
