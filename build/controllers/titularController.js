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
exports.titularController = void 0;
const database_1 = __importDefault(require("../database"));
const uuid = require('uuid/v4');
const Usuario_1 = require("../models/Usuario");
const fileSystem_1 = require("../lib/fileSystem");
const bcriptjs_1 = require("../lib/bcriptjs");
const variablesGlobales_1 = require("../models/variablesGlobales");
const nodemailer_1 = require("../lib/nodemailer");
class TitularController {
    //Pestaña Proyectos
    eliminarProyectos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const proyectos = yield database_1.default.query(`SELECT id_proyecto FROM proyecto`);
                for (let i = 0; i < proyectos.length; i++) {
                    let idProyecto = proyectos[i].id_proyecto;
                    const asesoresExternos = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_proyecto=?`, idProyecto);
                    if (asesoresExternos.length > 0) {
                        if (asesoresExternos[0].url_curriculum != null) {
                            const curriculum = asesoresExternos[0].url_curriculum;
                            fileSystem_1.fSystem.eliminarArchivo(curriculum);
                        }
                        const cartas = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_proyecto=?`, idProyecto);
                        const carta = cartas[0].url_carta_compromiso;
                        fileSystem_1.fSystem.eliminarArchivo(carta);
                    }
                    const proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                    if (proyecto[0].url_solicitud_deysa != null) {
                        const solicitud = proyecto[0].url_solicitud_deysa;
                        fileSystem_1.fSystem.eliminarArchivo(solicitud);
                    }
                    if (proyecto[0].url_respuesta_deysa != null) {
                        const respuesta = proyecto[0].url_respuesta_deysa;
                        fileSystem_1.fSystem.eliminarArchivo(respuesta);
                    }
                    if (proyecto[0].url_observaciones_solicitud != null) {
                        const observaciones = proyecto[0].url_observaciones_solicitud;
                        fileSystem_1.fSystem.eliminarArchivo(observaciones);
                    }
                    if (proyecto[0].url_protocolo != null) {
                        const protocolo = proyecto[0].url_protocolo;
                        fileSystem_1.fSystem.eliminarArchivo(protocolo);
                    }
                    if (proyecto[0].url_reporte != null) {
                        const reporte = proyecto[0].url_reporte;
                        fileSystem_1.fSystem.eliminarArchivo(reporte);
                    }
                    if (proyecto[0].url_presentacion != null) {
                        const presentacion = proyecto[0].url_presentacion;
                        fileSystem_1.fSystem.eliminarArchivo(presentacion);
                    }
                    const asesoresProtocolo = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                    for (let j = 0; j < asesoresProtocolo.length; j++) {
                        if (asesoresProtocolo[j].url_observaciones != null) {
                            const observaciones = asesoresProtocolo[j].url_observaciones;
                            fileSystem_1.fSystem.eliminarArchivo(observaciones);
                        }
                    }
                    const asesoresReporte = yield database_1.default.query(`SELECT * FROM reporte_asesor WHERE fk_id_proyecto=?`, idProyecto);
                    for (let k = 0; k < asesoresReporte.length; k++) {
                        if (asesoresReporte[k].url_observaciones != null) {
                            const observaciones = asesoresReporte[k].url_observaciones;
                            fileSystem_1.fSystem.eliminarArchivo(observaciones);
                        }
                    }
                    const asesoresPresentacion = yield database_1.default.query(`SELECT * FROM presentacion_asesor WHERE fk_id_proyecto=?`, idProyecto);
                    for (let l = 0; l < asesoresPresentacion.length; l++) {
                        if (asesoresPresentacion[l].url_observaciones != null) {
                            const observaciones = asesoresPresentacion[l].url_observaciones;
                            fileSystem_1.fSystem.eliminarArchivo(observaciones);
                        }
                    }
                    const revisoresProtocolo = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                    for (let m = 0; m < revisoresProtocolo.length; m++) {
                        if (revisoresProtocolo[m].url_observaciones != null) {
                            const observaciones = revisoresProtocolo[m].url_observaciones;
                            fileSystem_1.fSystem.eliminarArchivo(observaciones);
                        }
                    }
                    if (asesoresExternos.length > 0) {
                        let idAsesorexterno = asesoresExternos[0].fk_id_usuario;
                        yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idAsesorexterno);
                    }
                }
                yield database_1.default.query(`DELETE FROM proyecto`);
                res.json({ errores: "Ninguno", msg: "Alumnos eliminados" });
            }
            catch (e) {
                console.log("Error metodo elimnar proyecyos");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                //Eliminamos los archivos antes
                const asesoresExternos = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_proyecto=?`, idProyecto);
                //Si tiene asesores externos
                if (asesoresExternos.length > 0) {
                    if (asesoresExternos[0].url_curriculum != null) {
                        const curriculum = asesoresExternos[0].url_curriculum;
                        fileSystem_1.fSystem.eliminarArchivo(curriculum);
                    }
                    const cartas = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_proyecto=?`, idProyecto);
                    const carta = cartas[0].url_carta_compromiso;
                    fileSystem_1.fSystem.eliminarArchivo(carta);
                }
                const proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                if (proyecto[0].url_solicitud_deysa != null) {
                    const solicitud = proyecto[0].url_solicitud_deysa;
                    fileSystem_1.fSystem.eliminarArchivo(solicitud);
                }
                if (proyecto[0].url_respuesta_deysa != null) {
                    const respuesta = proyecto[0].url_respuesta_deysa;
                    fileSystem_1.fSystem.eliminarArchivo(respuesta);
                }
                if (proyecto[0].url_observaciones_solicitud != null) {
                    const observaciones = proyecto[0].url_observaciones_solicitud;
                    fileSystem_1.fSystem.eliminarArchivo(observaciones);
                }
                if (proyecto[0].url_protocolo != null) {
                    const protocolo = proyecto[0].url_protocolo;
                    fileSystem_1.fSystem.eliminarArchivo(protocolo);
                }
                if (proyecto[0].url_reporte != null) {
                    const reporte = proyecto[0].url_reporte;
                    fileSystem_1.fSystem.eliminarArchivo(reporte);
                }
                if (proyecto[0].url_presentacion != null) {
                    const presentacion = proyecto[0].url_presentacion;
                    fileSystem_1.fSystem.eliminarArchivo(presentacion);
                }
                const asesoresProtocolo = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let j = 0; j < asesoresProtocolo.length; j++) {
                    if (asesoresProtocolo[j].url_observaciones != null) {
                        const observaciones = asesoresProtocolo[j].url_observaciones;
                        fileSystem_1.fSystem.eliminarArchivo(observaciones);
                    }
                }
                const asesoresReporte = yield database_1.default.query(`SELECT * FROM reporte_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let k = 0; k < asesoresReporte.length; k++) {
                    if (asesoresReporte[k].url_observaciones != null) {
                        const observaciones = asesoresReporte[k].url_observaciones;
                        fileSystem_1.fSystem.eliminarArchivo(observaciones);
                    }
                }
                const asesoresPresentacion = yield database_1.default.query(`SELECT * FROM presentacion_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let l = 0; l < asesoresPresentacion.length; l++) {
                    if (asesoresPresentacion[l].url_observaciones != null) {
                        const observaciones = asesoresPresentacion[l].url_observaciones;
                        fileSystem_1.fSystem.eliminarArchivo(observaciones);
                    }
                }
                const revisoresProtocolo = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                for (let m = 0; m < revisoresProtocolo.length; m++) {
                    if (revisoresProtocolo[m].url_observaciones != null) {
                        const observaciones = revisoresProtocolo[m].url_observaciones;
                        fileSystem_1.fSystem.eliminarArchivo(observaciones);
                    }
                }
                if (asesoresExternos.length > 0) {
                    let idAsesorexterno = asesoresExternos[0].fk_id_usuario;
                    yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idAsesorexterno);
                }
                yield database_1.default.query(`DELETE FROM proyecto WHERE id_proyecto=?`, idProyecto);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo eliminar proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //Pestaña preregistro
    preregistrarAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let id = uuid();
                let tipo = req.body.tipo;
                let correo = req.body.correo;
                let preregistro = req.body.estado_registro;
                let errores = [];
                let banderaCorreo = false;
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, correo);
                if (correoRegistrados.length > 0) {
                    banderaCorreo = true;
                    errores.push("Correo registrado");
                }
                else {
                    banderaCorreo = false;
                }
                if (!banderaCorreo) {
                    yield database_1.default.query(`INSERT INTO usuario (id_usuario,correo,estado_registro) VALUES (?,?,?)`, [id, correo, preregistro]);
                    //Sacamos los ids de la relacion
                    const idsTipoRelacion = yield database_1.default.query(`SELECT id_tipo FROM tipo WHERE tipo=?`, tipo);
                    const idTipoRelacion = idsTipoRelacion[0].id_tipo;
                    const idsUsuarioRelacion = yield database_1.default.query(`SELECT id_usuario FROM usuario WHERE correo=?`, correo);
                    const idUsuarioRelacion = idsUsuarioRelacion[0].id_usuario;
                    //Insertamos la relacion
                    yield database_1.default.query(`INSERT INTO tipo_usuario (fk_id_usuario,fk_id_tipo) VALUES (?,?)`, [idUsuarioRelacion, idTipoRelacion]);
                    yield database_1.default.query(`INSERT INTO alumno (fk_id_usuario) VALUES (?)`, [idUsuarioRelacion]);
                    nodemailer_1.email.enviarCorreo(correo, 'Completar registro', `<p>Ya estas pre registrado. Ya puedes completar tu registro.<a href="${variablesGlobales_1.VariablesGlobales.dominio}/registro">Completar registro</a></p>`);
                    errores.push("Ninguno");
                }
                else {
                    console.log("Algo registrado");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error Metodo preregistro");
                console.log(e);
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA CONFIGURACION----------------------------------------------------------------------------
    obtenerTitular(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idTitular = req.params.id;
                const titular = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idTitular);
                const docentes = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idTitular);
                const numEmpleado = docentes[0].num_empleado;
                const idAcademia = docentes[0].fk_id_academia;
                const academias = yield database_1.default.query(`SELECT * FROM academia WHERE id_academia=?`, idAcademia);
                const academia = academias[0].nombre;
                titular[0].academia = academia;
                titular[0].num_empleado = numEmpleado;
                res.json(titular);
            }
            catch (e) {
                console.log("Error metodo obtener titular");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    actualizarTitular(req, res) {
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
                usuario.estado_registro = req.body.estado_registro;
                usuario.url_curriculum = req.file.filename;
                usuario.academia = req.body.academia;
                //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=? AND id_usuario!=?`, [usuario.correo, idUsuario]);
                if (correoRegistrados.length > 0) {
                    errores.push("Correo registrado");
                }
                const numEmpleados = yield database_1.default.query(`SELECT num_empleado FROM docente WHERE num_empleado=? AND fk_id_usuario!=?`, [usuario.num_empleado, idUsuario]);
                if (numEmpleados.length > 0) {
                    errores.push("Num empleado registrado");
                }
                const numEmpleados2 = yield database_1.default.query(`SELECT num_empleado FROM deysa WHERE num_empleado=?`, usuario.num_empleado);
                if (numEmpleados2.length > 0) {
                    errores.push("Num empleado registrado");
                }
                const numEmpleados3 = yield database_1.default.query(`SELECT num_empleado FROM administrador WHERE num_empleado=?`, usuario.num_empleado);
                if (numEmpleados3.length > 0) {
                    errores.push("Num empleado registrado");
                }
                //SI HUBO ERRORES DE CAMPOS REGITRADOS
                if (errores.length > 0) {
                    console.log("Hay campos invalidos en el servidor");
                    fileSystem_1.fSystem.eliminarArchivo(usuario.url_curriculum);
                }
                else {
                    //INSERTAMOS DATOS---------------------------------------------
                    console.log("No hay errores en la respuesta");
                    yield database_1.default.query('UPDATE usuario SET correo=?, nombre=?, apellido_paterno=?, apellido_materno=?, password=? WHERE id_usuario=?', [usuario.correo, usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.password, idUsuario]);
                    //Eliminamos el antiguo curriculum
                    const titulares = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idUsuario);
                    const curriculum = titulares[0].url_curriculum;
                    fileSystem_1.fSystem.eliminarArchivo(curriculum);
                    const idsAcademias = yield database_1.default.query(`SELECT id_academia FROM academia WHERE nombre=?`, usuario.academia);
                    const idAcademia = idsAcademias[0].id_academia;
                    yield database_1.default.query('UPDATE docente SET fk_id_academia=?, num_empleado=?, url_curriculum=? WHERE fk_id_usuario=?', [idAcademia, usuario.num_empleado, usuario.url_curriculum, idUsuario]);
                    errores.push("Ninguno");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo actualizar titular");
                errores.push("Consultas");
                let respuesta = { errores };
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                res.json(respuesta);
            }
        });
    }
    eliminarAlumnos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsAlumnos = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 5);
                for (let i = 0; i < idsAlumnos.length; i++) {
                    const idAlumno = idsAlumnos[i].fk_id_usuario;
                    yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idAlumno);
                }
                console.log("Alumnos eliminados");
                res.json({ errores: "Ninguno", msg: "Alumnos eliminados" });
            }
            catch (e) {
                console.log("Error Metodo elimnar alumnos");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idAlumno = req.params.id;
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idAlumno);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error Metodo elimnar alumno");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA ASIGNAR REVISOR--------------------------------------------------------------
    asignarRevisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let idUsuario = req.body.id_usuario;
                let idProyecto = req.body.proyecto;
                //Verificar el numero de revisores
                const revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                if (revisores.length >= 3) {
                    errores.push("Revisores completos");
                }
                //Verificar que no sea revisor
                const revisores2 = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idUsuario, idProyecto]);
                if (revisores2.length > 0) {
                    errores.push("Revisor incorrecto");
                }
                const asesores = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idUsuario, idProyecto]);
                if (asesores.length > 0) {
                    errores.push("Revisor incorrecto");
                }
                if (errores.length > 0) {
                    let respuesta = { errores };
                    res.json(respuesta);
                }
                else {
                    yield database_1.default.query(`INSERT INTO protocolo_revisor (fk_id_proyecto,fk_id_usuario,estado_e1,estado_e2,estado_e3) VALUES (?,?,?,?,?)`, [idProyecto, idUsuario, 0, 0, 0]);
                    errores.push("Ninguno");
                    let respuesta = { errores };
                    res.json(respuesta);
                }
            }
            catch (e) {
                console.log("Error metodo asignar revisor");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarRevisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idRevisor = req.params.idUsuario;
                const idProyecto = req.params.idProyecto;
                const existe = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idRevisor, idProyecto]);
                if (existe.length > 0) {
                    yield database_1.default.query(`DELETE FROM protocolo_revisor WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idRevisor, idProyecto]);
                    errores.push("Ninguno");
                }
                else {
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo eliminar revisor");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //Pestaña asignar jurado----------------------------------------------------------
    obtenerDocentesProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let listaDocentes = [];
            try {
                let idProyecto = req.params.id;
                const asesores = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                const revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesores.length; i++) {
                    const idDocente = asesores[i].fk_id_usuario;
                    let docente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDocente);
                    listaDocentes.push(docente[0]);
                }
                for (let i = 0; i < revisores.length; i++) {
                    const idDocente = revisores[i].fk_id_usuario;
                    let docente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDocente);
                    listaDocentes.push(docente[0]);
                }
                res.json(listaDocentes);
            }
            catch (e) {
                console.log("Error metodo obtener asesores proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    asignarJurado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let idUsuario = req.body.id_usuario;
                let idProyecto = req.body.proyecto;
                let rol = req.body.tipo;
                const existe = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idUsuario]);
                const existe2 = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=? AND fk_id_usuario=?`, [idProyecto, idUsuario]);
                //Si no es asesor ni revisor
                if (existe.length < 1 && existe2.length < 1) {
                    errores.push("No existe");
                }
                else {
                    //Verificar que no este registrado el rol
                    const jurado = yield database_1.default.query(`SELECT * FROM proyecto_jurado WHERE fk_id_proyecto=? AND rol=?`, [idProyecto, rol]);
                    if (jurado.length > 0) {
                        errores.push("Puesto registrado");
                    }
                    //Verificar el numero de revisores
                    const jurado2 = yield database_1.default.query(`SELECT * FROM proyecto_jurado WHERE fk_id_proyecto=?`, idProyecto);
                    if (jurado2.length >= 5) {
                        errores.push("Jurado completo");
                    }
                    //Verificar que no este registrado 
                    const jurado3 = yield database_1.default.query(`SELECT * FROM proyecto_jurado WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idUsuario, idProyecto]);
                    if (jurado3.length > 0) {
                        errores.push("Jurado incorrecto");
                    }
                    if (errores.length < 1) {
                        yield database_1.default.query(`INSERT INTO proyecto_jurado (fk_id_proyecto,fk_id_usuario,rol) VALUES (?,?,?)`, [idProyecto, idUsuario, rol]);
                        errores.push("Ninguno");
                    }
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo asignar jurado");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarJurado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idJurado = req.params.idUsuario;
                const idProyecto = req.params.idProyecto;
                const existe = yield database_1.default.query(`SELECT * FROM proyecto_jurado WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idJurado, idProyecto]);
                if (existe.length > 0) {
                    yield database_1.default.query(`DELETE FROM proyecto_jurado WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idJurado, idProyecto]);
                    errores.push("Ninguno");
                }
                else {
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo eliminar jurado");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.titularController = new TitularController();
