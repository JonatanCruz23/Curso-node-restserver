const express = require('express')
const cors = require('cors')
const {dbConection} = require('../database/config')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //CONETAR A DB
        this.conectarDB();

        //Middelwares
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());
        //LECTURA Y PARSEO DEL BODY
        this.app.use( express.json() );
        //Directorio publico
        this.app.use(express.static('public'))
    }

    routes() {

        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.userPath, require('../routes/user'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`escuchando en http://localhost:${this.port}`)
        })
    }

}

module.exports = Server;