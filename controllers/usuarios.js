const { response, request } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

// =====================METODO GET ===============================
const usuariosGet = async (req = request, res = response) => {
    //ESTE BLOQUE DE CODIGO ANTES DE .res HACE UNA PAGINACION
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}
    // const usuarios = await Usuario.find(query)
    //     .skip(Number( desde))
    //     .limit(Number(limite));
    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number( desde))
        .limit(Number(limite))

    ])
    res.json({
        total,
       usuarios
    })
};

// =====================METODO POST CREA===========================
const usuariosPost = async (req, res = response) => {


    const { nombre, correo, password, rol } = req.body
    const usuario = new Usuario({ nombre, correo, password, rol });

    //ENCRIPTAR PASWORD
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //GUARDAR
    await usuario.save();

    res.json({
        msj: 'post Api - controller',
        usuario
    })
};

// =====================METODO PUT ACTUALIZA ============================
const usuariosPut = async(req = request, res = response) => {
    const {id} = req.params;
    const {_id, password, google, correo, ...resto } = req.body;
    
    //TODO validar contra BD
    if (password) {
        //ENCRIPTAR PASSWORD
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        msj: 'put Api- Controller',
        usuario
    })
};


// =====================METODO DELETE =======================
const usuariosDelete = async(req, res = response) => {
    const {id} = req. params;

    //ELIMINAR FISICAMENTE
  //  const usuario =  await Usuario.findByIdAndDelete(id);
  const usuario =  await Usuario.findByIdAndUpdate(id, {estado: false});
 // const usuarioAutenticado = req.usuario
    res.json({
      usuario,
   //   usuarioAutenticado
    })
}


// =====================EXPORTACION METODOS ===============
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}