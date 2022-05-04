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
exports.asesorController = void 0;
const database_1 = __importDefault(require("../database"));
const fileSystem_1 = require("../lib/fileSystem");
const nodemailer_1 = require("../lib/nodemailer");
class AsesorController {
    validarAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.idProyecto;
                const idAsesor = req.params.idAsesor;
                const asesores = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idAsesor]);
                if (asesores.length > 0) {
                    errores.push(true);
                }
                else {
                    errores.push(false);
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo validar asesor");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    aceptarProtocoloAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                let proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                let nombreProyecto = proyecto[0].nombre;
                const idAsesor = req.body.id_asesor;
                let urlObservaciones = req.file.filename;
                let asesor = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idAsesor]);
                if (asesor.length > 0) {
                    //Eliminamos las anteriorres observaciones
                    if (asesor[0].url_observaciones != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesor[0].url_observaciones);
                    }
                    yield database_1.default.query('UPDATE protocolo_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 1, idProyecto, idAsesor]);
                    //Verificamos si todos estan rechazados ya
                    let asesores = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                    let aceptados = 0;
                    let revisados = 0;
                    for (let i = 0; i < asesores.length; i++) {
                        if (asesores[i].estado === 1) {
                            aceptados++;
                            revisados++;
                        }
                        else if (asesores[i].estado === 2) {
                            revisados++;
                        }
                    }
                    if (aceptados === asesores.length) {
                        console.log("Todos aceptadps");
                        const numsEntregas = yield database_1.default.query(`SELECT num_entregas_protocolo FROM proyecto WHERE id_proyecto=?`, idProyecto);
                        let numEntrega = numsEntregas[0].num_entregas_protocolo + 1;
                        yield database_1.default.query('UPDATE proyecto SET estado_protocolo_asesores=?,estado_protocolo_revisores=?,num_entregas_protocolo=? WHERE id_proyecto=?', [1, 3, numEntrega, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a protocolo', `<p>Los asesores han <strong>ACEPTADO</strong> el protocolo.</p>`);
                        }
                        //LO ENVIAMOS A LOS REVISORES
                        let revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < revisores.length; i++) {
                            let idRevisor = revisores[i].fk_id_usuario;
                            let revisor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idRevisor);
                            let correo = revisor[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Nuevo protocolo', `<p>El proyecto ${nombreProyecto} ha enviado un nuevo protocolo</p>`);
                        }
                        for (let j = 0; j < revisores.length; j++) {
                            if (numEntrega == 1) {
                                if (revisores[j].url_observaciones_e1 != null) {
                                    fileSystem_1.fSystem.eliminarArchivo(revisores[j].url_observaciones_e1);
                                }
                                yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e1=?, estado_e1=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 3, idProyecto, revisores[j].fk_id_usuario]);
                            }
                            else if (numEntrega == 2) {
                                if (revisores[j].url_observaciones_e2 != null) {
                                    fileSystem_1.fSystem.eliminarArchivo(revisores[j].url_observaciones_e2);
                                }
                                yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e2=?, estado_e2=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 3, idProyecto, revisores[j].fk_id_usuario]);
                            }
                            else if (numEntrega == 3) {
                                if (revisores[j].url_observaciones_e3 != null) {
                                    fileSystem_1.fSystem.eliminarArchivo(revisores[j].url_observaciones_e3);
                                }
                                yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e3=?, estado_e3=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 3, idProyecto, revisores[j].fk_id_usuario]);
                            }
                        }
                    }
                    else if (revisados == asesores.length) {
                        //Estan todos revisados pero al menos uno no fue aceptado
                        console.log("Todos rechazados");
                        yield database_1.default.query('UPDATE proyecto SET estado_protocolo_asesores=? WHERE id_proyecto=?', [2, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a protocolo', `<p>Los asesores han <strong>RECHAZADO</strong> el protocolo.</p>`);
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
                console.log("Error metodo aceptar protocolo asesor");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    rechazarProtocoloAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const idAsesor = req.body.id_asesor;
                let urlObservaciones = req.file.filename;
                let asesor = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idAsesor]);
                if (asesor.length > 0) {
                    //Eliminamos las anteriorres observaciones
                    if (asesor[0].url_observaciones != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesor[0].url_observaciones);
                    }
                    yield database_1.default.query('UPDATE protocolo_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 2, idProyecto, idAsesor]);
                    //Verificamos si todos estan rechazados ya
                    let asesores = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                    let aceptados = 0;
                    let revisados = 0;
                    for (let i = 0; i < asesores.length; i++) {
                        if (asesores[i].estado === 1) {
                            aceptados++;
                            revisados++;
                        }
                        else if (asesores[i].estado === 2) {
                            revisados++;
                        }
                    }
                    if (aceptados === asesores.length) {
                        console.log("Todos aceptadps");
                        const numsEntregas = yield database_1.default.query(`SELECT num_entregas_protocolo FROM proyecto WHERE id_proyecto=?`, idProyecto);
                        let numEntrega = numsEntregas[0].num_entregas_protocolo + 1;
                        yield database_1.default.query('UPDATE proyecto SET estado_protocolo_asesores=?,estado_protocolo_revisores=?,num_entregas_protocolo=? WHERE id_proyecto=?', [1, 3, numEntrega, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a protocolo', `<p>Los asesores han <strong>ACEPTADO</strong> el protocolo.</p>`);
                        }
                        //LO ENVIAMOS A LOS REVISORES
                        let revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                        for (let j = 0; j < revisores.length; j++) {
                            if (numEntrega == 1) {
                                if (revisores[j].url_observaciones_e1 != null) {
                                    fileSystem_1.fSystem.eliminarArchivo(revisores[j].url_observaciones_e1);
                                }
                                yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e1=?, estado_e1=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 3, idProyecto, revisores[j].fk_id_usuario]);
                            }
                            else if (numEntrega == 2) {
                                if (revisores[j].url_observaciones_e2 != null) {
                                    fileSystem_1.fSystem.eliminarArchivo(revisores[j].url_observaciones_e2);
                                }
                                yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e2=?, estado_e2=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 3, idProyecto, revisores[j].fk_id_usuario]);
                            }
                            else if (numEntrega == 3) {
                                if (revisores[j].url_observaciones_e3 != null) {
                                    fileSystem_1.fSystem.eliminarArchivo(revisores[j].url_observaciones_e3);
                                }
                                yield database_1.default.query('UPDATE protocolo_revisor SET url_observaciones_e3=?, estado_e3=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 3, idProyecto, revisores[j].fk_id_usuario]);
                            }
                        }
                    }
                    else if (revisados == asesores.length) {
                        //Estan todos revisados pero al menos uno no fue aceptado
                        console.log("Hay rechazados");
                        yield database_1.default.query('UPDATE proyecto SET estado_protocolo_asesores=? WHERE id_proyecto=?', [2, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a protocolo', `<p>Los asesores han <strong>RECHAZADO</strong> el protocolo.</p>`);
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
                console.log("Error metodo rechazar protocolo asesor");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    aceptarReporteAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                let proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                let nombreProyecto = proyecto[0].nombre;
                const idAsesor = req.body.id_asesor;
                let urlObservaciones = req.file.filename;
                let asesor = yield database_1.default.query(`SELECT * FROM reporte_asesor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idAsesor]);
                if (asesor.length > 0) {
                    //Eliminamos las anteriorres observaciones
                    if (asesor[0].url_observaciones != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesor[0].url_observaciones);
                    }
                    yield database_1.default.query('UPDATE reporte_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 1, idProyecto, idAsesor]);
                    //Verificamos si todos estan rechazados ya
                    let asesores = yield database_1.default.query(`SELECT * FROM reporte_asesor WHERE fk_id_proyecto=?`, idProyecto);
                    let aceptados = 0;
                    let revisados = 0;
                    for (let i = 0; i < asesores.length; i++) {
                        if (asesores[i].estado === 1) {
                            aceptados++;
                            revisados++;
                        }
                        else if (asesores[i].estado === 2) {
                            revisados++;
                        }
                    }
                    if (aceptados === asesores.length) {
                        console.log("Todos aceptadps");
                        yield database_1.default.query('UPDATE proyecto SET estado_reporte_asesores=?, estado_proceso=? WHERE id_proyecto=?', [1, 4, idProyecto]);
                        //Informamos al jurado
                        let jurado = yield database_1.default.query(`SELECT * FROM proyecto_jurado WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < jurado.length; i++) {
                            let idMiembro = jurado[i].fk_id_usuario;
                            let miembro = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idMiembro);
                            let correo = miembro[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Nuevo reporte final', `<p>El proyecto ${nombreProyecto} ha enviado un nuevo Reporte final.</p>`);
                        }
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a reporte', `<p>Los asesores han <strong>ACEPTADO</strong> el Reporte final.</p>`);
                        }
                    }
                    else if (revisados == asesores.length) {
                        //Estan todos revisados pero al menos uno no fue aceptado
                        console.log("Hay rechazados");
                        yield database_1.default.query('UPDATE proyecto SET estado_reporte_asesores=? WHERE id_proyecto=?', [2, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a reporte final', `<p>Los asesores han <strong>RECHAZADO</strong> el Reporte final.</p>`);
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
                console.log("Error metodo aceptar reporte asesor");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    rechazarReporteAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const idAsesor = req.body.id_asesor;
                let urlObservaciones = req.file.filename;
                let asesor = yield database_1.default.query(`SELECT * FROM reporte_asesor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idAsesor]);
                if (asesor.length > 0) {
                    //Eliminamos las anteriorres observaciones
                    if (asesor[0].url_observaciones != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesor[0].url_observaciones);
                    }
                    yield database_1.default.query('UPDATE reporte_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 2, idProyecto, idAsesor]);
                    //Verificamos si todos estan rechazados ya
                    let asesores = yield database_1.default.query(`SELECT * FROM reporte_asesor WHERE fk_id_proyecto=?`, idProyecto);
                    let aceptados = 0;
                    let revisados = 0;
                    for (let i = 0; i < asesores.length; i++) {
                        if (asesores[i].estado === 1) {
                            aceptados++;
                            revisados++;
                        }
                        else if (asesores[i].estado === 2) {
                            revisados++;
                        }
                    }
                    if (aceptados === asesores.length) {
                        console.log("Todos aceptadps");
                        yield database_1.default.query('UPDATE proyecto SET estado_reporte_asesores=?, estado_proceso=? WHERE id_proyecto=?', [1, 4, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a reporte', `<p>Los asesores han <strong>ACEPTADO</strong> el Reporte final.</p>`);
                        }
                    }
                    else if (revisados == asesores.length) {
                        //Estan todos revisados pero al menos uno no fue aceptado
                        console.log("Hay rechazados");
                        yield database_1.default.query('UPDATE proyecto SET estado_reporte_asesores=? WHERE id_proyecto=?', [2, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a reporte final', `<p>Los asesores han <strong>RECHAZADO</strong> el Reporte final.</p>`);
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
                console.log("Error metodo rechazar reporte asesor");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    aceptarPresentacionAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const idAsesor = req.body.id_asesor;
                let urlObservaciones = req.file.filename;
                let asesor = yield database_1.default.query(`SELECT * FROM presentacion_asesor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idAsesor]);
                if (asesor.length > 0) {
                    //Eliminamos las anteriorres observaciones
                    if (asesor[0].url_observaciones != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesor[0].url_observaciones);
                    }
                    yield database_1.default.query('UPDATE presentacion_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 1, idProyecto, idAsesor]);
                    //Verificamos si todos estan rechazados ya
                    let asesores = yield database_1.default.query(`SELECT * FROM presentacion_asesor WHERE fk_id_proyecto=?`, idProyecto);
                    let aceptados = 0;
                    let revisados = 0;
                    for (let i = 0; i < asesores.length; i++) {
                        if (asesores[i].estado === 1) {
                            aceptados++;
                            revisados++;
                        }
                        else if (asesores[i].estado === 2) {
                            revisados++;
                        }
                    }
                    if (aceptados === asesores.length) {
                        console.log("Todos aceptadps");
                        yield database_1.default.query('UPDATE proyecto SET estado_presentacion_asesores=?, estado_proceso=? WHERE id_proyecto=?', [1, 5, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a presentación', `<p>Los asesores han <strong>ACEPTADO</strong> la presentación.</p>`);
                        }
                    }
                    else if (revisados == asesores.length) {
                        //Estan todos revisados pero al menos uno no fue aceptado
                        console.log("Hay rechazados");
                        yield database_1.default.query('UPDATE proyecto SET estado_presentacion_asesores=? WHERE id_proyecto=?', [2, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a presentación', `<p>Los asesores han <strong>RECHAZADO</strong> la presentación.</p>`);
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
                console.log("Error metodo aceptar presentacion asesor");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    rechazarPresentacionAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const idAsesor = req.body.id_asesor;
                let urlObservaciones = req.file.filename;
                let asesor = yield database_1.default.query(`SELECT * FROM presentacion_asesor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idAsesor]);
                if (asesor.length > 0) {
                    //Eliminamos las anteriorres observaciones
                    if (asesor[0].url_observaciones != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesor[0].url_observaciones);
                    }
                    yield database_1.default.query('UPDATE presentacion_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [urlObservaciones, 2, idProyecto, idAsesor]);
                    //Verificamos si todos estan rechazados ya
                    let asesores = yield database_1.default.query(`SELECT * FROM presentacion_asesor WHERE fk_id_proyecto=?`, idProyecto);
                    let aceptados = 0;
                    let revisados = 0;
                    for (let i = 0; i < asesores.length; i++) {
                        if (asesores[i].estado === 1) {
                            aceptados++;
                            revisados++;
                        }
                        else if (asesores[i].estado === 2) {
                            revisados++;
                        }
                    }
                    if (aceptados === asesores.length) {
                        console.log("Todos aceptadps");
                        yield database_1.default.query('UPDATE proyecto SET estado_presentacion_asesores=?, estado_proceso=? WHERE id_proyecto=?', [1, 5, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a presentación', `<p>Los asesores han <strong>ACEPTADO</strong> la presentación.</p>`);
                        }
                    }
                    else if (revisados == asesores.length) {
                        //Estan todos revisados pero al menos uno no fue aceptado
                        console.log("Hay rechazados");
                        yield database_1.default.query('UPDATE proyecto SET estado_presentacion_asesores=? WHERE id_proyecto=?', [2, idProyecto]);
                        //Informamos a los alumnos
                        let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de asesores a presentación', `<p>Los asesores han <strong>RECHAZADO</strong> la presentación.</p>`);
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
                console.log("Error metodo rechazar presentacion asesor");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.asesorController = new AsesorController();
