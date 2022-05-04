"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
const multer_1 = require("../lib/multer");
class UsuarioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        //Pestaña iniciar sesion
        this.router.post('/iniciar-sesion', usuarioController_1.usuarioController.iniciarSesion);
        this.router.post('/recuperar-password', usuarioController_1.usuarioController.recuperarPassword);
        //Pestaña registro
        this.router.get('/existe-administrador', usuarioController_1.usuarioController.existeAdministrador);
        this.router.put('/registrar-usuario', multer_1.multerConfig, usuarioController_1.usuarioController.registrarUsuario);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
