/**
 * ==========================================================================
 * BASE DE DATOS LOCAL DE PRODUCTOS TECNOLÓGICOS (SIN BACKEND)
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

const PRODUCTOS_DATA = [
  {
    id: 1,
    nombre: "SSD Kingston A400 480 GB SATA III",
    marca: "Kingston",
    categoria: "SSD y almacenamiento",
    precio: 145000,
    disponible: "disponible", // "disponible" | "agotado" | "consultar"
    imagen: "assets/images/productos/ssd-kingston.svg",
    descripcion: "Unidad de estado sólido de alta velocidad para revivir y acelerar portátiles y equipos de escritorio.",
    destacado: true,
    especificaciones: {
      "Capacidad": "480 GB",
      "Interfaz": "SATA III 6 Gb/s",
      "Formato": "2.5 pulgadas (7 mm)",
      "Lectura secuencial": "Hasta 500 MB/s",
      "Escritura secuencial": "Hasta 450 MB/s",
      "Garantía": "12 meses directa"
    }
  },
  {
    id: 2,
    nombre: "SSD NVMe M.2 Samsung 980 1 TB PCIe 3.0",
    marca: "Samsung",
    categoria: "SSD y almacenamiento",
    precio: 360000,
    disponible: "disponible",
    imagen: "assets/images/productos/ssd-samsung.svg",
    descripcion: "Almacenamiento NVMe ultrarrápido con tecnología V-NAND y control térmico inteligente para creadores y gamers.",
    destacado: true,
    especificaciones: {
      "Capacidad": "1 TB (1000 GB)",
      "Interfaz": "PCIe Gen 3.0 x4, NVMe 1.4",
      "Formato": "M.2 (2280)",
      "Lectura secuencial": "Hasta 3.500 MB/s",
      "Escritura secuencial": "Hasta 3.000 MB/s",
      "Garantía": "12 meses directa"
    }
  },
  {
    id: 3,
    nombre: "Memoria RAM Kingston Fury Beast DDR4 8 GB 3200MHz",
    marca: "Kingston",
    categoria: "Memorias RAM",
    precio: 95000,
    disponible: "disponible",
    imagen: "assets/images/productos/ram-ddr4.svg",
    descripcion: "Módulo de memoria RAM con disipador de perfil bajo para equipos de escritorio y estaciones de trabajo.",
    destacado: true,
    especificaciones: {
      "Capacidad": "8 GB",
      "Tipo": "DDR4 UDIMM",
      "Frecuencia": "3200 MHz",
      "Latencia": "CL16",
      "Voltaje": "1.35 V",
      "Compatibilidad": "Intel XMP 2.0 y AMD Ryzen"
    }
  },
  {
    id: 4,
    nombre: "Memoria RAM Crucial DDR4 16 GB 3200MHz para Portátil",
    marca: "Crucial",
    categoria: "Memorias RAM",
    precio: 185000,
    disponible: "disponible",
    imagen: "assets/images/productos/ram-laptop.svg",
    descripcion: "Módulo SO-DIMM para aumentar la multitarea y velocidad de respuesta en computadores portátiles modernos.",
    destacado: false,
    especificaciones: {
      "Capacidad": "16 GB",
      "Tipo": "DDR4 SO-DIMM para laptop",
      "Frecuencia": "3200 MHz",
      "Voltaje": "1.2 V",
      "Garantía": "12 meses directa"
    }
  },
  {
    id: 5,
    nombre: "Portátil Corporativo Lenovo ThinkPad E14 Gen 4",
    marca: "Lenovo",
    categoria: "Computadores portátiles",
    precio: 2950000,
    disponible: "consultar",
    imagen: "assets/images/productos/laptop-lenovo.svg",
    descripcion: "Portátil empresarial resistente con procesador Intel Core i5 de 12ª generación, 16 GB de RAM y 512 GB SSD NVMe.",
    destacado: true,
    especificaciones: {
      "Procesador": "Intel Core i5-1235U (10 núcleos)",
      "Memoria RAM": "16 GB DDR4 3200MHz",
      "Almacenamiento": "512 GB SSD NVMe M.2",
      "Pantalla": "14 pulgadas FHD Antirreflejo",
      "Teclado": "Resistente a salpicaduras con TrackPoint",
      "Sistema": "Windows 11 Pro licenciado"
    }
  },
  {
    id: 6,
    nombre: "Portátil ASUS VivoBook 15 OLED",
    marca: "ASUS",
    categoria: "Computadores portátiles",
    precio: 2680000,
    disponible: "disponible",
    imagen: "assets/images/productos/laptop-asus.svg",
    descripcion: "Increíble pantalla OLED con colores vivos, procesador AMD Ryzen 5 y diseño ultradelgado para trabajo y estudio.",
    destacado: false,
    especificaciones: {
      "Procesador": "AMD Ryzen 5 5600H",
      "Memoria RAM": "8 GB DDR4 (Expandible)",
      "Almacenamiento": "512 GB SSD PCIe",
      "Pantalla": "15.6 pulgadas OLED FHD",
      "Peso": "1.7 kg",
      "Garantía": "12 meses de fábrica"
    }
  },
  {
    id: 7,
    nombre: "Computador de Escritorio Torre Ensamblada Core i5 Pro",
    marca: "Custom",
    categoria: "Computadores de escritorio",
    precio: 2150000,
    disponible: "disponible",
    imagen: "assets/images/productos/pc-torre.svg",
    descripcion: "Equipo de escritorio ideal para oficina, contabilidad y multitarea pesada. Optimizado con componentes certificados.",
    destacado: true,
    especificaciones: {
      "Procesador": "Intel Core i5-10400 6 núcleos / 12 hilos",
      "Placa base": "Chipset H510M con HDMI y VGA",
      "RAM": "16 GB DDR4 Dual Channel",
      "Disco": "SSD NVMe 500 GB",
      "Fuente": "500W con certificación",
      "Garantía": "12 meses en hardware"
    }
  },
  {
    id: 8,
    nombre: "Combo Teclado y Mouse Inalámbrico Logitech MK270",
    marca: "Logitech",
    categoria: "Teclados y mouse",
    precio: 110000,
    disponible: "disponible",
    imagen: "assets/images/productos/combo-logitech.svg",
    descripcion: "Conexión inalámbrica fiable de 2.4 GHz de largo alcance, teclas multimedia y batería de duración prolongada.",
    destacado: false,
    especificaciones: {
      "Conectividad": "Inalámbrica con nano receptor USB",
      "Alcance": "Hasta 10 metros",
      "Batería teclado": "Hasta 36 meses",
      "Batería mouse": "Hasta 12 meses",
      "Distribución": "Español con teclado numérico"
    }
  },
  {
    id: 9,
    nombre: "Teclado Mecánico RGB Redragon Kumara K552",
    marca: "Redragon",
    categoria: "Teclados y mouse",
    precio: 165000,
    disponible: "disponible",
    imagen: "assets/images/productos/teclado-mecanico.svg",
    descripcion: "Estructura metálica resistente, interruptores Outemu mecánicos y retroiluminación personalizable.",
    destacado: false,
    especificaciones: {
      "Tipo de Switch": "Mecánico Outemu Red / Blue",
      "Formato": "Tenkeyless (TKL compacto 80%)",
      "Conexión": "USB chapado en oro",
      "Construcción": "Aluminio y ABS reforzado",
      "Anti-ghosting": "100% teclas con N-Key Rollover"
    }
  },
  {
    id: 10,
    nombre: "Monitor Profesional LG UltraGear 24 Pulgadas 144Hz",
    marca: "LG",
    categoria: "Monitores",
    precio: 690000,
    disponible: "disponible",
    imagen: "assets/images/productos/monitor-lg.svg",
    descripcion: "Tasa de refresco ultra fluida de 144 Hz, 1 ms de tiempo de respuesta y panel IPS para colores exactos.",
    destacado: true,
    especificaciones: {
      "Tamaño": "24 pulgadas (1920 x 1080 FHD)",
      "Panel": "IPS antirreflejo",
      "Frecuencia": "144 Hz nativos",
      "Tiempo de respuesta": "1 ms MBR",
      "Puertos": "1x HDMI, 1x DisplayPort, salida de audio"
    }
  },
  {
    id: 11,
    nombre: "Router Gigabit Wi-Fi 6 TP-Link Archer AX12",
    marca: "TP-Link",
    categoria: "Equipos de redes",
    precio: 185000,
    disponible: "disponible",
    imagen: "assets/images/productos/router-tplink.svg",
    descripcion: "Tecnología Wi-Fi 6 de nueva generación con mayor velocidad, capacidad para más dispositivos y cobertura ampliada.",
    destacado: false,
    especificaciones: {
      "Estándar": "Wi-Fi 6 (802.11ax/ac/n/a/b/g)",
      "Velocidad dual": "Hasta 1201 Mbps en 5 GHz + 300 Mbps en 2.4 GHz",
      "Antenas": "4 antenas externas de alta ganancia",
      "Puertos": "3 puertos LAN Gigabit + 1 WAN Gigabit",
      "Seguridad": "WPA3 de última generación"
    }
  },
  {
    id: 12,
    nombre: "Pasta Térmica de Alto Rendimiento Arctic MX-4 (4g)",
    marca: "Arctic",
    categoria: "Accesorios tecnológicos",
    precio: 45000,
    disponible: "disponible",
    imagen: "assets/images/productos/pasta-termica.svg",
    descripcion: "Compuesto térmico microparticulado a base de carbono que garantiza una disipación óptima del calor en CPUs y GPUs.",
    destacado: false,
    especificaciones: {
      "Contenido": "4 gramos en jeringa aplicadora",
      "Conductividad": "Alta conductividad térmica sin metales",
      "Conductividad eléctrica": "No conductor (seguro contra cortocircuitos)",
      "Durabilidad": "Hasta 8 años de rendimiento constante"
    }
  },
  {
    id: 13,
    nombre: "Cable HDMI 2.1 Ultra Alta Velocidad 8K 60Hz / 4K 120Hz (2m)",
    marca: "UGreen",
    categoria: "Cables y adaptadores",
    precio: 38000,
    disponible: "disponible",
    imagen: "assets/images/productos/cable-hdmi.svg",
    descripcion: "Ancho de banda de 48 Gbps con soporte HDR dinámico, eARC y conectores reforzados en nylon trenzado.",
    destacado: false,
    especificaciones: {
      "Versión": "HDMI 2.1 (Compatible con 2.0 y 1.4)",
      "Resoluciones": "8K@60Hz, 4K@120Hz, 2K@144Hz",
      "Largo": "2 metros",
      "Blindaje": "Triple capa contra interferencias electromagnéticas"
    }
  },
  {
    id: 14,
    nombre: "Base Refrigerante para Portátil con 6 Ventiladores LED",
    marca: "TechCool",
    categoria: "Accesorios tecnológicos",
    precio: 75000,
    disponible: "disponible",
    imagen: "assets/images/productos/base-refrigerante.svg",
    descripcion: "Soporte ergonómico con inclinación ajustable y flujo de aire silencioso para reducir la temperatura en portátiles.",
    destacado: false,
    especificaciones: {
      "Compatibilidad": "Laptops de 12 a 17 pulgadas",
      "Ventiladores": "6 ventiladores silenciosos con velocidad regulable",
      "Puertos": "2x puertos USB de paso",
      "Ajuste": "5 niveles de altura ergonómica"
    }
  },
  {
    id: 15,
    nombre: "Adaptador Conversor USB-C a HDMI 4K + USB 3.0 + Carga PD",
    marca: "UGreen",
    categoria: "Cables y adaptadores",
    precio: 85000,
    disponible: "disponible",
    imagen: "assets/images/productos/hub-usbc.svg",
    descripcion: "Hub multipuerto portátil en cuerpo de aluminio para laptops que carecen de puertos HDMI estándar.",
    destacado: false,
    especificaciones: {
      "Entrada": "USB-C macho con soporte Thunderbolt 3/4",
      "Salidas": "1x HDMI 4K@30Hz, 1x USB 3.0 5Gbps, 1x USB-C PD 100W",
      "Material": "Aleación de aluminio disipadora",
      "Compatibilidad": "Windows, macOS, Linux, ChromeOS"
    }
  },
  {
    id: 16,
    nombre: "Cinta de Limpieza y Mantenimiento de Impresoras Térmicas",
    marca: "Epson",
    categoria: "Impresoras y accesorios",
    precio: 52000,
    disponible: "agotado",
    imagen: "assets/images/productos/kit-impresora.svg",
    descripcion: "Kit de suministros y limpieza para mantenimiento de cabezales y rodillos en equipos de impresión comercial.",
    destacado: false,
    especificaciones: {
      "Tipo": "Kit de mantenimiento e insumos",
      "Compatibilidad": "Equipos de impresión térmica y matricial",
      "Estado": "Temporalmente agotado (consulta próxima llegada)"
    }
  }
];

// Exponer catálogo en el objeto global
window.PRODUCTOS_DATA = PRODUCTOS_DATA;
