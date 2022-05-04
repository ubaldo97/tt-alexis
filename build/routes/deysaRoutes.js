"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deysaController_1 = require("../controllers/deysaController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../lib/multer");
class DeysaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        //Pestaña Proyecto
        this.router.put('/aceptar-solicitud-deysa/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarDeysa, multer_1.multerConfig], deysaController_1.deysaController.aceptarSolicitudDeysa);
        this.router.put('/rechazar-solicitud-deysa/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarDeysa, multer_1.multerConfig], deysaController_1.deysaController.rechazarSolicitudDeysa);
        //Pestaña configuracion
        this.router.get('/obtener-deysa/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarDeysa], deysaController_1.deysaController.obtenerDeysa);
        this.router.put('/actualizar-deysa/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarDeysa], deysaController_1.deysaController.actualizarDeysa);
    }
}
const deysaRoutes = new DeysaRoutes();
exports.default = deysaRoutes.router;
