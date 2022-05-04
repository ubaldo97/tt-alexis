"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const directorController_1 = require("../controllers/directorController");
const multer_1 = require("../lib/multer");
const auth_1 = require("../middleware/auth");
class DirectorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        //Solicitud
        this.router.get('/validar-director/:idProyecto/:idDirector', [auth_1.auth.verificarToken, auth_1.auth.verificarDirector], directorController_1.directorController.validarDirector);
        this.router.put('/aceptar-solicitud-director/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarDirector, multer_1.multerConfig], directorController_1.directorController.aceptarSolicitudDirector);
        this.router.put('/rechazar-solicitud-director/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarDirector, multer_1.multerConfig], directorController_1.directorController.rechazarSolicitudDirector);
    }
}
const directorRoutes = new DirectorRoutes();
exports.default = directorRoutes.router;
