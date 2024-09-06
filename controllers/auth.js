const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado false'
            });
        }

        // Verificar la contraseña
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT (aquí iría tu lógica para el token)
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async(req, res = response) => {

    const {id_token} = req.body;

    try {

        const {correo, nombre, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo })

        if ( !usuario ) {
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                rol: "USER_ROLE",
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en BD esta con estado en false
        if (!usuario.estado) {
            return res.status(404).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //GENERAR JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'El token de Google n oes valido'
        })
    }

}

module.exports = {
    login,
    googleSignIn,
}
