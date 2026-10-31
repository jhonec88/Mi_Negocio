/**
 * Middleware central de manejo de errores HTTP / API
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error No Controlado]:', err);

  const statusCode = err.statusCode || 500;
  const response = {
    ok: false,
    mensaje: err.message || 'Ocurrió un error interno en el servidor.',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
