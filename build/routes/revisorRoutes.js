"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../lib/multer");
const auth_1 = require("../middleware/auth");
const revisorController_1 = require("../controllers/revisorController");
class RevisorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        //Protocolo
        this.router.get('/validar-revisor/:idProyecto/:idRevisor', [auth_1.auth.verificarToken, auth_1.auth.verificarRevisor], revisorController_1.revisorController.validarrevisor);
        this.router.put('/aceptar-protocolo-revisor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarRevisor, multer_1.multerConfig], revisorController_1.revisorController.aceptarProtocolorevisor);
        this.router.put('/rechazar-protocolo-revisor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarRevisor, multer_1.multerConfig], revisorController_1.revisorController.rechazarProtocolorevisor);
    }
}
const revisorRoutes = new RevisorRoutes();
exports.default = revisorRoutes.router;
