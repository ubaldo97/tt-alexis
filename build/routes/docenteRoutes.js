"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const docenteController_1 = require("../controllers/docenteController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../lib/multer");
class DocenteRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/mostrar-proyectos-revisor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarDocente], docenteController_1.docenteController.mostrarProyectosRevisor);
        this.router.get('/obtener-docente/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarDocente], docenteController_1.docenteController.obtenerDocente);
        this.router.put('/actualizar-docente/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarDocente, multer_1.multerConfig], docenteController_1.docenteController.actualizarDocente);
    }
}
const docenteRoutes = new DocenteRoutes();
exports.default = docenteRoutes.router;
