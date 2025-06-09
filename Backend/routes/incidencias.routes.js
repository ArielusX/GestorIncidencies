const express = require('express');
const router = express.Router();
const incidenciasController = require('../controllers/incidencias.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware.verifyToken);

router.get('/', incidenciasController.getAll);
router.post('/', incidenciasController.create);
router.put('/:id', incidenciasController.update);
router.delete('/:id', incidenciasController.remove);

module.exports = router;