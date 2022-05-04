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
exports.deysaController = void 0;
const database_1 = __importDefault(require("../database"));
const Usuario_1 = require("../models/Usuario");
const bcriptjs_1 = require("../lib/bcriptjs");
const fileSystem_1 = require("../lib/fileSystem");
const Proyecto_1 = require("../models/Proyecto");
const nodemailer_1 = require("../lib/nodemailer");
class DeysaController {
    //PESTAÑA PROYECTO
    aceptarSolicitudDeysa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                let proyecto = new Proyecto_1.Proyecto();
                proyecto.url_respuesta_deysa = req.file.filename;
                yield database_1.default.query('UPDATE proyecto SET url_respuesta_deysa=?, estado_respuesta_deysa=?, estado_proceso=? WHERE id_proyecto=?', [proyecto.url_respuesta_deysa, 1, 2, idProyecto]);
                //Informamos a los alumnos
                let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < alumnos.length; i++) {
                    let idAlumno = alumnos[i].fk_id_usuario;
                    let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                    let correo = alumno[0].correo;
                    nodemailer_1.email.enviarCorreo(correo, 'Respuesta DEySA de proyecto', `<p>El DEySA ha <strong>ACEPTADO</strong> la solicitud DEySA</p>`);
                }
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo aceptar solictud deysa");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    rechazarSolicitudDeysa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                let proyecto = new Proyecto_1.Proyecto();
                proyecto.url_respuesta_deysa = req.file.filename;
                const infoProyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                let urlObservacionesDirector = infoProyecto[0].url_observaciones_solicitud;
                //Elimnamos las anteriorres observaciones del director si existen
                if (urlObservacionesDirector != null) {
                    fileSystem_1.fSystem.eliminarArchivo(urlObservacionesDirector);
                }
                yield database_1.default.query('UPDATE proyecto SET url_respuesta_deysa=?, estado_respuesta_deysa=?,url_observaciones_solicitud=?, estado_solicitud_director=? WHERE id_proyecto=?', [proyecto.url_respuesta_deysa, 2, null, 0, idProyecto]);
                //Informamos a los alumnos
                let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < alumnos.length; i++) {
                    let idAlumno = alumnos[i].fk_id_usuario;
                    let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                    let correo = alumno[0].correo;
                    nodemailer_1.email.enviarCorreo(correo, 'Respuesta DEySA de proyecto', `<p>El DEySA ha <strong>RECHAZADO</strong> la solicitud DEySA</p>`);
                }
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo rechazar solictud deysa");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA CONFIGURACION----------------------------------------------------------------------------
    obtenerDeysa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idDeysa = req.params.id;
                const deysa = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDeysa);
                const numsEmpleado = yield database_1.default.query(`SELECT * FROM deysa WHERE fk_id_usuario=?`, idDeysa);
                const numEmpleado = numsEmpleado[0].num_empleado;
                deysa[0].num_empleado = numEmpleado;
                res.json(deysa);
            }
            catch (e) {
                console.log("Error metodo obtener deysa");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    actualizarDeysa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let usuario = new Usuario_1.Usuario();
                const idUsuario = req.params.id;
                usuario.num_empleado = req.body.num_empleado;
                usuario.nombre = req.body.nombre;
                usuario.apellido_paterno = req.body.apellido_paterno;
                usuario.apellido_materno = req.body.apellido_materno;
                usuario.correo = req.body.correo;
                usuario.password = bcriptjs_1.bcriptjsConfig.encriptar(req.body.password);
                //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=? AND id_usuario!=?`, [usuario.correo, idUsuario]);
                if (correoRegistrados.length > 0) {
                    errores.push("Correo registrado");
                }
                const numEmpleados = yield database_1.default.query(`SELECT num_empleado FROM docente WHERE num_empleado=?`, usuario.num_empleado);
                if (numEmpleados.length > 0) {
                    errores.push("Num empleado registrado");
                }
                const numEmpleados2 = yield database_1.default.query(`SELECT num_empleado FROM administrador WHERE num_empleado=?`, usuario.num_empleado);
                if (numEmpleados2.length > 0) {
                    errores.push("Num empleado registrado");
                }
                const numEmpleados3 = yield database_1.default.query(`SELECT num_empleado FROM deysa WHERE num_empleado=? AND fk_id_usuario!=?`, [usuario.num_empleado, idUsuario]);
                if (numEmpleados3.length > 0) {
                    errores.push("Num empleado registrado");
                }
                //SI HUBO ERRORES DE CAMPOS REGITRADOS
                if (errores.length > 0) {
                    console.log("Hay campos invalidos en el servidor");
                }
                else {
                    //INSERTAMOS DATOS---------------------------------------------
                    console.log("No hay errores en la respuesta");
                    yield database_1.default.query('UPDATE usuario SET correo=?, nombre=?, apellido_paterno=?, apellido_materno=?, password=? WHERE id_usuario=?', [usuario.correo, usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.password, idUsuario]);
                    yield database_1.default.query('UPDATE deysa SET num_empleado=? WHERE fk_id_usuario=?', [usuario.num_empleado, idUsuario]);
                    errores.push("Ninguno");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo actualizar deysa");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.deysaController = new DeysaController();
