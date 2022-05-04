"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alumnoController_1 = require("../controllers/alumnoController");
const multer_1 = require("../lib/multer");
const auth_1 = require("../middleware/auth");
class AlumnoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        //Inciio
        this.router.get('/obtener-estado-proceso/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.obtenerEstadoProceso);
        //Documentos
        this.router.get('/obtener-documentos/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.obtenerDocumentos);
        //Solicitud
        this.router.put('/enviar-solicitud-deysa/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno, multer_1.multerConfig], alumnoController_1.alumnoController.enviarSolicitudDeysa);
        //Protocolo
        this.router.put('/entrega-vacia', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.entregaVacia);
        this.router.put('/revision-vacia', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.revisionVacia);
        this.router.put('/enviar-protocolo/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno, multer_1.multerConfig], alumnoController_1.alumnoController.enviarProtocolo);
        //Reporte
        this.router.put('/enviar-reporte/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno, multer_1.multerConfig], alumnoController_1.alumnoController.enviarReporte);
        //Presentacion
        this.router.put('/enviar-presentacion/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno, multer_1.multerConfig], alumnoController_1.alumnoController.enviarPresentacion);
        this.router.post('/registrar-proyecto', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.registrarProyecto);
        this.router.post('/registrar-asesor', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno, multer_1.multerConfig], alumnoController_1.alumnoController.registrarAsesor);
        this.router.get('/mostrar-alumnos-registrados', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.mostrarAlumnosRegistrados);
        //Pestaña proyecto
        this.router.get('/obtener-asesores-proyecto-alumno/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.obtenerAsesoresProyectoAlumno);
        this.router.put('/actualizar-proyecto/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.actualizarProyecto);
        //Pestaña proyectos
        this.router.delete('/eliminar-asesor-proyecto/:idProyecto/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.eliminarAsesorProyecto);
        //Pestaña configuracion
        this.router.get('/obtener-alumno/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.obtenerAlumno);
        this.router.put('/actualizar-alumno/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAlumno], alumnoController_1.alumnoController.actualizarAlumno);
    }
}
const alumnoRoutes = new AlumnoRoutes();
exports.default = alumnoRoutes.router;
