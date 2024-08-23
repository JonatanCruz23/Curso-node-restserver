const { response, request } = require('express');

const usuariosGet = (req= request, res = response) => {

    const {q, nombre = 'No name', apikey} = req.query
    res.json({
        msj: 'get Api - Controlador',
        q,
        nombre,
        apikey
    })
};

const usuariosPut = (req = request, res = response) => {
    const id = req.params.id;
    res.json({
        msj: 'put Api- Controller',
        id
    })
};

const usuariosPost = (req, res = response) => {
    const {nombre, edad} = req.body
    res.json({
        msj: 'post Api - controller',
        nombre,
        edad
    })
};

const usuariosDelete = (req, res = response) => {
    res.json({
        msj: 'Delete Api - Controller',
    })
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}