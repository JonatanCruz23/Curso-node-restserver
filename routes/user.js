
const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwb');
const { esAdminRol, tieneRole } = require('../middlewares/validar-roles');

const {esRoleValido, correoExiste, existeUsuarioId} = require('../helpers/db-validators')
const {usuariosGet, usuariosPut, usuariosPost, usuariosDelete} = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.post('/',[
   
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password deve tener 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(correoExiste),
   // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
   check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

router.delete('/:id',[
    validarJWT, 
    //esAdminRol,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
] ,usuariosDelete);


module.exports = router;