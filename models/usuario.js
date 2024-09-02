const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
     //   enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'] // Puedes ajustar estos roles según tus necesidades
    },
    estado: {
        type: Boolean,
        default: true // Indica si el usuario está activo o no
    },
    google: {
        type: Boolean,
        default: false // Indica si el usuario se autenticó con Google
    }
});

UsuarioSchema.methods.toJSON = function(){
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);
