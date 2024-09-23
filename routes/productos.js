const {Router, response} = require('express');
const {check} = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { login, googleSignIn } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwb');
const { existeCategoria, existeProducto } = require('../helpers/db-validators');
const { esAdminRol } = require('../middlewares/validar-roles');
const { obtenerProductos, crearProducto, obtenerProducto, borrarProducto, actualizarProducto } = require('../controllers/productos');


const router = Router();


// OBTENER TODOS LOS PRODUCTOS - endpoint publico
router.get('/', obtenerProductos);

// OBTENER UN PRODUCTO - endpoint publico
router.get('/:id',[
    check('id','No es un Id de Mongo valido').isMongoId(),
    check('id').custom( existeProducto),
    validarCampos,
], obtenerProducto);

// CREAR PRODUCTOS - endpoint PRIVADO
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);

// ACTUALIZAR PRODUCTOS - endpoint PRIVADO
router.put('/:id',[
    validarJWT,
  //  check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
], actualizarProducto);

//ELIMINARPRODUCTO - RUTA PRIVADA
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);

module.exports = router;