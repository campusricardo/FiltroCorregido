const {conexionDB} = require('../database/config.js');
const express = require('express');


class Server {
    // Creamos el constructor
    constructor(){
    this.app = express();
    this.api = "/api";

    this.conectarDB();
    this.routes();
    this.middlewares();
    }

    async conectarDB() {
        conexionDB();
    }

    middlewares() {

        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.api, require('../routes/medicamentos.routes.js'));
        this.app.use(this.api, require('../routes/compras.routes.js'));
        this.app.use(this.api, require('../routes/ventas.routes.js'));
    }

    listen() {
        this.app.listen(4000, ()=> {
            console.log(`Servidor corriendo en puerto 4000`);
        });
    }

}
    
module.exports = {
    Server
}