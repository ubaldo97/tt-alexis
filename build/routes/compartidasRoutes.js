"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compartidasController_1 = require("../controllers/compartidasController");
const auth_1 = require("../middleware/auth");
class CompartidasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/existe-usuario/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.existeUsuario);
        this.router.get('/existe-proyecto/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.existeProyecto);
        //Pestaña proyectos
        this.router.get('/obtener-estado-proceso-asesor/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAsesor], compartidasController_1.compartidasController.obtenerEstadoProcesoAsesor);
        this.router.get('/mostrar-proyectos-director/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.mostrarProyectosDirector);
        this.router.get('/mostrar-proyectos-asesor/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.mostrarProyectosAsesor);
        this.router.get('/mostrar-proyectos-jurado/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.mostrarProyectosJurado);
        this.router.get('/mostrar-proyectos', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.mostrarProyectos);
        this.router.get('/mostrar-alumnos', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.mostrarAlumnos);
        this.router.get('/obtener-info-proyecto/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerInfoProyecto);
        this.router.get('/obtener-alumnos-proyecto/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerAlumnosProyecto);
        this.router.get('/obtener-asesores-proyecto/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerAsesoresProyecto);
        this.router.get('/obtener-revisores-proyecto/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerRevisoresProyecto);
        this.router.get('/obtener-jurado-proyecto/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerJuradoProyecto);
        this.router.get('/mostrar-docentes-registrados', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.mostrarDocentesRegistrados);
        this.router.get('/mostrar-docentes-registrados-sistemas', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.mostrarDocentesRegistradosSistemas);
        this.router.get('/obtener-fechas', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerFechas);
        this.router.get('/obtener-info-proyecto-solicitud/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerInfoProyectoSolicitud);
        this.router.get('/obtener-info-proyecto-protocolo/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerInfoProyectoProtocolo);
        this.router.get('/obtener-info-proyecto-reporte/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerInfoProyectoReporte);
        this.router.get('/obtener-info-proyecto-presentacion/:id', [auth_1.auth.verificarToken], compartidasController_1.compartidasController.obtenerInfoProyectoPresentacion);
    }
}
const compartidasRoutes = new CompartidasRoutes();
exports.default = compartidasRoutes.router;
