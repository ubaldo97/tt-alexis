"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asesorController_1 = require("../controllers/asesorController");
const multer_1 = require("../lib/multer");
const auth_1 = require("../middleware/auth");
class AsesorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        //Procolo
        this.router.get('/validar-asesor/:idProyecto/:idAsesor', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesor], asesorController_1.asesorController.validarAsesor);
        this.router.put('/aceptar-protocolo-asesor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesor, multer_1.multerConfig], asesorController_1.asesorController.aceptarProtocoloAsesor);
        this.router.put('/rechazar-protocolo-asesor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesor, multer_1.multerConfig], asesorController_1.asesorController.rechazarProtocoloAsesor);
        //Reporte
        this.router.put('/aceptar-reporte-asesor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesor, multer_1.multerConfig], asesorController_1.asesorController.aceptarReporteAsesor);
        this.router.put('/rechazar-reporte-asesor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesor, multer_1.multerConfig], asesorController_1.asesorController.rechazarReporteAsesor);
        //Presentacion
        this.router.put('/aceptar-presentacion-asesor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesor, multer_1.multerConfig], asesorController_1.asesorController.aceptarPresentacionAsesor);
        this.router.put('/rechazar-presentacion-asesor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesor, multer_1.multerConfig], asesorController_1.asesorController.rechazarPresentacionAsesor);
    }
}
const asesorRoutes = new AsesorRoutes();
exports.default = asesorRoutes.router;
