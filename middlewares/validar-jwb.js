const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Nohay token en la peticion'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETOPRIVATEKEY);
        // LEER USUARIO QUE CORRESPONDE AL UID
        const usuario = await Usuario.findById(uid);

        // VERIFICAR SI USUARIO EXISTE EN LA DB
        if (!usuario) {
            return res.status(401).json({
                meg: 'Token no valido- usuario no existe en la DB'
            })
        }

        //VERIFICARSI EL UID TIENE ESTADO EN TRUE
        if (!usuario.estado) {
            return res.status(401).json({
                meg: 'Token no valido - usuario con estado: false'
            })
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}


module.exports = {
    validarJWT,
}