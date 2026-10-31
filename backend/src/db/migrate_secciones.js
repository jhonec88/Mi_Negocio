const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

const { pool } = require('../config/db');

async function migrateSecciones() {
  console.log('Actualizando tabla secciones_home para soportar Inicio, Nosotros y Contacto...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS secciones_home (
      id SERIAL PRIMARY KEY,
      pagina VARCHAR(50) DEFAULT 'inicio',
      clave_seccion VARCHAR(100),
      titulo VARCHAR(255) NOT NULL,
      subtitulo VARCHAR(255),
      descripcion TEXT NOT NULL,
      imagen VARCHAR(255) NOT NULL,
      texto_boton VARCHAR(100) DEFAULT 'Más Información',
      enlace_boton VARCHAR(255) DEFAULT 'contacto.html',
      posicion_texto VARCHAR(50) DEFAULT 'centro',
      orden INTEGER DEFAULT 0,
      activo BOOLEAN DEFAULT TRUE,
      creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    ALTER TABLE secciones_home
    ADD COLUMN IF NOT EXISTS pagina VARCHAR(50) DEFAULT 'inicio';
  `);

  await pool.query(`
    ALTER TABLE secciones_home
    ADD COLUMN IF NOT EXISTS clave_seccion VARCHAR(100);
  `);

  await pool.query(`
    UPDATE secciones_home SET pagina = 'inicio' WHERE pagina IS NULL;
  `);

  const seccionesSemilla = [
    // ================= PÁGINA: INICIO (index.html) =================
    {
      pagina: 'inicio',
      clave_seccion: 'hero',
      titulo: 'Soluciones tecnológicas para tu día a día',
      subtitulo: 'Servicio Técnico Certificado • Colombia',
      descripcion: 'Servicio profesional de reparación, mantenimiento y optimización de computadores portátiles y de escritorio. También encontrarás repuestos, componentes y accesorios tecnológicos garantizados.',
      imagen: 'assets/images/galeria/taller-1.svg',
      texto_boton: 'Solicitar servicio técnico',
      enlace_boton: 'servicios.html',
      posicion_texto: 'izquierda',
      orden: 1,
    },
    {
      pagina: 'inicio',
      clave_seccion: 'rutas',
      titulo: '¿Cómo te podemos ayudar hoy?',
      subtitulo: 'Rutas de atención',
      descripcion: 'Hemos estructurado nuestras soluciones para que encuentres exactamente lo que necesitas en segundos.',
      imagen: 'assets/images/galeria/taller-2.svg',
      texto_boton: 'Ver todos los servicios',
      enlace_boton: 'servicios.html',
      posicion_texto: 'centro',
      orden: 2,
    },
    {
      pagina: 'inicio',
      clave_seccion: 'diagnostico',
      titulo: '¿Qué problema tiene tu computador?',
      subtitulo: 'Asistente Interactivo',
      descripcion: 'Selecciona el síntoma principal que presenta tu equipo para recibir una orientación técnica inmediata sobre causas probables y solución recomendada.',
      imagen: 'assets/images/galeria/taller-3.svg',
      texto_boton: 'Diagnosticar equipo',
      enlace_boton: 'servicios.html',
      posicion_texto: 'centro',
      orden: 3,
    },
    {
      pagina: 'inicio',
      clave_seccion: 'servicios_destacados',
      titulo: 'Nuestras soluciones más solicitadas',
      subtitulo: 'Servicios Profesionales',
      descripcion: 'Reparación de hardware, mantenimiento preventivo y optimización integral de equipos con repuestos de calidad certificada.',
      imagen: 'assets/images/galeria/taller-4.svg',
      texto_boton: 'Ver los 12 servicios técnicos disponibles',
      enlace_boton: 'servicios.html',
      posicion_texto: 'centro',
      orden: 4,
    },
    {
      pagina: 'inicio',
      clave_seccion: 'productos_destacados',
      titulo: 'Componentes y tecnología recomendada',
      subtitulo: 'Catálogo Destacado',
      descripcion: 'Precios referenciales en pesos colombianos con garantía directa y consulta de existencias por WhatsApp.',
      imagen: 'assets/images/productos/ssd-kingston.svg',
      texto_boton: 'Explorar catálogo completo de productos',
      enlace_boton: 'productos.html',
      posicion_texto: 'centro',
      orden: 5,
    },
    {
      pagina: 'inicio',
      clave_seccion: 'antes_despues',
      titulo: 'Antes y Después: Mantenimiento térmico',
      subtitulo: 'Galería Real',
      descripcion: 'Arrastra el control central para ver el impacto de una limpieza profesional y el cambio de compuesto térmico en la temperatura y rendimiento del equipo.',
      imagen: 'assets/images/galeria/limpieza-despues.svg',
      texto_boton: 'Cotizar Mantenimiento',
      enlace_boton: 'servicios.html',
      posicion_texto: 'centro',
      orden: 6,
    },
    {
      pagina: 'inicio',
      clave_seccion: 'valores',
      titulo: 'Por qué confiar tus equipos con nosotros',
      subtitulo: 'Compromiso Profesional',
      descripcion: 'Cuidamos la información de tus computadores y aseguramos cada trabajo con transparencia técnica.',
      imagen: 'assets/images/galeria/taller-1.svg',
      texto_boton: 'Conocer Nuestro Taller',
      enlace_boton: 'nosotros.html',
      posicion_texto: 'centro',
      orden: 7,
    },
    {
      pagina: 'inicio',
      clave_seccion: 'aeo_local',
      titulo: 'Respuestas Rápidas sobre Servicio Técnico en Anorí, Antioquia',
      subtitulo: 'AEO & Local SEO',
      descripcion: 'Información concreta y verificada sobre precios, tiempos de entrega, garantías y modalidades de atención para usuarios y asistentes de búsqueda.',
      imagen: 'assets/images/galeria/taller-2.svg',
      texto_boton: 'Ver Preguntas Frecuentes',
      enlace_boton: 'preguntas-frecuentes.html',
      posicion_texto: 'centro',
      orden: 8,
    },
    {
      pagina: 'inicio',
      clave_seccion: 'cta_final',
      titulo: '¿Listo para optimizar o reparar tu equipo?',
      subtitulo: 'Atención Directa',
      descripcion: 'Escríbenos directamente a WhatsApp contándonos la marca, modelo y falla de tu equipo para recibir una cotización personalizada sin compromiso.',
      imagen: 'assets/images/galeria/taller-1.svg',
      texto_boton: 'Formulario de contacto',
      enlace_boton: 'contacto.html',
      posicion_texto: 'centro',
      orden: 9,
    },

    // ================= PÁGINA: NOSOTROS (nosotros.html) =================
    {
      pagina: 'nosotros',
      clave_seccion: 'nosotros_cabecera',
      titulo: 'Pasión por la tecnología y excelencia en servicio técnico',
      subtitulo: 'Perfil Profesional',
      descripcion: 'Nacimos con el propósito de ofrecer un servicio técnico honesto, transparente y con repuestos de calidad, donde cada cliente entiende con claridad lo que su equipo necesita.',
      imagen: 'assets/images/galeria/taller-1.svg',
      texto_boton: 'Ver Servicios',
      enlace_boton: 'servicios.html',
      posicion_texto: 'centro',
      orden: 1,
    },
    {
      pagina: 'nosotros',
      clave_seccion: 'nosotros_historia',
      titulo: 'Más de 10 años recuperando equipos y solucionando fallas complejas',
      subtitulo: 'Nuestra Trayectoria',
      descripcion: 'En JecTech Soluciones entendemos que tu computador no es solo una máquina: es tu herramienta de trabajo, estudio y comunicación. Por eso, tratamos cada equipo con el mayor cuidado técnico y absoluto respeto por la privacidad de tu información.',
      imagen: 'assets/images/galeria/taller-2.svg',
      texto_boton: 'Ver servicios',
      enlace_boton: 'servicios.html',
      posicion_texto: 'izquierda',
      orden: 2,
    },
    {
      pagina: 'nosotros',
      clave_seccion: 'nosotros_valores',
      titulo: 'Nuestros valores fundamentales',
      subtitulo: 'Cultura de Trabajo',
      descripcion: 'Cuidamos tu equipo como si fuera propio, explicamos el diagnóstico en lenguaje claro, damos atención personalizada y utilizamos insumos premium con pruebas de estrés.',
      imagen: 'assets/images/galeria/taller-3.svg',
      texto_boton: 'Contactar al Taller',
      enlace_boton: 'contacto.html',
      posicion_texto: 'centro',
      orden: 3,
    },
    {
      pagina: 'nosotros',
      clave_seccion: 'nosotros_galeria',
      titulo: 'Resultados reales en nuestro taller',
      subtitulo: 'Galería de Trabajos',
      descripcion: 'Observa el contraste de una limpieza térmica profesional con eliminación de polvo obstructivo y renovación de compuesto térmico.',
      imagen: 'assets/images/galeria/limpieza-despues.svg',
      texto_boton: 'Solicitar Mantenimiento',
      enlace_boton: 'contacto.html',
      posicion_texto: 'centro',
      orden: 4,
    },
    {
      pagina: 'nosotros',
      clave_seccion: 'nosotros_testimonios',
      titulo: 'Lo que dicen quienes confían en nosotros',
      subtitulo: 'Opiniones Verificadas',
      descripcion: 'La satisfacción de nuestros clientes particulares y empresas es nuestro mejor respaldo.',
      imagen: 'assets/images/galeria/taller-4.svg',
      texto_boton: 'Cotizar Ahora',
      enlace_boton: 'contacto.html',
      posicion_texto: 'centro',
      orden: 5,
    },

    // ================= PÁGINA: CONTACTO (contacto.html) =================
    {
      pagina: 'contacto',
      clave_seccion: 'contacto_cabecera',
      titulo: 'Contacto y Servicio Técnico en Anorí, Antioquia',
      subtitulo: 'Canal Directo & Localización',
      descripcion: 'Comunícate con nuestro laboratorio técnico en el Parque Principal de Anorí, Antioquia. Diligencia el formulario asistido o escríbenos directamente a WhatsApp para cotización inmediata.',
      imagen: 'assets/images/galeria/taller-1.svg',
      texto_boton: 'Escribir por WhatsApp',
      enlace_boton: 'contacto.html',
      posicion_texto: 'centro',
      orden: 1,
    },
    {
      pagina: 'contacto',
      clave_seccion: 'contacto_datos',
      titulo: 'Estamos listos para atenderte',
      subtitulo: 'Datos de Atención',
      descripcion: 'Brindamos atención personalizada en taller, servicio de recogida y entrega a domicilio y soporte remoto para toda Colombia.',
      imagen: 'assets/images/galeria/taller-2.svg',
      texto_boton: 'Escribir directamente al WhatsApp del técnico',
      enlace_boton: 'contacto.html',
      posicion_texto: 'izquierda',
      orden: 2,
    },
    {
      pagina: 'contacto',
      clave_seccion: 'contacto_ubicacion',
      titulo: 'Taller Principal Anorí, Antioquia',
      subtitulo: 'Carrera 29 # 28-20, Parque Principal, Anorí, Antioquia',
      descripcion: 'Estamos ubicados en el Parque Principal de Anorí, diagonal a la Iglesia San Luis Gonzaga. Acércate y pregunta sin compromiso; aquí te atenderemos con el mayor de los gustos.',
      imagen: 'assets/images/galeria/taller-3.svg',
      texto_boton: 'Ver Servicios',
      enlace_boton: 'servicios.html',
      posicion_texto: 'izquierda',
      orden: 3,
    },
    {
      pagina: 'contacto',
      clave_seccion: 'contacto_formulario',
      titulo: 'Formulario de Solicitud',
      subtitulo: 'Cotización Estructurada',
      descripcion: 'Completa los siguientes campos para redactar un mensaje estructurado con los detalles exactos de tu requerimiento.',
      imagen: 'assets/images/galeria/taller-4.svg',
      texto_boton: 'Preparar solicitud para WhatsApp',
      enlace_boton: 'contacto.html',
      posicion_texto: 'derecha',
      orden: 4,
    },
  ];

  for (const s of seccionesSemilla) {
    const existing = await pool.query('SELECT id FROM secciones_home WHERE clave_seccion = $1', [s.clave_seccion]);
    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO secciones_home
          (pagina, clave_seccion, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)`,
        [
          s.pagina,
          s.clave_seccion,
          s.titulo,
          s.subtitulo,
          s.descripcion,
          s.imagen,
          s.texto_boton,
          s.enlace_boton,
          s.posicion_texto,
          s.orden,
        ]
      );
    } else {
      await pool.query('UPDATE secciones_home SET pagina = $1 WHERE clave_seccion = $2', [s.pagina, s.clave_seccion]);
    }
  }

  console.log('Secciones de Inicio (9), Nosotros (5) y Contacto (4) registradas con éxito.');
  await pool.end();
}

migrateSecciones().catch(err => {
  console.error('Error en migración:', err);
  pool.end();
});
