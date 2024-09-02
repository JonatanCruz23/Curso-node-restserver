const { response, request } = require("express")


const esAdminRol = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar en token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        });
    }

    next()
}

const tieneRole = (...roles) => {

   return (req, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar en token primero'
        });
    }

    if (!roles.includes(req.usuario.rol)) {
        return res.status(401).json({
            meg: `El servicio require uno de estos roles: ${roles}`
        })
    }

    next();
   }



}

module.exports = {
    esAdminRol,
    tieneRole
}