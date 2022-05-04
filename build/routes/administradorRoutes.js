"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const administradorController_1 = require("../controllers/administradorController");
const auth_1 = require("../middleware/auth");
class AdministradorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        //Pestaña proyectos
        this.router.put('/actualizar-lugar-fecha', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.actualizarLugarFecha);
        //Pestaña preregistro
        this.router.post('/preregistrar-usuario', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.preregistrarUsuario);
        //Pestaña Usuarios
        this.router.get('/mostrar-titulares', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.mostrarTitulares);
        this.router.get('/mostrar-deysa', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.mostrarDeysa);
        this.router.get('/mostrar-docentes', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.mostrarDocentes);
        this.router.get('/mostrar-asesores-externos', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.mostrarAsesoresExternos);
        this.router.delete('/eliminar-titulares', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.eliminarTitulares);
        this.router.delete('/eliminar-deysas', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.eliminarDeysas);
        this.router.delete('/eliminar-docentes', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.eliminarDocentes);
        this.router.delete('/eliminar-asesores-externos', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.eliminarAsesoresExternos);
        this.router.delete('/eliminar-titular/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.eliminarTitular);
        this.router.delete('/eliminar-deysa/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.eliminarDeysa);
        this.router.delete('/eliminar-docente/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.eliminarDocente);
        this.router.delete('/eliminar-asesor-externo/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.eliminarAsesorExterno);
        this.router.delete('/rechazar-asesor-externo/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.rechazarAsesorExterno);
        this.router.post('/aceptar-asesor-externo/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.aceptarAsesorExterno);
        //Pestaña Fechas
        this.router.get('/existe-calendario', [auth_1.auth.verificarToken], administradorController_1.administradorController.existeCalendario);
        this.router.post('/crear-calendario', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.crearCalendario);
        this.router.put('/registrar-limites-entrega', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.registrarLimitesEntrega);
        this.router.put('/registrar-limites-revision', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.registrarLimitesRevision);
        this.router.get('/mostrar-limites-entrega', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.mostrarLimitesEntrega);
        this.router.get('/mostrar-limites-revision', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.mostrarLimitesRevision);
        //Pestaña configuracion
        this.router.get('/obtener-administrador/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.obtenerAdministrador);
        this.router.put('/actualizar-administrador/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.actualizarAdministrador);
    }
}
const administradorRoutes = new AdministradorRoutes();
exports.default = administradorRoutes.router;
