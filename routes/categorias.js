const {Router, response} = require('express');
const {check} = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login, googleSignIn } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwb');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { esAdminRol } = require('../middlewares/validar-roles');


const router = Router();

// Obtener todas las categorias - endpoint publico
router.get('/', [

],obtenerCategorias);

// Obtener una categoria - endpoint publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoria),
    validarCampos,
], obtenerCategoria);

// Crear una categoria - endpoint privado - solo personas con token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria);

// Actualizar categorias - endpoint privado
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoria),
    validarCampos,
],actualizarCategoria);

// Actualizar categorias - endpoint privado
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoria),
    validarCampos,
],borrarCategoria);


module.exports = router;