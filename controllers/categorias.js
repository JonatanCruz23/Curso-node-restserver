const { response, request } = require("express");
const { Categoria } = require('../models')

//OBTENER MULTIPLES CATEGRIAS
const obtenerCategorias = async (req, res = response) => {
    //ESTE BLOQUE DE CODIGO ANTES DE .res HACE UNA PAGINACION
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))

    ])
    res.json({
        total,
        categorias
    })
}
//OBTENER UNA CATEGORIA POR ID
const obtenerCategoria = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const { id } = req.params;
    const query = { estado: true }

    const categoria = await Categoria.findById(id,)

    res.json({
        categoria
    })
}

//CONTROLADOR PARA CREAR CATEGORIAS
const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre })

    //VALIDAR QUE NO SE DUPILQUE UNA CATEGORIA
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    };

    //GENERAR LA DATA A GUARDAR
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //GUARDAR EN DB
    await categoria.save()

    res.status(201).json(categoria);
}

//ACTUALIZAR CATEGORIA
const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria);
}

// BORRAR CATEGORIA - ESTADO-FALSE
const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
   
    res.json(categoriaBorrada)
}



module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}