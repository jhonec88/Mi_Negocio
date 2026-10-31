-- ============================================================================
-- ESQUEMA Y DATOS INICIALES: TECNOFIX COLOMBIA (POSTGRESQL)
-- ============================================================================

-- 1. TABLA: USUARIOS ADMINISTRATIVOS
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) DEFAULT 'admin',
    activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA: SERVICIOS TÉCNICOS
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    icono TEXT,
    descripcion TEXT NOT NULL,
    beneficios JSONB DEFAULT '[]'::jsonb,
    equipos_compatibles TEXT,
    tareas_incluidas JSONB DEFAULT '[]'::jsonb,
    tiempo_estimado VARCHAR(100),
    precio_referencia VARCHAR(100),
    destacado BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA: PRODUCTOS DE CATÁLOGO / INVENTARIO
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    marca VARCHAR(100),
    precio INTEGER NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    disponible VARCHAR(30) DEFAULT 'disponible',
    destacado BOOLEAN DEFAULT FALSE,
    descripcion TEXT,
    especificaciones JSONB DEFAULT '{}'::jsonb,
    stock INTEGER DEFAULT 10,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA: MENSAJES Y COTIZACIONES (FORMULARIO ASISTIDO)
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(120),
    tipo_solicitud VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    estado VARCHAR(30) DEFAULT 'nuevo',
    origen VARCHAR(50) DEFAULT 'web',
    ip_origen VARCHAR(45),
    notas_internas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA: PEDIDOS REGISTRADOS
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    codigo_pedido VARCHAR(50) UNIQUE NOT NULL,
    cliente_nombre VARCHAR(120),
    cliente_telefono VARCHAR(50),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total INTEGER NOT NULL DEFAULT 0,
    estado VARCHAR(30) DEFAULT 'pendiente',
    canal VARCHAR(30) DEFAULT 'whatsapp',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLA: CONFIGURACIÓN GENERAL DEL NEGOCIO
CREATE TABLE IF NOT EXISTS configuracion (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL,
    descripcion TEXT,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABLA: PREGUNTAS FRECUENTES (FAQ / AEO)
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    categoria VARCHAR(80) DEFAULT 'general',
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SEED DATA (DATOS INICIALES)
-- ============================================================================

-- Usuario Admin por defecto: admin@tecnofix.com.co / AdminTecnoFix2026*
INSERT INTO usuarios (nombre, email, password_hash, rol, activo)
VALUES (
    'Administrador TecnoFix',
    'admin@tecnofix.com.co',
    '$2a$10$muF9kQi2M7gbg/Tnk42j5OOXZjqxqyrgCrtgkn8kQadrvvYM3aFbO',
    'admin',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Configuración General del Sitio
INSERT INTO configuracion (clave, valor, descripcion)
VALUES 
    ('business_name', 'JecTech Soluciones', 'Nombre comercial de la empresa'),
    ('whatsapp_phone', '573122655639', 'Número oficial de WhatsApp en formato internacional sin signos'),
    ('email_contacto', 'jhonec88@tecnofix.com.co', 'Correo principal de atención'),
    ('direccion_taller', 'Carrera 29 # 28-20, Sector Tecnológico, Anorí Antioquia', 'Dirección física del taller principal'),
    ('horario_atencion', 'Lunes a Sábado: 9:00 AM a 6:00 PM', 'Horario de apertura al público'),
    ('garantia_estandar', 'Hasta 12 meses por escrito según componente', 'Términos generales de garantía')
ON CONFLICT (clave) DO NOTHING;

-- Productos Iniciales sincronizados con el Frontend
INSERT INTO productos (id, nombre, marca, categoria, precio, disponible, imagen, descripcion, destacado, stock, especificaciones)
VALUES
(1, 'SSD Kingston A400 480 GB SATA III', 'Kingston', 'SSD y almacenamiento', 145000, 'disponible', 'assets/images/productos/ssd-kingston.jpg', 'Unidad de estado sólido de alta velocidad para revivir y acelerar portátiles y equipos de escritorio.', TRUE, 25, '{"Capacidad":"480 GB","Interfaz":"SATA III 6 Gb/s","Formato":"2.5 pulgadas (7 mm)","Lectura secuencial":"Hasta 500 MB/s","Escritura secuencial":"Hasta 450 MB/s","Garantia":"12 meses directa"}'::jsonb),
(2, 'SSD NVMe M.2 Samsung 980 1 TB PCIe 3.0', 'Samsung', 'SSD y almacenamiento', 360000, 'disponible', 'assets/images/productos/ssd-samsung.jpg', 'Almacenamiento NVMe ultrarrápido con tecnología V-NAND y control térmico inteligente para creadores y gamers.', TRUE, 15, '{"Capacidad":"1 TB (1000 GB)","Interfaz":"PCIe Gen 3.0 x4, NVMe 1.4","Formato":"M.2 (2280)","Lectura secuencial":"Hasta 3.500 MB/s","Escritura secuencial":"Hasta 3.000 MB/s","Garantia":"12 meses directa"}'::jsonb),
(3, 'Memoria RAM Kingston Fury Beast DDR4 8 GB 3200MHz', 'Kingston', 'Memorias RAM', 95000, 'disponible', 'assets/images/productos/ram-ddr4.jpg', 'Módulo de memoria RAM con disipador de perfil bajo para equipos de escritorio y estaciones de trabajo.', TRUE, 30, '{"Capacidad":"8 GB","Tipo":"DDR4 UDIMM","Frecuencia":"3200 MHz","Latencia":"CL16","Voltaje":"1.35 V","Compatibilidad":"Intel XMP 2.0 y AMD Ryzen"}'::jsonb),
(4, 'Memoria RAM Crucial DDR4 16 GB 3200MHz para Portátil', 'Crucial', 'Memorias RAM', 185000, 'disponible', 'assets/images/productos/ram-laptop.jpg', 'Módulo SO-DIMM para aumentar la multitarea y velocidad de respuesta en computadores portátiles modernos.', FALSE, 18, '{"Capacidad":"16 GB","Tipo":"DDR4 SO-DIMM para laptop","Frecuencia":"3200 MHz","Voltaje":"1.2 V","Garantia":"12 meses directa"}'::jsonb),
(5, 'Portátil Corporativo Lenovo ThinkPad E14 Gen 4', 'Lenovo', 'Computadores portátiles', 2950000, 'consultar', 'assets/images/productos/laptop-lenovo.jpg', 'Portátil empresarial resistente con procesador Intel Core i5 de 12ª generación, 16 GB de RAM y 512 GB SSD NVMe.', TRUE, 5, '{"Procesador":"Intel Core i5-1235U (10 núcleos)","Memoria RAM":"16 GB DDR4 3200MHz","Almacenamiento":"512 GB SSD NVMe M.2","Pantalla":"14 pulgadas FHD Antirreflejo","Teclado":"Resistente a salpicaduras con TrackPoint","Sistema":"Windows 11 Pro licenciado"}'::jsonb),
(6, 'Portátil ASUS VivoBook 15 OLED', 'ASUS', 'Computadores portátiles', 2680000, 'disponible', 'assets/images/productos/laptop-asus.jpg', 'Increíble pantalla OLED con colores vivos, procesador AMD Ryzen 5 y diseño ultradelgado para trabajo y estudio.', FALSE, 7, '{"Procesador":"AMD Ryzen 5 5600H","Memoria RAM":"8 GB DDR4 (Expandible)","Almacenamiento":"512 GB SSD PCIe","Pantalla":"15.6 pulgadas OLED FHD","Peso":"1.7 kg","Garantia":"12 meses de fábrica"}'::jsonb),
(7, 'Computador de Escritorio Torre Ensamblada Core i5 Pro', 'Custom', 'Computadores de escritorio', 2150000, 'disponible', 'assets/images/productos/pc-torre.png', 'Equipo de escritorio ideal para oficina, contabilidad y multitarea pesada. Optimizado con componentes certificados.', TRUE, 8, '{"Procesador":"Intel Core i5-10400 6 núcleos / 12 hilos","Placa base":"Chipset H510M con HDMI y VGA","RAM":"16 GB DDR4 Dual Channel","Disco":"SSD NVMe 500 GB","Fuente":"500W con certificación","Garantia":"12 meses en hardware"}'::jsonb),
(8, 'Combo Teclado y Mouse Inalámbrico Logitech MK270', 'Logitech', 'Teclados y mouse', 110000, 'disponible', 'assets/images/productos/combo-logitech.jpg', 'Conexión inalámbrica fiable de 2.4 GHz de largo alcance, teclas multimedia y batería de duración prolongada.', FALSE, 20, '{"Conectividad":"Inalámbrica con nano receptor USB","Alcance":"Hasta 10 metros","Bateria teclado":"Hasta 36 meses","Bateria mouse":"Hasta 12 meses","Distribucion":"Español con teclado numérico"}'::jsonb),
(9, 'Teclado Mecánico RGB Redragon Kumara K552', 'Redragon', 'Teclados y mouse', 165000, 'disponible', 'assets/images/productos/teclado-mecanico.jpg', 'Estructura metálica resistente, interruptores Outemu mecánicos y retroiluminación personalizable.', FALSE, 14, '{"Tipo de Switch":"Mecánico Outemu Red / Blue","Formato":"Tenkeyless (TKL compacto 80%)","Conexion":"USB chapado en oro","Construccion":"Aluminio y ABS reforzado","Anti-ghosting":"100% teclas con N-Key Rollover"}'::jsonb),
(10, 'Monitor Profesional LG UltraGear 24 Pulgadas 144Hz', 'LG', 'Monitores', 690000, 'disponible', 'assets/images/productos/monitor-lg.jpg', 'Tasa de refresco ultra fluida de 144 Hz, 1 ms de tiempo de respuesta y panel IPS para colores exactos.', TRUE, 10, '{"Tamaño":"24 pulgadas (1920 x 1080 FHD)","Panel":"IPS antirreflejo","Frecuencia":"144 Hz nativos","Tiempo de respuesta":"1 ms MBR","Puertos":"1x HDMI, 1x DisplayPort, salida de audio"}'::jsonb),
(11, 'Router Gigabit Wi-Fi 6 TP-Link Archer AX12', 'TP-Link', 'Equipos de redes', 185000, 'disponible', 'assets/images/productos/router-tplink.jpg', 'Tecnología Wi-Fi 6 de nueva generación con mayor velocidad, capacidad para más dispositivos y cobertura ampliada.', FALSE, 12, '{"Estandar":"Wi-Fi 6 (802.11ax/ac/n/a/b/g)","Velocidad dual":"Hasta 1201 Mbps en 5 GHz + 300 Mbps en 2.4 GHz","Antenas":"4 antenas externas de alta ganancia","Puertos":"3 puertos LAN Gigabit + 1 WAN Gigabit","Seguridad":"WPA3 de última generación"}'::jsonb),
(12, 'Pasta Térmica de Alto Rendimiento Arctic MX-4 (4g)', 'Arctic', 'Accesorios tecnológicos', 45000, 'disponible', 'assets/images/productos/pasta-termica.jpg', 'Compuesto térmico microparticulado a base de carbono que garantiza una disipación óptima del calor en CPUs y GPUs.', FALSE, 40, '{"Contenido":"4 gramos en jeringa aplicadora","Conductividad":"Alta conductividad térmica sin metales","Conductividad electrica":"No conductor (seguro contra cortocircuitos)","Durabilidad":"Hasta 8 años de rendimiento constante"}'::jsonb),
(13, 'Cable HDMI 2.1 Ultra Alta Velocidad 8K 60Hz / 4K 120Hz (2m)', 'UGreen', 'Cables y adaptadores', 38000, 'disponible', 'assets/images/productos/cable-hdmi.jpg', 'Ancho de banda de 48 Gbps con soporte HDR dinámico, eARC y conectores reforzados en nylon trenzado.', FALSE, 35, '{"Version":"HDMI 2.1 (Compatible con 2.0 y 1.4)","Resoluciones":"8K@60Hz, 4K@120Hz, 2K@144Hz","Largo":"2 metros","Blindaje":"Triple capa contra interferencias electromagnéticas"}'::jsonb),
(14, 'Base Refrigerante para Portátil con 6 Ventiladores LED', 'TechCool', 'Accesorios tecnológicos', 85000, 'disponible', 'assets/images/productos/base-refrigerante.jpg', 'Flujo de aire constante con 6 ventiladores silenciosos, soporte ergonómico de 5 niveles y puertos USB duales.', FALSE, 16, '{"Compatibilidad":"Portátiles de 12 hasta 17.3 pulgadas","Ventiladores":"6 ventiladores con iluminación LED azul","Niveles de inclinacion":"5 ángulos ajustables","Puertos":"2 puertos USB 2.0 de paso"}'::jsonb),
(15, 'Cargador Original para Portátil Lenovo / HP / ASUS 65W', 'Original', 'Cables y adaptadores', 95000, 'consultar', 'assets/images/productos/cargador-portatil.jpg', 'Adaptadores de corriente certificados con protección contra sobrevoltaje, cortocircuito y sobrecalentamiento.', FALSE, 22, '{"Potencia":"65W (Compatibles con modelos de 45W)","Voltaje de salida":"19V - 20V / 3.25A","Conectores":"Punta amarilla rectangular, Tipo C, Punta azul 4.5mm","Garantia":"6 meses directa"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Sincronizar secuencia de IDs de productos
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));

-- Servicios Técnicos Iniciales
INSERT INTO servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado)
VALUES
(1, 'Mantenimiento Preventivo', 'mantenimiento', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>', 'Limpieza interna profunda, desensamble cuidadoso, cambio de pasta térmica de alto rendimiento y lubricación de ventiladores.', '["Reduce temperaturas de trabajo hasta en 20°C","Elimina polvo acumulado y evita cortocircuitos","Alarga significativamente la vida útil de CPU y GPU"]'::jsonb, 'Portátiles de todas las marcas y Computadores de escritorio / Torres Gamer', '["Desarme completo y aspirado con brocha antiestática","Limpieza de disipadores y soplado de ventiladores","Remoción de pasta térmica seca y aplicación de compuesto térmico premium","Limpieza química externa de carcasa, teclado y pantalla","Test de estrés térmico de 30 minutos"]'::jsonb, '2 a 4 horas hábiles', 'Desde $60.000 COP', TRUE),
(2, 'Mantenimiento Correctivo y Diagnóstico', 'mantenimiento', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>', 'Identificación precisa de fallas de encendido, bloqueos, pantallas azules y comportamiento errático con instrumental especializado.', '["Diagnóstico certero con pruebas de banco","Cotización previa sin sorpresas antes de reparar","Revisión de componentes individuales"]'::jsonb, 'Portátiles, All-in-One y Computadores de Torre', '["Inspección visual de placa madre bajo microscopio","Medición de líneas de voltaje principales con multímetro y osciloscopio","Prueba de salud de disco con análisis S.M.A.R.T.","Prueba exhaustiva de memoria RAM con MemTest86","Informe técnico detallado para el cliente"]'::jsonb, '24 horas hábiles', 'Diagnóstico desde $30.000 COP (Deducible de la reparación)', TRUE),
(3, 'Reparación y Reemplazo de Pantallas', 'hardware', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 'Sustitución de pantallas rotas, con líneas verticales, parpadeos o fallas de retroiluminación en portátiles.', '["Repuestos grado A+ nuevos con cero píxeles muertos","Resoluciones HD, Full HD, IPS y tasas de 144Hz","Instalación limpia sin marcas en marcos ni biseles"]'::jsonb, 'Portátiles HP, Lenovo, Dell, Asus, Acer, Apple MacBook', '["Desensamble seguro del bisel frontal y tapa trasera","Desconexión de batería para proteger el circuito backlight de la placa","Prueba de compatibilidad con cable flex de 30 o 40 pines","Instalación y calibración de colores","Garantía escrita de 6 meses en display"]'::jsonb, '1 a 3 horas (según disponibilidad de display)', 'Desde $220.000 COP (Incluye repuesto e instalación)', TRUE),
(4, 'Cambio a Disco de Estado Sólido (SSD)', 'actualizacion', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>', 'Actualización definitiva para multiplicar hasta por 10 la velocidad de arranque y respuesta de cualquier computador lento.', '["El computador enciende en menos de 15 segundos","Apertura instantánea de programas pesados (Chrome, Office, Photoshop)","Menor consumo de energía y cero ruido de partes mecánicas"]'::jsonb, 'Cualquier computador portátil o torre con disco duro mecánico (HDD)', '["Asesoría técnica entre formato SATA 2.5 pulg o NVMe M.2","Clonación bit a bit de tu sistema actual o instalación limpia","Conservación íntegra de archivos personales","Configuración de modo AHCI y TRIM en BIOS"]'::jsonb, '2 a 4 horas hábiles', 'Desde $145.000 COP (SSD 480GB + Instalación)', TRUE),
(5, 'Ampliación y Optimización de Memoria RAM', 'actualizacion', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v20M18 2v20M2 6h4M2 12h4M2 18h4M18 6h4M18 12h4M18 18h4M6 6h12M6 18h12"></path></svg>', 'Expansión de memoria para trabajar fluidamente con múltiples pestañas abiertas, edición de video o renderizado 3D.', '["Elimina congelamientos al tener muchas aplicaciones abiertas","Aprovechamiento de tecnología Dual-Channel","Compatibilidad 100% garantizada con tu procesador"]'::jsonb, 'Equipos con tecnología DDR3, DDR4 y DDR5', '["Revisión de slots disponibles y capacidad máxima de la tarjeta madre","Instalación de módulos emparejados en frecuencia y latencia","Test de estabilidad en memoria de 60 minutos"]'::jsonb, '1 a 2 horas', 'Desde $95.000 COP (Módulo 8GB + Mano de obra)', FALSE),
(6, 'Reparación Electrónica de Placa Madre (Motherboard)', 'hardware', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', 'Reparación a nivel de componentes: microsoldadura, reemplazo de integrados de carga, cortocircuitos por derrame de líquidos.', '["Ahorro de hasta un 70% frente al costo de cambiar la placa completa","Recuperación de equipos dados por irreparables en otros talleres","Uso de estación de soldadura profesional y microscopio trinocular"]'::jsonb, 'Placas de portátiles y torres de todas las marcas', '["Lavado ultrasónico en placa en caso de sulfatación por líquidos","Identificación de componentes en corto (Mosfets, capacitores SMD)","Reemplazo de chip controlador de carga (Charging IC / KBC)","Pruebas de arranque en frío y en caliente"]'::jsonb, '2 a 5 días hábiles', 'Desde $160.000 COP (Sujeto a diagnóstico)', FALSE),
(7, 'Reparación y Reconstrucción de Bisagras', 'hardware', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>', 'Reparación estructural de carcasas rotas, soportes plásticos desprendidos y bisagras trabadas o duras que rompen la pantalla.', '["Evita la rotura inminente de la pantalla por presión incorrecta","Apertura y cierre suave garantizado","Refuerzo con resina epóxica de alta resistencia mecánica"]'::jsonb, 'Portátiles con carcasas plásticas o de aleación de magnesio', '["Desarmado completo de la tapa y marco superior","Aflojado y calibración de tensión de la bisagra metálica","Reconstrucción de anclajes de tuercas doradas con polímero estructural","Curado térmico para máxima rigidez"]'::jsonb, '1 a 2 días hábiles', 'Desde $80.000 COP por lado', FALSE),
(8, 'Cambio de Teclados y Touchpad', 'hardware', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="10" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="14" y2="12"></line><line x1="18" y1="12" x2="18" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>', 'Sustitución de teclados con teclas pegadas, que escriben solos, o dañados por humedad, tanto de inserción como remachados.', '["Distribución en español con letra Ñ original","Restauración de la experiencia de escritura fluida y rápida","Instalación con soldadura plástica para teclados remachados de fábrica"]'::jsonb, 'Portátiles de todas las marcas y teclados mecánicos', '["Extracción limpia del teclado antiguo","Limpieza de la membrana interna y conector zif","Fijación precisa para evitar hundimiento en la parte central","Prueba de cada tecla mediante software especializado"]'::jsonb, '2 a 4 horas hábiles', 'Desde $90.000 COP (Teclado + Instalación)', FALSE),
(9, 'Instalación de Sistema Operativo y Software', 'software', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6-6-6"></path><path d="M12 19h8"></path></svg>', 'Instalación limpia de Windows 10, Windows 11 o Linux con controladores originales y paquete esencial de programas de oficina.', '["Sistema 100% libre de virus, spyware y programas basura","Optimización de servicios en segundo plano para máxima velocidad","Controladores del fabricante actualizados a su última versión"]'::jsonb, 'Cualquier computador portátil o de escritorio', '["Creación de respaldo previo de archivos si el cliente lo requiere","Particionamiento adecuado del disco duro/SSD","Instalación de sistema operativo actualizado","Instalación de navegador con bloqueador de publicidad, visor PDF y compresión","Paquete de ofimática y utilitarios indispensables"]'::jsonb, '2 a 3 horas hábiles', '$60.000 COP', TRUE),
(10, 'Recuperación de Información y Copias de Seguridad', 'software', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>', 'Rescate de fotos, documentos y bases de datos borradas por error, formateo accidental o fallas en el disco.', '["Máxima confidencialidad y ética en el tratamiento de tus datos","Evaluación de probabilidad de rescate antes de cobrar","Entrega de información en medio seguro"]'::jsonb, 'Discos duros, memorias USB, tarjetas SD y unidades SSD', '["Creación de imagen espejo del soporte dañado para no alterar el original","Escaneo profundo de sectores y reconstrucción de particiones RAW","Extracción organizada por tipo de archivo (fotos, docs, contabilidad)"]'::jsonb, '1 a 3 días hábiles', 'Desde $90.000 COP (Según volumen y complejidad)', FALSE),
(11, 'Mantenimiento y Ensamble de PC Gamer / Estaciones', 'actualizacion', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>', 'Armado profesional desde cero, gestión estética de cables, instalación de refrigeración líquida y optimización de curvas de ventilación.', '["Gestión impecable de cables en parte trasera para mejor flujo de aire","Perfil XMP y BIOS configurados para exprimir el rendimiento","Mantenimiento preventivo de tarjetas gráficas dedicadas (repaste + thermal pads)"]'::jsonb, 'Computadores Gamer, estaciones de diseño, arquitectura e ingeniería', '["Montaje meticuloso de componentes con protección antiestática","Aplicación de pasta térmica de alta gama en CPU y GPU","Configuración de iluminación ARGB sincronizada","Pruebas de estrés combinado FurMark + Cinebench"]'::jsonb, '3 a 6 horas', 'Desde $120.000 COP', FALSE),
(12, 'Asesoría Técnica y Diagnóstico Remoto', 'software', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 'Orientación experta para compra de equipos según tu presupuesto o soporte a distancia mediante herramientas seguras.', '["Resuelve dudas antes de invertir mal tu dinero","Soporte sin moverte de casa para problemas de software sencillos","Atención personalizada por un técnico certificado"]'::jsonb, 'Cualquier usuario en Anorí, Antioquia y toda Colombia', '["Análisis de requerimientos de uso (diseño, ingeniería, oficina, estudio)","Comparativa técnica entre modelos de mercado","Recomendación de especificaciones mínimas requeridas","Acompañamiento en adquisición y primera configuración"]'::jsonb, '1 hora', '$30.000 COP (Gratis al contratar servicio)', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Sincronizar secuencia de IDs de servicios
SELECT setval('servicios_id_seq', (SELECT MAX(id) FROM servicios));

-- FAQs Iniciales
INSERT INTO faqs (pregunta, respuesta, categoria, orden)
VALUES
('¿Cuánto tiempo toma una reparación o mantenimiento?', 'El mantenimiento preventivo y el cambio a SSD suelen tomar entre 2 y 4 horas hábiles. Diagnósticos electrónicos avanzados o reparaciones de placa madre requieren de 24 a 48 horas para pruebas exhaustivas.', 'Tiempos y Procesos', 1),
('¿Qué garantía tienen los repuestos y servicios?', 'Ofrecemos garantía por escrito: 12 meses en unidades SSD y memorias RAM nuevas, 6 meses en pantallas y teclados, y 3 meses en reparaciones electrónicas de placa.', 'Garantías', 2),
('¿Tienen servicio de recogida a domicilio en Anorí, Antioquia?', 'Sí, contamos con cobertura de recogida y entrega a domicilio en el casco urbano de Anorí, Antioquia, o atención directa en nuestro taller del Parque Principal (diagonal a la Iglesia San Luis Gonzaga).', 'Cobertura y Domicilios', 3),
('¿Mis archivos personales están seguros durante el servicio?', 'Absolutamente. Aplicamos política estricta de confidencialidad conforme a la Ley 1581 de 2012 de Colombia. Tus datos personales no son abiertos ni alterados.', 'Seguridad y Privacidad', 4),
('¿Puedo cotizar antes de autorizar la reparación?', 'Sí. Siempre emitimos un diagnóstico claro y una cotización previa detallada. No realizamos ninguna intervención sin tu autorización explícita.', 'Costos y Cotizaciones', 5)
ON CONFLICT DO NOTHING;
