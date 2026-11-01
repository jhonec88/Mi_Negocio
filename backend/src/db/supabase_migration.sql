-- ============================================================================
-- SCRIPT DE MIGRACIÓN ESTANDARIZADO PARA SUPABASE (JECTECH SOLUCIONES)
-- Compatible con: Supabase SQL Editor / PostgreSQL Cloud (Versión 15/16)
-- Incluye: Esquema DDL, Constraints, Datos Actuales (Anorí, Antioquia) y Sincronización de Secuencias
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- PostgreSQL database dump
--



-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- CREATE SCHEMA public (existente por defecto en Supabase)


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--




SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: configuracion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuracion (
    clave character varying(100) NOT NULL,
    valor text NOT NULL,
    descripcion text,
    actualizado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    pregunta text NOT NULL,
    respuesta text NOT NULL,
    categoria character varying(80) DEFAULT 'general'::character varying,
    orden integer DEFAULT 0,
    activo boolean DEFAULT true,
    creado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: mensajes_contacto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mensajes_contacto (
    id integer NOT NULL,
    nombre character varying(120) NOT NULL,
    telefono character varying(50) NOT NULL,
    email character varying(120),
    tipo_solicitud character varying(100) NOT NULL,
    mensaje text NOT NULL,
    estado character varying(30) DEFAULT 'nuevo'::character varying,
    origen character varying(50) DEFAULT 'web'::character varying,
    ip_origen character varying(45),
    notas_internas text,
    creado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: mensajes_contacto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mensajes_contacto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mensajes_contacto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mensajes_contacto_id_seq OWNED BY public.mensajes_contacto.id;


--
-- Name: pedidos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedidos (
    id integer NOT NULL,
    codigo_pedido character varying(50) NOT NULL,
    cliente_nombre character varying(120),
    cliente_telefono character varying(50),
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    total integer DEFAULT 0 NOT NULL,
    estado character varying(30) DEFAULT 'pendiente'::character varying,
    canal character varying(30) DEFAULT 'whatsapp'::character varying,
    creado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedidos_id_seq OWNED BY public.pedidos.id;


--
-- Name: productos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    categoria character varying(100) NOT NULL,
    marca character varying(100),
    precio integer NOT NULL,
    imagen character varying(255) NOT NULL,
    disponible character varying(30) DEFAULT 'disponible'::character varying,
    destacado boolean DEFAULT false,
    descripcion text,
    especificaciones jsonb DEFAULT '{}'::jsonb,
    stock integer DEFAULT 10,
    activo boolean DEFAULT true,
    creado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- Name: secciones_home; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.secciones_home (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    subtitulo character varying(255),
    descripcion text NOT NULL,
    imagen character varying(255) NOT NULL,
    texto_boton character varying(100) DEFAULT 'Más Información'::character varying,
    enlace_boton character varying(255) DEFAULT 'contacto.html'::character varying,
    posicion_texto character varying(50) DEFAULT 'centro'::character varying,
    orden integer DEFAULT 0,
    activo boolean DEFAULT true,
    creado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    clave_seccion character varying(100),
    pagina character varying(50) DEFAULT 'inicio'::character varying
);


--
-- Name: secciones_home_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.secciones_home_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: secciones_home_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.secciones_home_id_seq OWNED BY public.secciones_home.id;


--
-- Name: servicios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servicios (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    categoria character varying(80) NOT NULL,
    icono text,
    descripcion text NOT NULL,
    beneficios jsonb DEFAULT '[]'::jsonb,
    equipos_compatibles text,
    tareas_incluidas jsonb DEFAULT '[]'::jsonb,
    tiempo_estimado character varying(100),
    precio_referencia character varying(100),
    destacado boolean DEFAULT false,
    activo boolean DEFAULT true,
    creado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servicios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servicios_id_seq OWNED BY public.servicios.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(120) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol character varying(30) DEFAULT 'admin'::character varying,
    activo boolean DEFAULT true,
    ultimo_login timestamp with time zone,
    creado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: mensajes_contacto id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensajes_contacto ALTER COLUMN id SET DEFAULT nextval('public.mensajes_contacto_id_seq'::regclass);


--
-- Name: pedidos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id SET DEFAULT nextval('public.pedidos_id_seq'::regclass);


--
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- Name: secciones_home id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secciones_home ALTER COLUMN id SET DEFAULT nextval('public.secciones_home_id_seq'::regclass);


--
-- Name: servicios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicios ALTER COLUMN id SET DEFAULT nextval('public.servicios_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.configuracion (clave, valor, descripcion, actualizado_en) VALUES ('garantia_estandar', 'Hasta 12 meses por escrito según componente', 'Términos generales de garantía', '2026-10-25 16:06:33.088165+00');
INSERT INTO public.configuracion (clave, valor, descripcion, actualizado_en) VALUES ('business_name', 'JecTech Soluciones', 'Nombre comercial de la empresa', '2026-10-30 06:55:55.302654+00');
INSERT INTO public.configuracion (clave, valor, descripcion, actualizado_en) VALUES ('whatsapp_phone', '573001234567', 'Número oficial de WhatsApp en formato internacional sin signos', '2026-10-30 06:55:55.307691+00');
INSERT INTO public.configuracion (clave, valor, descripcion, actualizado_en) VALUES ('email_contacto', 'jhonec88@tecnofix.com.co', 'Correo principal de atención', '2026-10-30 06:55:55.311294+00');
INSERT INTO public.configuracion (clave, valor, descripcion, actualizado_en) VALUES ('direccion_taller', 'Carrera 29 # 28-20, Sector Tecnológico, Anorí Antioquia', 'Dirección física del taller principal', '2026-10-30 06:55:55.314213+00');
INSERT INTO public.configuracion (clave, valor, descripcion, actualizado_en) VALUES ('horario_atencion', 'Lunes a Sábado: 9:00 AM a 6:00 PM', 'Horario de apertura al público', '2026-10-30 06:55:55.316883+00');


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.faqs (id, pregunta, respuesta, categoria, orden, activo, creado_en) VALUES (1, '¿Cuánto tiempo toma una reparación o mantenimiento?', 'El mantenimiento preventivo y el cambio a SSD suelen tomar entre 2 y 4 horas hábiles. Diagnósticos electrónicos avanzados o reparaciones de placa madre requieren de 24 a 48 horas para pruebas exhaustivas.', 'Tiempos y Procesos', 1, true, '2026-10-25 16:06:33.103561+00');
INSERT INTO public.faqs (id, pregunta, respuesta, categoria, orden, activo, creado_en) VALUES (2, '¿Qué garantía tienen los repuestos y servicios?', 'Ofrecemos garantía por escrito: 12 meses en unidades SSD y memorias RAM nuevas, 6 meses en pantallas y teclados, y 3 meses en reparaciones electrónicas de placa.', 'Garantías', 2, true, '2026-10-25 16:06:33.103561+00');
INSERT INTO public.faqs (id, pregunta, respuesta, categoria, orden, activo, creado_en) VALUES (4, '¿Mis archivos personales están seguros durante el servicio?', 'Absolutamente. Aplicamos política estricta de confidencialidad conforme a la Ley 1581 de 2012 de Colombia. Tus datos personales no son abiertos ni alterados.', 'Seguridad y Privacidad', 4, true, '2026-10-25 16:06:33.103561+00');
INSERT INTO public.faqs (id, pregunta, respuesta, categoria, orden, activo, creado_en) VALUES (5, '¿Puedo cotizar antes de autorizar la reparación?', 'Sí. Siempre emitimos un diagnóstico claro y una cotización previa detallada. No realizamos ninguna intervención sin tu autorización explícita.', 'Costos y Cotizaciones', 5, true, '2026-10-25 16:06:33.103561+00');
INSERT INTO public.faqs (id, pregunta, respuesta, categoria, orden, activo, creado_en) VALUES (3, '¿Tienen servicio de recogida a domicilio en Anorí, Antioquia?', 'Sí, contamos con cobertura de recogida y entrega a domicilio en el casco urbano de Anorí, Antioquia, o atención directa en nuestro taller del Parque Principal (diagonal a la Iglesia San Luis Gonzaga).', 'Cobertura y Domicilios', 3, true, '2026-10-25 16:06:33.103561+00');


--
-- Data for Name: mensajes_contacto; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.mensajes_contacto (id, nombre, telefono, email, tipo_solicitud, mensaje, estado, origen, ip_origen, notas_internas, creado_en, actualizado_en) VALUES (2, 'alexis carvajal', '3003667248', 'alexiscarvajal053@gmail.com', 'Actualización de Hardware (Instalación de SSD / RAM)', 'mi computador es un nitro 5 y deseo aumentarle la memoria ram', 'nuevo', 'web', '::1', NULL, '2026-10-29 05:47:34.478845+00', '2026-10-29 06:39:12.56616+00');


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (4, 'Memoria RAM Crucial DDR4 16 GB 3200MHz para Portátil', 'Memorias RAM', 'Crucial', 185000, 'assets/images/productos/ram-laptop.jpg', 'disponible', false, 'Módulo SO-DIMM para aumentar la multitarea y velocidad de respuesta en computadores portátiles modernos.', '{"Tipo": "DDR4 SO-DIMM para laptop", "Voltaje": "1.2 V", "Garantia": "12 meses directa", "Capacidad": "16 GB", "Frecuencia": "3200 MHz"}', 18, true, '2026-10-25 16:06:33.09228+00', '2026-10-25 16:06:33.09228+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (10, 'Monitor Profesional LG UltraGear 24 Pulgadas 144Hz', 'Monitores', 'LG', 690000, 'assets/images/uploads/prod_1793335869850_Monitor_Profesional_LG_UltraGe.jpg', 'disponible', true, 'Tasa de refresco ultra fluida de 144 Hz, 1 ms de tiempo de respuesta y panel IPS para colores exactos.', '{"Panel": "IPS antirreflejo", "Puertos": "1x HDMI, 1x DisplayPort, salida de audio", "Tamaño": "24 pulgadas (1920 x 1080 FHD)", "Frecuencia": "144 Hz nativos", "Tiempo de respuesta": "1 ms MBR"}', 10, true, '2026-10-25 16:06:33.09228+00', '2026-10-30 04:51:11.669246+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (14, 'Base Refrigerante para Portátil con 6 Ventiladores LED', 'Accesorios tecnológicos', 'TechCool', 85000, 'assets/images/productos/base-refrigerante.jpg', 'disponible', false, 'Flujo de aire constante con 6 ventiladores silenciosos, soporte ergonómico de 5 niveles y puertos USB duales.', '{"Puertos": "2 puertos USB 2.0 de paso", "Ventiladores": "6 ventiladores con iluminación LED azul", "Compatibilidad": "Portátiles de 12 hasta 17.3 pulgadas", "Niveles de inclinacion": "5 ángulos ajustables"}', 16, true, '2026-10-25 16:06:33.09228+00', '2026-10-29 02:57:24.527994+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (8, 'Combo Teclado y Mouse Inalámbrico Logitech MK270', 'Teclados y mouse', 'Logitech', 110000, 'assets/images/uploads/prod_1793335952945_Combo_Teclado_y_Mouse_Inal_mbr.jpg', 'disponible', false, 'Conexión inalámbrica fiable de 2.4 GHz de largo alcance, teclas multimedia y batería de duración prolongada.', '{"Alcance": "Hasta 10 metros", "Conectividad": "Inalámbrica con nano receptor USB", "Distribucion": "Español con teclado numérico", "Bateria mouse": "Hasta 12 meses", "Bateria teclado": "Hasta 36 meses"}', 20, true, '2026-10-25 16:06:33.09228+00', '2026-10-30 04:52:37.230013+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (1, 'SSD Kingston A400 480 GB SATA III', 'SSD y almacenamiento', 'Kingston', 145000, 'assets/images/productos/ssd-kingston.jpg', 'disponible', true, 'Unidad de estado sólido de alta velocidad para revivir y acelerar portátiles y equipos de escritorio.', '{"Formato": "2.5 pulgadas (7 mm)", "Garantia": "12 meses directa", "Interfaz": "SATA III 6 Gb/s", "Capacidad": "480 GB", "Lectura secuencial": "Hasta 500 MB/s", "Escritura secuencial": "Hasta 450 MB/s"}', 25, true, '2026-10-25 16:06:33.09228+00', '2026-10-25 16:06:33.09228+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (3, 'Memoria RAM Kingston Fury Beast DDR4 8 GB 3200MHz', 'Memorias RAM', 'Kingston', 95000, 'assets/images/productos/ram-ddr4.jpg', 'disponible', true, 'Módulo de memoria RAM con disipador de perfil bajo para equipos de escritorio y estaciones de trabajo.', '{"Tipo": "DDR4 UDIMM", "Voltaje": "1.35 V", "Latencia": "CL16", "Capacidad": "8 GB", "Frecuencia": "3200 MHz", "Compatibilidad": "Intel XMP 2.0 y AMD Ryzen"}', 30, true, '2026-10-25 16:06:33.09228+00', '2026-10-25 16:06:33.09228+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (6, 'Portátil ASUS VivoBook 15 OLED', 'Computadores portátiles', 'ASUS', 2680000, 'assets/images/productos/laptop-asus.jpg', 'disponible', false, 'Increíble pantalla OLED con colores vivos, procesador AMD Ryzen 5 y diseño ultradelgado para trabajo y estudio.', '{"Peso": "1.7 kg", "Garantia": "12 meses de fábrica", "Pantalla": "15.6 pulgadas OLED FHD", "Procesador": "AMD Ryzen 5 5600H", "Memoria RAM": "8 GB DDR4 (Expandible)", "Almacenamiento": "512 GB SSD PCIe"}', 7, true, '2026-10-25 16:06:33.09228+00', '2026-10-25 16:06:33.09228+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (7, 'Computador de Escritorio Torre Ensamblada Core i5 Pro', 'Computadores de escritorio', 'Custom', 2150000, 'assets/images/productos/pc-torre.png', 'disponible', true, 'Equipo de escritorio ideal para oficina, contabilidad y multitarea pesada. Optimizado con componentes certificados.', '{"RAM": "16 GB DDR4 Dual Channel", "Disco": "SSD NVMe 500 GB", "Fuente": "500W con certificación", "Garantia": "12 meses en hardware", "Placa base": "Chipset H510M con HDMI y VGA", "Procesador": "Intel Core i5-10400 6 núcleos / 12 hilos"}', 8, true, '2026-10-25 16:06:33.09228+00', '2026-10-25 16:06:33.09228+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (9, 'Teclado Mecánico RGB Redragon Kumara K552', 'Teclados y mouse', 'Redragon', 165000, 'assets/images/productos/teclado-mecanico.jpg', 'disponible', false, 'Estructura metálica resistente, interruptores Outemu mecánicos y retroiluminación personalizable.', '{"Formato": "Tenkeyless (TKL compacto 80%)", "Conexion": "USB chapado en oro", "Construccion": "Aluminio y ABS reforzado", "Anti-ghosting": "100% teclas con N-Key Rollover", "Tipo de Switch": "Mecánico Outemu Red / Blue"}', 14, true, '2026-10-25 16:06:33.09228+00', '2026-10-25 16:06:33.09228+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (11, 'Router Gigabit Wi-Fi 6 TP-Link Archer AX12', 'Equipos de redes', 'TP-Link', 185000, 'assets/images/productos/router-tplink.jpg', 'disponible', false, 'Tecnología Wi-Fi 6 de nueva generación con mayor velocidad, capacidad para más dispositivos y cobertura ampliada.', '{"Antenas": "4 antenas externas de alta ganancia", "Puertos": "3 puertos LAN Gigabit + 1 WAN Gigabit", "Estandar": "Wi-Fi 6 (802.11ax/ac/n/a/b/g)", "Seguridad": "WPA3 de última generación", "Velocidad dual": "Hasta 1201 Mbps en 5 GHz + 300 Mbps en 2.4 GHz"}', 12, true, '2026-10-25 16:06:33.09228+00', '2026-10-25 16:06:33.09228+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (12, 'Pasta Térmica de Alto Rendimiento Arctic MX-4 (4g)', 'Accesorios tecnológicos', 'Arctic', 45000, 'assets/images/productos/pasta-termica.jpg', 'disponible', false, 'Compuesto térmico microparticulado a base de carbono que garantiza una disipación óptima del calor en CPUs y GPUs.', '{"Contenido": "4 gramos en jeringa aplicadora", "Durabilidad": "Hasta 8 años de rendimiento constante", "Conductividad": "Alta conductividad térmica sin metales", "Conductividad electrica": "No conductor (seguro contra cortocircuitos)"}', 40, true, '2026-10-25 16:06:33.09228+00', '2026-10-25 16:06:33.09228+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (13, 'Cable HDMI 2.1 Ultra Alta Velocidad 8K 60Hz / 4K 120Hz (2m)', 'Cables y adaptadores', 'UGreen', 38000, 'assets/images/productos/cable-hdmi.jpg', 'disponible', false, 'Ancho de banda de 48 Gbps con soporte HDR dinámico, eARC y conectores reforzados en nylon trenzado.', '{"Largo": "2 metros", "Version": "HDMI 2.1 (Compatible con 2.0 y 1.4)", "Blindaje": "Triple capa contra interferencias electromagnéticas", "Resoluciones": "8K@60Hz, 4K@120Hz, 2K@144Hz"}', 35, true, '2026-10-25 16:06:33.09228+00', '2026-10-25 16:06:33.09228+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (2, 'SSD NVMe M.2 Samsung 980 1 TB PCIe 3.0', 'SSD y almacenamiento', 'Samsung', 930000, 'assets/images/productos/ssd-samsung.jpg', 'disponible', true, 'Almacenamiento NVMe ultrarrápido con tecnología V-NAND y control térmico inteligente para creadores y gamers.', '{"Formato": "M.2 (2280)", "Garantia": "12 meses directa", "Interfaz": "PCIe Gen 3.0 x4, NVMe 1.4", "Capacidad": "1 TB (1000 GB)", "Lectura secuencial": "Hasta 3.500 MB/s", "Escritura secuencial": "Hasta 3.000 MB/s"}', 15, true, '2026-10-25 16:06:33.09228+00', '2026-10-30 04:53:44.048318+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (15, 'Cargador Original para Portátil Lenovo / HP / ASUS 65W', 'Cables y adaptadores', 'Original', 95000, 'assets/images/uploads/prod_1793245441265_Cargador_Original.jpg', 'consultar', false, 'Adaptadores de corriente certificados con protección contra sobrevoltaje, cortocircuito y sobrecalentamiento.', '{"Garantia": "6 meses directa", "Potencia": "65W (Compatibles con modelos de 45W)", "Conectores": "Punta amarilla rectangular, Tipo C, Punta azul 4.5mm", "Voltaje de salida": "19V - 20V / 3.25A"}', 22, true, '2026-10-25 16:06:33.09228+00', '2026-10-29 03:45:18.520804+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (5, 'Portátil Corporativo Lenovo ThinkPad E14 Gen 4', 'Computadores portátiles', 'Lenovo', 2950000, 'assets/images/productos/laptop-lenovo.jpg', 'disponible', true, 'Portátil empresarial resistente con procesador Intel Core i5 de 12ª generación, 16 GB de RAM y 512 GB SSD NVMe.', '{"Sistema": "Windows 11 Pro licenciado", "Teclado": "Resistente a salpicaduras con TrackPoint", "Pantalla": "14 pulgadas FHD Antirreflejo", "Procesador": "Intel Core i5-1235U (10 núcleos)", "Memoria RAM": "16 GB DDR4 3200MHz", "Almacenamiento": "512 GB SSD NVMe M.2"}', 10, true, '2026-10-25 16:06:33.09228+00', '2026-10-29 03:54:09.922174+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (18, 'Tarjeta de Video Nvidia Msi Geforce Rtx 3050 Ventus 2x 6gb Oc Gddr6', 'Video', 'Nvidia', 1150000, 'assets/images/uploads/prod_1793245142188_Tarjeta_de_Video_Nvidia_Msi_Ge.jpg', 'disponible', true, 'Este componente electrónico procesa la información que llega al dispositivo y los transforma en imágenes o videos para mostrarla visualmente. Es ideal para trabajar con aplicaciones gráficas ya que permite obtener imágenes más nítidas.', '{"Garantía": "12 meses", "Contectividad:": "HDMI, DisplayPort", "Tamaño de memoria:": "6 GB", "Tipo de memoria gráfica:": "GDDR6", "Interfaz con la placa madre:": "PCI Express 4.0 x16"}', 10, true, '2026-10-29 02:59:52.665807+00', '2026-10-30 04:56:47.077803+00');
INSERT INTO public.productos (id, nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock, activo, creado_en, actualizado_en) VALUES (17, 'Adaptador usb a tipo', 'Adaptador', 'Generica', 25000, 'assets/images/productos/placeholder-tech.svg', 'disponible', false, 'Adaptador USB 3.0 macho a Tipo-C hembra de alta velocidad', '{"Material": "Aleación de aluminio", "Garantía": "6 meses", "Velocidad": "Hasta 5 Gbps", "Conector salida": "USB Tipo-C Hembra", "Conector entrada": "USB 3.0 Macho"}', 6, true, '2026-10-25 16:52:19.668277+00', '2026-10-30 04:57:14.837473+00');


--
-- Data for Name: secciones_home; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (12, 'Donde queda Anorí', 'Ven y visitanos estamos ubicados en el municipio de Anorí', 'Anorí es un municipio colombiano ubicado en la subregión del Nordeste del departamento de Antioquia.', 'assets/images/uploads/home_1793326229881_DJI_0341.jpg', 'Más Información', 'contacto.html', 'izquierda', 1, true, '2026-10-30 02:11:00.72474+00', '2026-10-30 04:13:14.170624+00', NULL, 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (3, 'Soluciones tecnológicas para tu día a día', 'Servicio Técnico Certificado • Colombia', 'Servicio profesional de reparación, mantenimiento y optimización de computadores portátiles y de escritorio. También encontrarás repuestos, componentes y accesorios tecnológicos garantizados.', 'assets/images/galeria/taller-1.svg', 'Solicitar servicio técnico', 'servicios.html', 'izquierda', 1, true, '2026-10-30 01:58:31.512815+00', '2026-10-30 01:58:31.512815+00', 'hero', 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (4, '¿Cómo te podemos ayudar hoy?', 'Rutas de atención', 'Hemos estructurado nuestras soluciones para que encuentres exactamente lo que necesitas en segundos.', 'assets/images/galeria/taller-2.svg', 'Ver todos los servicios', 'servicios.html', 'centro', 2, true, '2026-10-30 01:58:31.51751+00', '2026-10-30 01:58:31.51751+00', 'rutas', 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (5, '¿Qué problema tiene tu computador?', 'Asistente Interactivo', 'Selecciona el síntoma principal que presenta tu equipo para recibir una orientación técnica inmediata sobre causas probables y solución recomendada.', 'assets/images/galeria/taller-3.svg', 'Diagnosticar equipo', 'servicios.html', 'centro', 3, true, '2026-10-30 01:58:31.520391+00', '2026-10-30 01:58:31.520391+00', 'diagnostico', 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (6, 'Nuestras soluciones más solicitadas', 'Servicios Profesionales', 'Reparación de hardware, mantenimiento preventivo y optimización integral de equipos con repuestos de calidad certificada.', 'assets/images/galeria/taller-4.svg', 'Ver los 12 servicios técnicos disponibles', 'servicios.html', 'centro', 4, true, '2026-10-30 01:58:31.523033+00', '2026-10-30 01:58:31.523033+00', 'servicios_destacados', 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (7, 'Componentes y tecnología recomendada', 'Catálogo Destacado', 'Precios referenciales en pesos colombianos con garantía directa y consulta de existencias por WhatsApp.', 'assets/images/productos/ssd-kingston.svg', 'Explorar catálogo completo de productos', 'productos.html', 'centro', 5, true, '2026-10-30 01:58:31.525849+00', '2026-10-30 01:58:31.525849+00', 'productos_destacados', 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (8, 'Antes y Después: Mantenimiento térmico', 'Galería Real', 'Arrastra el control central para ver el impacto de una limpieza profesional y el cambio de compuesto térmico en la temperatura y rendimiento del equipo.', 'assets/images/galeria/limpieza-despues.svg', 'Cotizar Mantenimiento', 'servicios.html', 'centro', 6, true, '2026-10-30 01:58:31.528448+00', '2026-10-30 01:58:31.528448+00', 'antes_despues', 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (9, 'Por qué confiar tus equipos con nosotros', 'Compromiso Profesional', 'Cuidamos la información de tus computadores y aseguramos cada trabajo con transparencia técnica.', 'assets/images/galeria/taller-1.svg', 'Conocer Nuestro Taller', 'nosotros.html', 'centro', 7, true, '2026-10-30 01:58:31.530817+00', '2026-10-30 01:58:31.530817+00', 'valores', 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (11, '¿Listo para optimizar o reparar tu equipo?', 'Atención Directa', 'Escríbenos directamente a WhatsApp contándonos la marca, modelo y falla de tu equipo para recibir una cotización personalizada sin compromiso.', 'assets/images/galeria/taller-1.svg', 'Formulario de contacto', 'contacto.html', 'centro', 9, true, '2026-10-30 01:58:31.535071+00', '2026-10-30 01:58:31.535071+00', 'cta_final', 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (13, 'Pasión por la tecnología y excelencia en servicio técnico', 'Perfil Profesional', 'Nacimos con el propósito de ofrecer un servicio técnico honesto, transparente y con repuestos de calidad, donde cada cliente entiende con claridad lo que su equipo necesita.', 'assets/images/galeria/taller-1.svg', 'Ver Servicios', 'servicios.html', 'centro', 1, true, '2026-10-30 02:39:04.036847+00', '2026-10-30 02:39:04.036847+00', 'nosotros_cabecera', 'nosotros');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (14, 'Más de 10 años recuperando equipos y solucionando fallas complejas', 'Nuestra Trayectoria', 'En JecTech Soluciones entendemos que tu computador no es solo una máquina: es tu herramienta de trabajo, estudio y comunicación. Por eso, tratamos cada equipo con el mayor cuidado técnico y absoluto respeto por la privacidad de tu información.', 'assets/images/galeria/taller-2.svg', 'Ver servicios', 'servicios.html', 'izquierda', 2, true, '2026-10-30 02:39:04.043621+00', '2026-10-30 02:39:04.043621+00', 'nosotros_historia', 'nosotros');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (15, 'Nuestros valores fundamentales', 'Cultura de Trabajo', 'Cuidamos tu equipo como si fuera propio, explicamos el diagnóstico en lenguaje claro, damos atención personalizada y utilizamos insumos premium con pruebas de estrés.', 'assets/images/galeria/taller-3.svg', 'Contactar al Taller', 'contacto.html', 'centro', 3, true, '2026-10-30 02:39:04.047531+00', '2026-10-30 02:39:04.047531+00', 'nosotros_valores', 'nosotros');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (16, 'Resultados reales en nuestro taller', 'Galería de Trabajos', 'Observa el contraste de una limpieza térmica profesional con eliminación de polvo obstructivo y renovación de compuesto térmico.', 'assets/images/galeria/limpieza-despues.svg', 'Solicitar Mantenimiento', 'contacto.html', 'centro', 4, true, '2026-10-30 02:39:04.052091+00', '2026-10-30 02:39:04.052091+00', 'nosotros_galeria', 'nosotros');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (17, 'Lo que dicen quienes confían en nosotros', 'Opiniones Verificadas', 'La satisfacción de nuestros clientes particulares y empresas es nuestro mejor respaldo.', 'assets/images/galeria/taller-4.svg', 'Cotizar Ahora', 'contacto.html', 'centro', 5, true, '2026-10-30 02:39:04.056462+00', '2026-10-30 02:39:04.056462+00', 'nosotros_testimonios', 'nosotros');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (19, 'Estamos listos para atenderte', 'Datos de Atención', 'Brindamos atención personalizada en taller, servicio de recogida y entrega a domicilio y soporte remoto para toda Colombia.', 'assets/images/galeria/taller-2.svg', 'Escribir directamente al WhatsApp del técnico', 'contacto.html', 'izquierda', 2, true, '2026-10-30 02:39:04.064087+00', '2026-10-30 02:39:04.064087+00', 'contacto_datos', 'contacto');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (21, 'Formulario de Solicitud', 'Cotización Estructurada', 'Completa los siguientes campos para redactar un mensaje estructurado con los detalles exactos de tu requerimiento.', 'assets/images/galeria/taller-4.svg', 'Preparar solicitud para WhatsApp', 'contacto.html', 'derecha', 4, true, '2026-10-30 02:39:04.071782+00', '2026-10-30 02:39:04.071782+00', 'contacto_formulario', 'contacto');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (20, 'Taller Principal Anori Antioquia', 'Cra 29 nro 28 - 20 Parque principal', 'Estamos ubicados en el prque principar de Anori diagona a la iglesio san luis gonzaga. 

acercate y pregunta sin compromiso aqui te atenderemos con el mayor de los gustos', 'assets/images/uploads/home_1793329878591_DJI_0341.jpg', 'Ver Servicios', 'servicios.html', 'izquierda', 3, true, '2026-10-30 02:39:04.068259+00', '2026-10-30 03:11:22.291006+00', 'contacto_ubicacion', 'contacto');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (10, 'Respuestas Rápidas sobre Servicio Técnico en Anorí, Antioquia', 'AEO & Local SEO', 'Información concreta y verificada sobre precios, tiempos de entrega, garantías y modalidades de atención para usuarios y asistentes de búsqueda.', 'assets/images/hero/hero-taller.svg', 'Ver Preguntas Frecuentes', 'contacto.html', 'centro', 8, true, '2026-10-30 01:58:31.533015+00', '2026-10-30 06:12:39.204058+00', 'aeo_local', 'inicio');
INSERT INTO public.secciones_home (id, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo, creado_en, actualizado_en, clave_seccion, pagina) VALUES (18, 'Contacto y Servicio Técnico en Anori Antioquia', 'Canal Directo & Localización', 'Comunícate con nuestro laboratorio técnico en Anori (Antioquia). Diligencia el formulario asistido o escríbenos directamente a WhatsApp para cotización inmediata. No dejes de llenar tu formulario de solicitud para una atencion mas personalizada.', 'assets/images/galeria/taller-1.svg', 'Escribir por WhatsApp', 'contacto.html', 'centro', 1, true, '2026-10-30 02:39:04.060043+00', '2026-10-30 06:57:58.434493+00', 'contacto_cabecera', 'contacto');


--
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (1, 'Mantenimiento Preventivo', 'mantenimiento', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>', 'Limpieza interna profunda, desensamble cuidadoso, cambio de pasta térmica de alto rendimiento y lubricación de ventiladores.', '["Reduce temperaturas de trabajo hasta en 20°C", "Elimina polvo acumulado y evita cortocircuitos", "Alarga significativamente la vida útil de CPU y GPU"]', 'Portátiles de todas las marcas y Computadores de escritorio / Torres Gamer', '["Desarme completo y aspirado con brocha antiestática", "Limpieza de disipadores y soplado de ventiladores", "Remoción de pasta térmica seca y aplicación de compuesto térmico premium", "Limpieza química externa de carcasa, teclado y pantalla", "Test de estrés térmico de 30 minutos"]', '2 a 4 horas hábiles', 'Desde $60.000 COP', true, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (2, 'Mantenimiento Correctivo y Diagnóstico', 'mantenimiento', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>', 'Identificación precisa de fallas de encendido, bloqueos, pantallas azules y comportamiento errático con instrumental especializado.', '["Diagnóstico certero con pruebas de banco", "Cotización previa sin sorpresas antes de reparar", "Revisión de componentes individuales"]', 'Portátiles, All-in-One y Computadores de Torre', '["Inspección visual de placa madre bajo microscopio", "Medición de líneas de voltaje principales con multímetro y osciloscopio", "Prueba de salud de disco con análisis S.M.A.R.T.", "Prueba exhaustiva de memoria RAM con MemTest86", "Informe técnico detallado para el cliente"]', '24 horas hábiles', 'Diagnóstico desde $30.000 COP (Deducible de la reparación)', true, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (3, 'Reparación y Reemplazo de Pantallas', 'hardware', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 'Sustitución de pantallas rotas, con líneas verticales, parpadeos o fallas de retroiluminación en portátiles.', '["Repuestos grado A+ nuevos con cero píxeles muertos", "Resoluciones HD, Full HD, IPS y tasas de 144Hz", "Instalación limpia sin marcas en marcos ni biseles"]', 'Portátiles HP, Lenovo, Dell, Asus, Acer, Apple MacBook', '["Desensamble seguro del bisel frontal y tapa trasera", "Desconexión de batería para proteger el circuito backlight de la placa", "Prueba de compatibilidad con cable flex de 30 o 40 pines", "Instalación y calibración de colores", "Garantía escrita de 6 meses en display"]', '1 a 3 horas (según disponibilidad de display)', 'Desde $220.000 COP (Incluye repuesto e instalación)', true, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (4, 'Cambio a Disco de Estado Sólido (SSD)', 'actualizacion', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>', 'Actualización definitiva para multiplicar hasta por 10 la velocidad de arranque y respuesta de cualquier computador lento.', '["El computador enciende en menos de 15 segundos", "Apertura instantánea de programas pesados (Chrome, Office, Photoshop)", "Menor consumo de energía y cero ruido de partes mecánicas"]', 'Cualquier computador portátil o torre con disco duro mecánico (HDD)', '["Asesoría técnica entre formato SATA 2.5 pulg o NVMe M.2", "Clonación bit a bit de tu sistema actual o instalación limpia", "Conservación íntegra de archivos personales", "Configuración de modo AHCI y TRIM en BIOS"]', '2 a 4 horas hábiles', 'Desde $145.000 COP (SSD 480GB + Instalación)', true, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (5, 'Ampliación y Optimización de Memoria RAM', 'actualizacion', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v20M18 2v20M2 6h4M2 12h4M2 18h4M18 6h4M18 12h4M18 18h4M6 6h12M6 18h12"></path></svg>', 'Expansión de memoria para trabajar fluidamente con múltiples pestañas abiertas, edición de video o renderizado 3D.', '["Elimina congelamientos al tener muchas aplicaciones abiertas", "Aprovechamiento de tecnología Dual-Channel", "Compatibilidad 100% garantizada con tu procesador"]', 'Equipos con tecnología DDR3, DDR4 y DDR5', '["Revisión de slots disponibles y capacidad máxima de la tarjeta madre", "Instalación de módulos emparejados en frecuencia y latencia", "Test de estabilidad en memoria de 60 minutos"]', '1 a 2 horas', 'Desde $95.000 COP (Módulo 8GB + Mano de obra)', false, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (6, 'Reparación Electrónica de Placa Madre (Motherboard)', 'hardware', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', 'Reparación a nivel de componentes: microsoldadura, reemplazo de integrados de carga, cortocircuitos por derrame de líquidos.', '["Ahorro de hasta un 70% frente al costo de cambiar la placa completa", "Recuperación de equipos dados por irreparables en otros talleres", "Uso de estación de soldadura profesional y microscopio trinocular"]', 'Placas de portátiles y torres de todas las marcas', '["Lavado ultrasónico en placa en caso de sulfatación por líquidos", "Identificación de componentes en corto (Mosfets, capacitores SMD)", "Reemplazo de chip controlador de carga (Charging IC / KBC)", "Pruebas de arranque en frío y en caliente"]', '2 a 5 días hábiles', 'Desde $160.000 COP (Sujeto a diagnóstico)', false, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (7, 'Reparación y Reconstrucción de Bisagras', 'hardware', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>', 'Reparación estructural de carcasas rotas, soportes plásticos desprendidos y bisagras trabadas o duras que rompen la pantalla.', '["Evita la rotura inminente de la pantalla por presión incorrecta", "Apertura y cierre suave garantizado", "Refuerzo con resina epóxica de alta resistencia mecánica"]', 'Portátiles con carcasas plásticas o de aleación de magnesio', '["Desarmado completo de la tapa y marco superior", "Aflojado y calibración de tensión de la bisagra metálica", "Reconstrucción de anclajes de tuercas doradas con polímero estructural", "Curado térmico para máxima rigidez"]', '1 a 2 días hábiles', 'Desde $80.000 COP por lado', false, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (8, 'Cambio de Teclados y Touchpad', 'hardware', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="10" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="14" y2="12"></line><line x1="18" y1="12" x2="18" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>', 'Sustitución de teclados con teclas pegadas, que escriben solos, o dañados por humedad, tanto de inserción como remachados.', '["Distribución en español con letra Ñ original", "Restauración de la experiencia de escritura fluida y rápida", "Instalación con soldadura plástica para teclados remachados de fábrica"]', 'Portátiles de todas las marcas y teclados mecánicos', '["Extracción limpia del teclado antiguo", "Limpieza de la membrana interna y conector zif", "Fijación precisa para evitar hundimiento en la parte central", "Prueba de cada tecla mediante software especializado"]', '2 a 4 horas hábiles', 'Desde $90.000 COP (Teclado + Instalación)', false, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (9, 'Instalación de Sistema Operativo y Software', 'software', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6-6-6"></path><path d="M12 19h8"></path></svg>', 'Instalación limpia de Windows 10, Windows 11 o Linux con controladores originales y paquete esencial de programas de oficina.', '["Sistema 100% libre de virus, spyware y programas basura", "Optimización de servicios en segundo plano para máxima velocidad", "Controladores del fabricante actualizados a su última versión"]', 'Cualquier computador portátil o de escritorio', '["Creación de respaldo previo de archivos si el cliente lo requiere", "Particionamiento adecuado del disco duro/SSD", "Instalación de sistema operativo actualizado", "Instalación de navegador con bloqueador de publicidad, visor PDF y compresión", "Paquete de ofimática y utilitarios indispensables"]', '2 a 3 horas hábiles', '$60.000 COP', true, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (10, 'Recuperación de Información y Copias de Seguridad', 'software', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>', 'Rescate de fotos, documentos y bases de datos borradas por error, formateo accidental o fallas en el disco.', '["Máxima confidencialidad y ética en el tratamiento de tus datos", "Evaluación de probabilidad de rescate antes de cobrar", "Entrega de información en medio seguro"]', 'Discos duros, memorias USB, tarjetas SD y unidades SSD', '["Creación de imagen espejo del soporte dañado para no alterar el original", "Escaneo profundo de sectores y reconstrucción de particiones RAW", "Extracción organizada por tipo de archivo (fotos, docs, contabilidad)"]', '1 a 3 días hábiles', 'Desde $90.000 COP (Según volumen y complejidad)', false, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (11, 'Mantenimiento y Ensamble de PC Gamer / Estaciones', 'actualizacion', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>', 'Armado profesional desde cero, gestión estética de cables, instalación de refrigeración líquida y optimización de curvas de ventilación.', '["Gestión impecable de cables en parte trasera para mejor flujo de aire", "Perfil XMP y BIOS configurados para exprimir el rendimiento", "Mantenimiento preventivo de tarjetas gráficas dedicadas (repaste + thermal pads)"]', 'Computadores Gamer, estaciones de diseño, arquitectura e ingeniería', '["Montaje meticuloso de componentes con protección antiestática", "Aplicación de pasta térmica de alta gama en CPU y GPU", "Configuración de iluminación ARGB sincronizada", "Pruebas de estrés combinado FurMark + Cinebench"]', '3 a 6 horas', 'Desde $120.000 COP', false, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');
INSERT INTO public.servicios (id, nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado, activo, creado_en, actualizado_en) VALUES (12, 'Asesoría Técnica y Diagnóstico Remoto', 'software', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 'Orientación experta para compra de equipos según tu presupuesto o soporte a distancia mediante herramientas seguras.', '["Resuelve dudas antes de invertir mal tu dinero", "Soporte sin moverte de casa para problemas de software sencillos", "Atención personalizada por un técnico certificado"]', 'Cualquier usuario en Anorí, Antioquia y toda Colombia', '["Análisis de requerimientos de uso (diseño, ingeniería, oficina, estudio)", "Comparativa técnica entre modelos de mercado", "Recomendación de especificaciones mínimas requeridas", "Acompañamiento en adquisición y primera configuración"]', '1 hora', '$30.000 COP (Gratis al contratar servicio)', false, true, '2026-10-25 16:06:33.098905+00', '2026-10-25 16:06:33.098905+00');


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuarios (id, nombre, email, password_hash, rol, activo, ultimo_login, creado_en, actualizado_en) VALUES (1, 'Administrador JecTech Soluciones', 'admin@tecnofix.com.co', '$2a$10$TFYykWX7qKEULTe07VCLouMWl8ptzrrUA5kXmSKR6T6ndv8TClVE2', 'admin', true, '2026-10-30 04:17:16.947406+00', '2026-10-25 16:06:33.084387+00', '2026-10-30 04:17:00.315815+00');


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.faqs_id_seq', 10, true);


--
-- Name: mensajes_contacto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mensajes_contacto_id_seq', 2, true);


--
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 1, false);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.productos_id_seq', 18, true);


--
-- Name: secciones_home_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.secciones_home_id_seq', 21, true);


--
-- Name: servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.servicios_id_seq', 12, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);


--
-- Name: configuracion configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (clave);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: mensajes_contacto mensajes_contacto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensajes_contacto
    ADD CONSTRAINT mensajes_contacto_pkey PRIMARY KEY (id);


--
-- Name: pedidos pedidos_codigo_pedido_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_codigo_pedido_key UNIQUE (codigo_pedido);


--
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- Name: secciones_home secciones_home_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secciones_home
    ADD CONSTRAINT secciones_home_pkey PRIMARY KEY (id);


--
-- Name: servicios servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--



