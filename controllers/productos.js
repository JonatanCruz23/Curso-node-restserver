const { request, response } = require("express");
const { Producto } = require("../models");



// Obtener todos los productos
const obtenerProductos = async (req, res = response) => {
    //ESTE BLOQUE DE CODIGO ANTES DE .res HACE UNA PAGINACION
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))

    ])
    res.json({
        total,
        productos
    })
}

// Obtener producto por ID
const obtenerProducto = async (req = request, res = response) => {
   
    const {id} = req.params;
    const producto = await Producto.findById(id)
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');

    res.json(producto)
    
}


const crearProducto = async (req = request, res = response) => {

    const {estado, usuario, ...body} = req.body
   
    const nombre = body.nombre.toUpperCase();
    const productoDB = await Producto.findOne({ nombre})

    //VALIDAR QUE NO SE DUPILQUE UN PRODUCTO
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    };

    //GENERAR LA DATA A GUARDAR
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
       // edad: req.usuario.password- esto era una prueba

    }
   
    const producto = new Producto(data);
    
    //GUARDAR EN DB
     await producto.save()

    res.status(201).json(producto);
}

//ACTUALIZAR PRODUCTO
const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();   
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);
}

//BORAR PRODUCTO
const borrarProducto = async (req = request, res = response) => {

    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(productoBorrado)
}

module.exports= {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto

}