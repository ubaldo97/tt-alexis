"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
class Auth {
    verificarToken(req, res, next) {
        var token = req.query.token;
        jwt.verify(token, SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token incorrecto',
                    errors: err
                });
            }
            //Para tener la informacion del usuario en el request
            req.usuario = decoded.usuario;
            next();
        });
    }
    verificarAdministrador(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Administrador") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 1',
                errors: { mensaje: "Error 1" }
            });
        }
    }
    verificarTitular(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Titular") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 2',
                errors: { mensaje: "Error 2" }
            });
        }
    }
    verificarDeysa(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Deysa") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 3',
                errors: { mensaje: "Error 3" }
            });
        }
    }
    verificarDocente(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Docente") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 4',
                errors: { mensaje: "Error 4" }
            });
        }
    }
    verificarAlumno(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Alumno") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 5',
                errors: { mensaje: "Error 5" }
            });
        }
    }
    verificarAsesorExterno(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Asesor externo") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 7',
                errors: { mensaje: "Error 7" }
            });
        }
    }
    verificarDirector(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Docente" || usuario.tipo === "Asesor externo") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 1',
                errors: { mensaje: "Error 1" }
            });
        }
    }
    verificarAsesor(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Docente" || usuario.tipo === "Asesor externo") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 1',
                errors: { mensaje: "Error 1" }
            });
        }
    }
    verificarRevisor(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Docente") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 1',
                errors: { mensaje: "Error 1" }
            });
        }
    }
}
exports.auth = new Auth();
