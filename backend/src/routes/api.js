const express = require('express');
const router = express.Router();

const { requerirAuth } = require('../middleware/auth');

const authController = require('../controllers/authController');
const productosController = require('../controllers/productosController');
const serviciosController = require('../controllers/serviciosController');
const contactoController = require('../controllers/contactoController');
const statsController = require('../controllers/statsController');
const faqsController = require('../controllers/faqsController');
const configController = require('../controllers/configController');
const uploadController = require('../controllers/uploadController');
const seccionesHomeController = require('../controllers/seccionesHomeController');

// 1. RUTAS DE AUTENTICACIÓN
router.post('/auth/login', authController.login);
router.get('/auth/me', requerirAuth, authController.me);
router.post('/auth/logout', requerirAuth, authController.logout);
router.put('/auth/password', requerirAuth, authController.changePassword);

// 2. RUTAS DE PRODUCTOS
router.get('/productos', productosController.getAll);
router.get('/productos/categorias', productosController.getCategorias);
router.get('/productos/:id', productosController.getById);
router.post('/productos', requerirAuth, productosController.create);
router.put('/productos/:id', requerirAuth, productosController.update);
router.delete('/productos/:id', requerirAuth, productosController.remove);

// 3. RUTAS DE SERVICIOS TÉCNICOS
router.get('/servicios', serviciosController.getAll);
router.get('/servicios/:id', serviciosController.getById);
router.post('/servicios', requerirAuth, serviciosController.create);
router.put('/servicios/:id', requerirAuth, serviciosController.update);
router.delete('/servicios/:id', requerirAuth, serviciosController.remove);

// 4. RUTAS DE CONTACTO / COTIZACIONES
router.post('/contacto', contactoController.create); // Público para clientes de la web
router.get('/contacto', requerirAuth, contactoController.getAll); // Admin
router.patch('/contacto/:id', requerirAuth, contactoController.updateStatus); // Admin
router.delete('/contacto/:id', requerirAuth, contactoController.remove); // Admin

// 5. RUTAS DE ESTADÍSTICAS Y MÉTRICAS
router.get('/stats/dashboard', requerirAuth, statsController.getDashboardStats);

// 6. RUTAS DE PREGUNTAS FRECUENTES (FAQ)
router.get('/faqs', faqsController.getAll);
router.post('/faqs', requerirAuth, faqsController.create);
router.put('/faqs/:id', requerirAuth, faqsController.update);
router.delete('/faqs/:id', requerirAuth, faqsController.remove);

// 7. RUTAS DE CONFIGURACIÓN DEL NEGOCIO
router.get('/config', configController.getAll);
router.put('/config', requerirAuth, configController.update);

// 8. RUTA DE SUBIDA DE IMÁGENES DESDE EL DISPOSITIVO (LOCAL FILE UPLOAD)
router.post('/upload', requerirAuth, uploadController.uploadImage);

// 9. RUTAS DE EDICIÓN Y GESTIÓN DE LA PÁGINA PRINCIPAL (HOME SECTIONS & BANNERS)
router.get('/secciones-home', seccionesHomeController.getAll);
router.get('/secciones-home/:id', seccionesHomeController.getById);
router.post('/secciones-home', requerirAuth, seccionesHomeController.create);
router.put('/secciones-home/:id', requerirAuth, seccionesHomeController.update);
router.delete('/secciones-home/:id', requerirAuth, seccionesHomeController.remove);

module.exports = router;
