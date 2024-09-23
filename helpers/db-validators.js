const { Categoria, Producto } = require('../models');
const Role  = require('../models/role');
const Usuario = require('../models/usuario')

const esRoleValido = async(rol = '')=> {
    const existeRol = await Role.findOne({ rol });
    if(!existeRol) {
        throw new Error(`El rol ${rol} no existe en a DB`)
    }
   };

const correoExiste = async(correo = '') => {
     //VERIFICAR SI EL CORREO EXISTE
     const existeEmail = await Usuario.findOne({correo});
     if (existeEmail) {
        throw new Error(`El correo: ${correo} ya existe en la DB`)
     }
}

const existeUsuarioId = async(id) => {
   //VERIFICAR SI EL ID EXISTE
   const existeUsuario = await Usuario.findById(id);
   if (!existeUsuario) {
      throw new Error(`El ID: ${id} no existe!!`)
   }
}

const existeCategoria = async(id) => {
   //VERIFICAR SI EL ID EXISTE
   const existeCategoria = await Categoria.findById(id);
   if (!existeCategoria) {
      throw new Error(`La categoria con ID: ${id} no existe!!`)
   }
}

const existeProducto = async(id) => {
   //VERIFICAR SI EL ID EXISTE
   const existeProducto = await Producto.findById(id);
   if (!existeProducto) {
      throw new Error(`El producto con ID: ${id} no existe!!`)
   }
}

   module.exports = {
    esRoleValido,
    correoExiste,
    existeUsuarioId,
    existeCategoria,
    existeProducto
   }