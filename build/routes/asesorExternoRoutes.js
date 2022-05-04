"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asesorExternoController_1 = require("../controllers/asesorExternoController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../lib/multer");
class AsesorExternoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        //Pestaña configuracion
        this.router.get('/obtener-asesor-externo/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesorExterno], asesorExternoController_1.asesorExternoController.obtenerAsesorExterno);
        this.router.put('/actualizar-asesor-externo/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesorExterno, multer_1.multerConfig], asesorExternoController_1.asesorExternoController.actualizarAsesorExterno);
    }
}
const asesorExternoRoutes = new AsesorExternoRoutes();
exports.default = asesorExternoRoutes.router;
