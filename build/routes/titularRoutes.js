"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const titularController_1 = require("../controllers/titularController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../lib/multer");
class TitularRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        //Pestaña proyectos
        this.router.delete('/eliminar-proyectos', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.eliminarProyectos);
        this.router.delete('/eliminar-proyecto/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.eliminarProyecto);
        //Pestaña preregistrar-alumno
        this.router.post('/preregistrar-alumno', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.preregistrarAlumno);
        //Pestaña alumnos
        this.router.delete('/eliminar-alumnos', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.eliminarAlumnos);
        this.router.delete('/eliminar-alumno/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.eliminarAlumno);
        //Pestaña configuracion
        this.router.get('/obtener-titular/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.obtenerTitular);
        this.router.put('/actualizar-titular/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular, multer_1.multerConfig], titularController_1.titularController.actualizarTitular);
        //Pestaña asignar revisor
        this.router.post('/asignar-revisor', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.asignarRevisor);
        this.router.delete('/eliminar-revisor/:idProyecto/:idUsuario', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.eliminarRevisor);
        //Pestaña asignar jurado
        this.router.get('/obtener-docentes-proyecto/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.obtenerDocentesProyecto);
        this.router.post('/asignar-jurado', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.asignarJurado);
        this.router.delete('/eliminar-jurado/:idProyecto/:idUsuario', [auth_1.auth.verificarToken, auth_1.auth.verificarTitular], titularController_1.titularController.eliminarJurado);
    }
}
const titularRoutes = new TitularRoutes();
exports.default = titularRoutes.router;
