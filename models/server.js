const express = require('express')
const cors = require('cors')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/usuarios';

        //Middelwares
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();
    }

    middlewares() {
        //CORS
        this.app.use(cors());
        //LECTURA Y OARSEO DEL BODY
        this.app.use( express.json() );
        //Directorio publico
        this.app.use(express.static('public'))
    }

    routes() {

        this.app.use(this.userPath, require('../routes/user'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`escuchando en http://localhost:${this.port}`)
        })
    }

}

module.exports = Server;