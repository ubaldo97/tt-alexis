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
exports.revisorController = void 0;
const database_1 = __importDefault(require("../database"));
const fileSystem_1 = require("../lib/fileSystem");
const nodemailer_1 = require("../lib/nodemailer");
class Revisorontroller {
    validarrevisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.idProyecto;
                const idRevisor = req.params.idRevisor;
                const revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idRevisor]);
                if (revisores.length > 0) {
                    errores.push(true);
                }
                else {
                    errores.push(false);
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo validar revisor");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    rechazarProtocolorevisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const idRevisor = req.body.id_revisor;
                let urlObservaciones = req.file.filename;
                let proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=? `, idProyecto);
                let numEntregas = proyecto[0].num_entregas_protocolo;
                let revisor = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idRevisor]);
                if (revisor.length > 0) {
                    if (numEntregas === 1) {
                        if (revisor[0].url_observaciones_e1 != null) {
                            fileSystem_1.fSystem.eliminarArchivo(revisor[0].url_observaciones_e1);
                        }
                        yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e1=?, estado_e1=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 2, idProyecto, idRevisor]);
                    }
                    else if (numEntregas === 2) {
                        if (revisor[0].url_observaciones_e2 != null) {
                            fileSystem_1.fSystem.eliminarArchivo(revisor[0].url_observaciones_e2);
                        }
                        yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e2=?, estado_e2=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 2, idProyecto, idRevisor]);
                    }
                    else if (numEntregas === 3) {
                        if (revisor[0].url_observaciones_e3 != null) {
                            fileSystem_1.fSystem.eliminarArchivo(revisor[0].url_observaciones_e3);
                        }
                        yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e3=?, estado_e3=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 2, idProyecto, idRevisor]);
                    }
                    //VERIFICAMOS CUANTOS ACEPTADOS Y REVISADOS HAY
                    let revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                    let aceptados = 0;
                    let revisados = 0;
                    for (let i = 0; i < revisores.length; i++) {
                        if (numEntregas == 1) {
                            if (revisores[i].estado_e1 === 1) {
                                aceptados++;
                                revisados++;
                            }
                            else if (revisores[i].estado_e1 === 2) {
                                revisados++;
                            }
                        }
                        else if (numEntregas == 2) {
                            if (revisores[i].estado_e2 === 1) {
                                aceptados++;
                                revisados++;
                            }
                            else if (revisores[i].estado_e2 === 2) {
                                revisados++;
                            }
                        }
                        else if (numEntregas == 3) {
                            if (revisores[i].estado_e3 === 1) {
                                aceptados++;
                                revisados++;
                            }
                            else if (revisores[i].estado_e3 === 2) {
                                revisados++;
                            }
                        }
                    }
                    if (aceptados === revisores.length) {
                        yield database_1.default.query('UPDATE proyecto SET estado_protocolo_revisores=?,estado_proceso=? WHERE id_proyecto=?', [1, 3, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de revisores a protocolo', `<p>Los revisores han <strong>ACEPTADO</strong> el protocolo.</p>`);
                        }
                    }
                    else if (revisados == revisores.length) {
                        //Estan todos revisados pero al menos uno no fue aceptado
                        yield database_1.default.query('UPDATE proyecto SET estado_protocolo_asesores=?,estado_protocolo_revisores=? WHERE id_proyecto=?', [0, 2, idProyecto]);
                        //Eliminamos las observaciones de los asesores y sus estados a 0
                        const asesores = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                        for (let m = 0; m < asesores.length; m++) {
                            if (asesores[m].url_observaciones != null) {
                                fileSystem_1.fSystem.eliminarArchivo(asesores[m].url_observaciones);
                            }
                            yield database_1.default.query('UPDATE protocolo_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 0, idProyecto, asesores[m].fk_id_usuario]);
                        }
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de revisores a protocolo', `<p>Los revisores han <strong>RECHAZADO</strong> el protocolo.</p>`);
                        }
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
                console.log("Error metodo rechazar protocolo revisor");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    aceptarProtocolorevisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const idRevisor = req.body.id_revisor;
                let urlObservaciones = req.file.filename;
                let proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=? `, idProyecto);
                let numEntregas = proyecto[0].num_entregas_protocolo;
                let revisor = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idRevisor]);
                if (revisor.length > 0) {
                    if (numEntregas === 1) {
                        if (revisor[0].url_observaciones_e1 != null) {
                            fileSystem_1.fSystem.eliminarArchivo(revisor[0].url_observaciones_e1);
                        }
                        yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e1=?, estado_e1=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 1, idProyecto, idRevisor]);
                    }
                    else if (numEntregas === 2) {
                        if (revisor[0].url_observaciones_e2 != null) {
                            fileSystem_1.fSystem.eliminarArchivo(revisor[0].url_observaciones_e2);
                        }
                        yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e2=?, estado_e2=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 1, idProyecto, idRevisor]);
                    }
                    else if (numEntregas === 3) {
                        if (revisor[0].url_observaciones_e3 != null) {
                            fileSystem_1.fSystem.eliminarArchivo(revisor[0].url_observaciones_e3);
                        }
                        yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e3=?, estado_e3=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 1, idProyecto, idRevisor]);
                    }
                    //VERIFICAMOS CUANTOS ACEPTADOS Y REVISADOS HAY
                    let revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                    let aceptados = 0;
                    let revisados = 0;
                    for (let i = 0; i < revisores.length; i++) {
                        if (numEntregas == 1) {
                            if (revisores[i].estado_e1 === 1) {
                                aceptados++;
                                revisados++;
                            }
                            else if (revisores[i].estado_e1 === 2) {
                                revisados++;
                            }
                        }
                        else if (numEntregas == 2) {
                            if (revisores[i].estado_e2 === 1) {
                                aceptados++;
                                revisados++;
                            }
                            else if (revisores[i].estado_e2 === 2) {
                                revisados++;
                            }
                        }
                        else if (numEntregas == 3) {
                            if (revisores[i].estado_e3 === 1) {
                                aceptados++;
                                revisados++;
                            }
                            else if (revisores[i].estado_e3 === 2) {
                                revisados++;
                            }
                        }
                    }
                    if (aceptados === revisores.length) {
                        yield database_1.default.query('UPDATE proyecto SET estado_protocolo_revisores=?,estado_proceso=? WHERE id_proyecto=?', [1, 3, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de revisores a protocolo', `<p>Los revisores han <strong>ACEPTADO</strong> el protocolo.</p>`);
                        }
                    }
                    else if (revisados == revisores.length) {
                        //Estan todos revisados pero al menos uno no fue aceptado
                        yield database_1.default.query('UPDATE proyecto SET estado_protocolo_asesores=?,estado_protocolo_revisores=? WHERE id_proyecto=?', [0, 2, idProyecto]);
                        //Eliminamos las observaciones de los asesores y sus estados a 0
                        const asesores = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                        for (let m = 0; m < asesores.length; m++) {
                            if (asesores[m].url_observaciones != null) {
                                fileSystem_1.fSystem.eliminarArchivo(asesores[m].url_observaciones);
                            }
                            yield database_1.default.query('UPDATE protocolo_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 0, idProyecto, asesores[m].fk_id_usuario]);
                        }
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de revisores a protocolo', `<p>Los revisores han <strong>RECHAZADO</strong> el protocolo.</p>`);
                        }
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
                console.log("Error metodo aceptar protocolo revisor");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.revisorController = new Revisorontroller();
