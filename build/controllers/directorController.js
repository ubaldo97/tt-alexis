"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directorController = void 0;
const database_1 = __importDefault(require("../database"));
const fileSystem_1 = require("../lib/fileSystem");
const Proyecto_1 = require("../models/Proyecto");
const nodemailer_1 = require("../lib/nodemailer");
class DirectorController {
    validarDirector(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.idProyecto;
                const idDirector = req.params.idDirector;
                const directores = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=? AND fk_id_director=?`, [idProyecto, idDirector]);
                if (directores.length > 0) {
                    errores.push(true);
                }
                else {
                    errores.push(false);
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo validar director");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    aceptarSolicitudDirector(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const director = yield database_1.default.query(`SELECT fk_id_director FROM proyecto WHERE id_proyecto=?`, idProyecto);
                if (director[0].fk_id_director != null) {
                    let proyecto = new Proyecto_1.Proyecto();
                    proyecto.url_observaciones_solicitud = req.file.filename;
                    const infoProyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                    let urlRespuestaDeysa = infoProyecto[0].url_respuesta_deysa;
                    //Elimnamos la anteriores respuestas deysa si existe
                    if (urlRespuestaDeysa != null) {
                        fileSystem_1.fSystem.eliminarArchivo(urlRespuestaDeysa);
                    }
                    yield database_1.default.query('UPDATE proyecto SET url_observaciones_solicitud=?,url_respuesta_deysa=?, estado_solicitud_director=?,estado_respuesta_deysa=? WHERE id_proyecto=?', [proyecto.url_observaciones_solicitud, null, 1, 3, idProyecto]);
                    //Informamos a los alumnos
                    let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                    for (let i = 0; i < alumnos.length; i++) {
                        let idAlumno = alumnos[i].fk_id_usuario;
                        let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                        let correo = alumno[0].correo;
                        nodemailer_1.email.enviarCorreo(correo, 'Respuesta director de proyecto', `<p>El director de proyecto ha <strong>ACEPTADO</strong> la solicitud DEySA</p>`);
                    }
                    //Informamos a al DEYSA
                    let idsDeysa = yield database_1.default.query(`SELECT * FROM deysa`);
                    if (idsDeysa.length > 0) {
                        let deysa = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idsDeysa[0].fk_id_usuario);
                        let correo = deysa[0].correo;
                        let nombreProyecto = infoProyecto[0].nombre;
                        nodemailer_1.email.enviarCorreo(correo, 'Nueva solicitud DEySA', `<p>El proyecto ${nombreProyecto} ha enviado una solicitud DEySA</p>`);
                    }
                    errores.push("Ninguno");
                }
                else {
                    fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo aceptar solictud director");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    rechazarSolicitudDirector(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const director = yield database_1.default.query(`SELECT fk_id_director FROM proyecto WHERE id_proyecto=?`, idProyecto);
                if (director[0].fk_id_director != null) {
                    let proyecto = new Proyecto_1.Proyecto();
                    proyecto.url_observaciones_solicitud = req.file.filename;
                    yield database_1.default.query('UPDATE proyecto SET url_observaciones_solicitud=?, estado_solicitud_director=? WHERE id_proyecto=?', [proyecto.url_observaciones_solicitud, 2, idProyecto]);
                    //Informamos a los alumnos
                    let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                    for (let i = 0; i < alumnos.length; i++) {
                        let idAlumno = alumnos[i].fk_id_usuario;
                        let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                        let correo = alumno[0].correo;
                        nodemailer_1.email.enviarCorreo(correo, 'Respuesta director de proyecto', `<p>El director de proyecto ha <strong>RECHAZADO</strong> la solicitud DEySA</p>`);
                    }
                    errores.push("Ninguno");
                }
                else {
                    fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo rechazar solictud director");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.directorController = new DirectorController();
