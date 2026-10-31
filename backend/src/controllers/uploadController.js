const fs = require('fs');
const path = require('path');

const ALLOWED_MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
};

/**
 * Procesa la carga de una imagen enviada en base64 desde el dispositivo local del administrador
 */
exports.uploadImage = async (req, res, next) => {
  try {
    const { image, nombre = 'archivo', tipo = 'item' } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'No se envió ninguna imagen válida. Selecciona un archivo desde tu dispositivo.',
      });
    }

    // Detectar si contiene prefijo data URI (data:image/png;base64,...)
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (matches && matches.length === 3) {
      mimeType = matches[1].toLowerCase();
      base64Data = matches[2];
    }

    const extension = ALLOWED_MIME_TYPES[mimeType] || 'jpg';
    const buffer = Buffer.from(base64Data, 'base64');

    // Validación de tamaño máximo (10 MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        ok: false,
        error: 'La imagen excede el límite máximo permitido (10 MB).',
      });
    }

    // Carpeta de almacenamiento: assets/images/uploads
    const uploadsDir = path.resolve(__dirname, '../../../assets/images/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Sanitización de nombre de archivo para evitar colisiones e inyecciones de ruta
    const baseName = nombre
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30) || 'imagen';

    const cleanTipo = tipo === 'servicio' ? 'serv' : (tipo === 'seccion-home' ? 'home' : 'prod');
    const uniqueFilename = `${cleanTipo}_${Date.now()}_${baseName}.${extension}`;
    const destinationPath = path.join(uploadsDir, uniqueFilename);

    await fs.promises.writeFile(destinationPath, buffer);

    const relativeUrl = `assets/images/uploads/${uniqueFilename}`;

    return res.status(201).json({
      ok: true,
      mensaje: 'Imagen subida correctamente desde tu dispositivo.',
      url: relativeUrl,
      filename: uniqueFilename,
      tamano: buffer.length,
    });
  } catch (err) {
    next(err);
  }
};

