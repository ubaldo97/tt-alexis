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
exports.alumnoController = void 0;
const database_1 = __importDefault(require("../database"));
const fileSystem_1 = require("../lib/fileSystem");
const uuid = require('uuid/v4');
const Usuario_1 = require("../models/Usuario");
const bcriptjs_1 = require("../lib/bcriptjs");
const Proyecto_1 = require("../models/Proyecto");
const nodemailer_1 = require("../lib/nodemailer");
class AlumnoController {
    //PESTAÑA INICIO
    obtenerEstadoProceso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let estadoProceso;
            try {
                let idAlumno = req.params.id;
                const idsProyecto = yield database_1.default.query(`SELECT fk_id_proyecto FROM alumno WHERE fk_id_usuario=? AND fk_id_proyecto IS NOT NULL `, idAlumno);
                let idProyecto = idsProyecto[0];
                if (idProyecto === undefined) {
                    estadoProceso = 0;
                }
                else {
                    idProyecto = idProyecto.fk_id_proyecto;
                    const estadosProcesos = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                    estadoProceso = estadosProcesos[0].estado_proceso;
                }
                let respuesta = { estadoProceso: estadoProceso };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo obtener estado proceso");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarAlumnosRegistrados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                //const idsAlumnos1=await db.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`,5);
                const idsAlumnos = yield database_1.default.query(`SELECT fk_id_usuario FROM alumno WHERE fk_id_proyecto IS NULL`);
                let alumnos = [];
                for (let i = 0; i < idsAlumnos.length; i++) {
                    const idAlumno = idsAlumnos[i].fk_id_usuario;
                    let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=? AND estado_registro=?`, [idAlumno, "Registrado"]);
                    if (alumno.length != 0 && alumno[0].estado_registro === 'Registrado') {
                        const boletas = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_usuario=?`, idAlumno);
                        const boleta = boletas[0].boleta;
                        const idsCarrera = yield database_1.default.query(`SELECT fk_id_carrera FROM alumno`);
                        let idCarrera = idsCarrera[0].fk_id_carrera;
                        const idsProyecto = yield database_1.default.query(`SELECT fk_id_proyecto FROM alumno`);
                        let idProyecto = idsProyecto[0].fk_id_proyecto;
                        if (idCarrera > 0) {
                            let carreras = yield database_1.default.query(`SELECT * FROM carrera WHERE id_carrera=?`, idCarrera);
                            const carrera = carreras[0].nombre;
                            alumno[0].carrera = carrera;
                        }
                        if (idProyecto > 0) {
                            let proyectos = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                            const proyecto = proyectos[0].nombre;
                            alumno[0].proyecto = proyecto;
                        }
                        alumno[0].boleta = boleta;
                        if (alumno.length > 0) {
                            alumnos.push(alumno[0]);
                        }
                    }
                }
                res.json(alumnos);
            }
            catch (e) {
                console.log("Error Metodo mostrar alumnos registrados");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    registrarProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let idProyecto = uuid();
                let nombre = req.body.nombre;
                let lineaInvestigacion = req.body.linea_investigacion;
                let numAlumnos = req.body.num_alumnos;
                let alumnos = [];
                alumnos.push(req.body.alumno1);
                if (numAlumnos == 2) {
                    alumnos.push(req.body.alumno2);
                }
                if (numAlumnos == 3) {
                    alumnos.push(req.body.alumno2);
                    alumnos.push(req.body.alumno3);
                }
                const proyectosRegistrados = yield database_1.default.query(`SELECT * FROM proyecto WHERE nombre=?`, nombre);
                if (proyectosRegistrados.length > 0) {
                    errores.push("Proyecto registrado");
                }
                if (errores.length > 0) {
                    let respuesta = { errores };
                    console.log("Hay campos invalidos en el servidor");
                    res.json(respuesta);
                }
                else {
                    console.log("No hay errores en la respuesta");
                    yield database_1.default.query(`INSERT INTO proyecto (id_proyecto,nombre,linea_investigacion,estado_solicitud_director,estado_respuesta_deysa,estado_proceso,num_entregas_protocolo) VALUES (?,?,?,?,?,?,?)`, [idProyecto, nombre, lineaInvestigacion, 0, 0, 1, 0]);
                    for (let i = 0; i < alumnos.length; i++) {
                        yield database_1.default.query('UPDATE alumno SET fk_id_proyecto=? WHERE fk_id_usuario=?', [idProyecto, alumnos[i]]);
                    }
                    const titulares = yield database_1.default.query(`SELECT * FROM tipo_usuario WHERE fk_id_tipo=?`, 2);
                    const titular = titulares[0].fk_id_usuario;
                    yield database_1.default.query(`INSERT INTO proyecto_jurado (fk_id_proyecto,fk_id_usuario,rol) VALUES (?,?,?)`, [idProyecto, titular, "Secretario"]);
                    errores.push("Ninguno");
                    let respuesta = { errores, msg: idProyecto };
                    res.json(respuesta);
                }
            }
            catch (e) {
                console.log("Error metodo registrar proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAñA PROYECTO
    obtenerAsesoresProyectoAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let listaAsesores = [];
            try {
                const idProyecto = req.params.id;
                const asesoresInternos = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=? AND tipo_asesor=?`, [idProyecto, "Interno"]);
                const asesoresExternos = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=? AND tipo_asesor=?`, [idProyecto, "Externo"]);
                //Datos Internos
                for (let i = 0; i < asesoresInternos.length; i++) {
                    const idDocente = asesoresInternos[i].fk_id_usuario;
                    let docente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDocente);
                    docente[0].tipo_asesor = asesoresInternos[i].tipo_asesor;
                    const curriculums = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idDocente);
                    const curriculum = curriculums[0].url_curriculum;
                    const numsEmpleado = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idDocente);
                    const numEmpleado = numsEmpleado[0].num_empleado;
                    const idsAcademia = yield database_1.default.query(`SELECT fk_id_academia FROM docente WHERE fk_id_usuario=?`, idDocente);
                    let idAcademia = idsAcademia[0].fk_id_academia;
                    if (idAcademia != null) {
                        let academias = yield database_1.default.query(`SELECT * FROM academia WHERE id_academia=?`, idAcademia);
                        const academia = academias[0].nombre;
                        docente[0].academia = academia;
                    }
                    docente[0].num_empleado = numEmpleado;
                    docente[0].url_curriculum = curriculum;
                    listaAsesores.push(docente[0]);
                }
                //Datos Externos
                for (let i = 0; i < asesoresExternos.length; i++) {
                    const idAsesorExterno = asesoresExternos[i].fk_id_usuario;
                    let asesorExterno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAsesorExterno);
                    asesorExterno[0].tipo_asesor = asesoresExternos[i].tipo_asesor;
                    const curriculums = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                    const curriculum = curriculums[0].url_curriculum;
                    asesorExterno[0].url_curriculum = curriculum;
                    listaAsesores.push(asesorExterno[0]);
                }
                let proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, [idProyecto]);
                let idDirector = proyecto[0].fk_id_director;
                let director;
                if (idDirector != null) {
                    for (let i = 0; i < listaAsesores.length; i++) {
                        if (idDirector === listaAsesores[i].id_usuario) {
                            director = listaAsesores[i];
                            listaAsesores.splice(i, 1);
                        }
                    }
                }
                res.json({ asesores: listaAsesores, director: director });
            }
            catch (e) {
                console.log("Error metodo obtener asesores proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    actualizarProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let proyecto = new Proyecto_1.Proyecto();
                const idProyecto = req.params.id;
                proyecto.nombre = req.body.nombre;
                proyecto.linea_investigacion = req.body.linea_investigacion;
                proyecto.director_proyecto = req.body.director_proyecto;
                const proyectosRegistrados = yield database_1.default.query(`SELECT * FROM proyecto WHERE nombre=? AND id_proyecto!=?`, [proyecto.nombre, idProyecto]);
                if (proyectosRegistrados.length > 0) {
                    errores.push("Proyecto registrado");
                }
                //SI HUBO ERRORES DE CAMPOS REGITRADOS
                if (errores.length > 0) {
                    let respuesta = { errores };
                    console.log("Hay campos invalidos en el servidor");
                    res.json(respuesta);
                }
                else {
                    //INSERTAMOS DATOS---------------------------------------------
                    console.log("No hay errores en la respuesta");
                    yield database_1.default.query('UPDATE proyecto SET nombre=?, linea_investigacion=?,fk_id_director=? WHERE id_proyecto=?', [proyecto.nombre, proyecto.linea_investigacion, proyecto.director_proyecto, idProyecto]);
                    //ENVIAMOS RESPUESTA
                    let errores = [];
                    errores.push("Ninguno");
                    let respuesta = { errores };
                    res.json(respuesta);
                }
            }
            catch (e) {
                console.log("Error metodo actualizar proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    registrarAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                //Ambos
                let tipo = req.body.tipo;
                let idProyecto = req.body.id_proyecto;
                //Interno
                let idInterno;
                //Externo
                let idExterno;
                let nombre;
                let apellidoPaterno;
                let apellidoMaterno;
                let correo;
                let preregistro;
                let curriculum;
                if (tipo == "Interno") {
                    idInterno = req.body.id_usuario;
                }
                else {
                    idExterno = uuid();
                    nombre = req.body.nombre;
                    apellidoPaterno = req.body.apellido_paterno;
                    apellidoMaterno = req.body.apellido_materno;
                    correo = req.body.correo;
                    preregistro = req.body.estado_registro;
                    curriculum = req.file.filename;
                }
                let errores = [];
                let numAsesores = 0;
                //Primero validamos que no tenga mas de 3 asesores 
                const asesoresProyecto = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                numAsesores += asesoresProyecto.length;
                const asesoresProyecto2 = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_proyecto=?`, idProyecto);
                numAsesores += asesoresProyecto2.length;
                if (numAsesores >= 3) {
                    errores.push("Asesores completos");
                }
                //Validamos que no este ya en el proyecto
                if (tipo == "Interno") {
                    const asesoresRegistrados = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idInterno, idProyecto]);
                    if (asesoresRegistrados.length > 0) {
                        errores.push("Asesor registrado");
                    }
                }
                else {
                    //Validamos que no exista el correo
                    const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, correo);
                    if (correoRegistrados.length > 0) {
                        errores.push("Correo registrado");
                    }
                    const asesoresRegistrados = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idExterno, idProyecto]);
                    if (asesoresRegistrados.length > 0) {
                        errores.push("Asesor registrado");
                    }
                    const asesoresProyecto2 = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idExterno, idProyecto]);
                    if (asesoresProyecto2.length > 0) {
                        errores.push("Asesor registrado");
                    }
                    const asesoresProyecto3 = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_proyecto=?`, idProyecto);
                    if (asesoresProyecto3.length >= 2) {
                        errores.push("Asesores externos completos");
                    }
                }
                //Si no esta registrado
                if (errores.length < 1) {
                    if (tipo == "Interno") {
                        yield database_1.default.query(`INSERT INTO protocolo_asesor (fk_id_proyecto,fk_id_usuario,estado,tipo_asesor) VALUES (?,?,?,?)`, [idProyecto, idInterno, 0, "Interno"]);
                        yield database_1.default.query(`INSERT INTO reporte_asesor (fk_id_proyecto,fk_id_usuario,estado,tipo_asesor) VALUES (?,?,?,?)`, [idProyecto, idInterno, 0, "Interno"]);
                        yield database_1.default.query(`INSERT INTO presentacion_asesor (fk_id_proyecto,fk_id_usuario,estado,tipo_asesor) VALUES (?,?,?,?)`, [idProyecto, idInterno, 0, "Interno"]);
                        errores.push("Ninguno");
                    }
                    else {
                        yield database_1.default.query(`INSERT INTO usuario (id_usuario,nombre,apellido_paterno,apellido_materno,correo,estado_registro) VALUES (?,?,?,?,?,?)`, [idExterno, nombre, apellidoPaterno, apellidoMaterno, correo, preregistro]);
                        yield database_1.default.query(`INSERT INTO asesor_externo (fk_id_usuario,fk_id_proyecto,url_carta_compromiso) VALUES (?,?,?)`, [idExterno, idProyecto, curriculum]);
                        //Insertamos la relacion en tipo_usuario
                        const idsTipoRelacion = yield database_1.default.query(`SELECT id_tipo FROM tipo WHERE tipo=?`, "Asesor externo");
                        const idTipoRelacion = idsTipoRelacion[0].id_tipo;
                        yield database_1.default.query(`INSERT INTO tipo_usuario (fk_id_usuario,fk_id_tipo) VALUES (?,?)`, [idExterno, idTipoRelacion]);
                        errores.push("Ninguno");
                    }
                }
                else {
                    if (tipo == "Externo") {
                        fileSystem_1.fSystem.eliminarArchivo(curriculum);
                    }
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo registrar asesor");
                errores.push("Consultas");
                if (req.body.tipo == "Externo") {
                    fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarAsesorProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idAsesor = req.params.id;
                let asesorExterno = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fK_id_usuario=?`, [idAsesor]);
                const idProyecto = req.params.idProyecto;
                yield database_1.default.query(`DELETE FROM protocolo_asesor WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idAsesor, idProyecto]);
                yield database_1.default.query(`DELETE FROM reporte_asesor WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idAsesor, idProyecto]);
                yield database_1.default.query(`DELETE FROM presentacion_asesor WHERE fk_id_usuario=? AND fk_id_proyecto=?`, [idAsesor, idProyecto]);
                let proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, [idProyecto]);
                let director = proyecto[0].fk_id_director;
                if (director != null && director == idAsesor) {
                    yield database_1.default.query('UPDATE proyecto SET fk_id_director=? WHERE id_proyecto=?', [null, idProyecto]);
                }
                else {
                }
                if (asesorExterno.length > 0) {
                    console.log("Es externo");
                    if (asesorExterno[0].url_curriculum != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesorExterno[0].url_curriculum);
                    }
                    yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, [idAsesor]);
                }
                res.json({ error: "Ninguno", msg: "asesor eliminado" });
            }
            catch (e) {
                console.log("Error metodo eliminar asesor proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA CONFIGURACION
    obtenerAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idAlumno = req.params.id;
                const alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                const boletas = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_usuario=?`, idAlumno);
                const boleta = boletas[0].boleta;
                const idsCarrera = yield database_1.default.query(`SELECT fk_id_carrera FROM alumno WHERE fk_id_usuario=?`, idAlumno);
                let idCarrera = idsCarrera[0].fk_id_carrera;
                const idsProyecto = yield database_1.default.query(`SELECT fk_id_proyecto FROM alumno WHERE fk_id_usuario=?`, idAlumno);
                let idProyecto = idsProyecto[0].fk_id_proyecto;
                if (idCarrera != null) {
                    let carreras = yield database_1.default.query(`SELECT * FROM carrera WHERE id_carrera=?`, idCarrera);
                    const carrera = carreras[0].nombre;
                    alumno[0].carrera = carrera;
                }
                if (idProyecto != null) {
                    let proyectos = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                    const proyecto = proyectos[0].nombre;
                    alumno[0].proyecto = proyecto;
                }
                alumno[0].boleta = boleta;
                res.json(alumno);
            }
            catch (e) {
                console.log("Error metodo obtener alumno");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    actualizarAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let usuario = new Usuario_1.Usuario();
                const idUsuario = req.params.id;
                const existe = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                if (existe.length > 0) {
                    usuario.boleta = req.body.boleta;
                    usuario.nombre = req.body.nombre;
                    usuario.apellido_paterno = req.body.apellido_paterno;
                    usuario.apellido_materno = req.body.apellido_materno;
                    usuario.carrera = req.body.carrera;
                    usuario.correo = req.body.correo;
                    usuario.password = bcriptjs_1.bcriptjsConfig.encriptar(req.body.password);
                    //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
                    const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=? AND id_usuario!=?`, [usuario.correo, idUsuario]);
                    if (correoRegistrados.length > 0) {
                        errores.push("Correo registrado");
                    }
                    const boleta = yield database_1.default.query(`SELECT boleta FROM alumno WHERE boleta=? AND fk_id_usuario!=?`, [usuario.boleta, idUsuario]);
                    if (boleta.length > 0) {
                        errores.push("Boleta registrada");
                    }
                    //SI HUBO ERRORES DE CAMPOS REGITRADOS
                    if (errores.length > 0) {
                        console.log("Hay campos invalidos en el servidor");
                    }
                    else {
                        //INSERTAMOS DATOS---------------------------------------------
                        console.log("No hay errores en la respuesta");
                        yield database_1.default.query('UPDATE usuario SET correo=?, nombre=?, apellido_paterno=?, apellido_materno=?, password=? WHERE id_usuario=?', [usuario.correo, usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.password, idUsuario]);
                        const idsCarreras = yield database_1.default.query(`SELECT id_carrera FROM carrera WHERE nombre=?`, usuario.carrera);
                        const idCarrera = idsCarreras[0].id_carrera;
                        yield database_1.default.query('UPDATE alumno SET boleta=?, fk_id_carrera=? WHERE fk_id_usuario=?', [usuario.boleta, idCarrera, idUsuario]);
                        errores.push("Ninguno");
                    }
                }
                else {
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo actualizar alumno");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA SOLICITUD
    enviarSolicitudDeysa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                let proyecto = new Proyecto_1.Proyecto();
                proyecto.url_solicitud_deysa = req.file.filename;
                const infoProyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                let urlSolicitudDeysa = infoProyecto[0].url_solicitud_deysa;
                //Elimnamos la anteriosrs olicitud si existe
                if (urlSolicitudDeysa != null) {
                    fileSystem_1.fSystem.eliminarArchivo(urlSolicitudDeysa);
                }
                let urlObservacionesDirector = infoProyecto[0].url_observaciones_solicitud;
                //Elimnamos las anteriorres observaciones del director si existen
                if (urlObservacionesDirector != null) {
                    fileSystem_1.fSystem.eliminarArchivo(urlObservacionesDirector);
                }
                yield database_1.default.query('UPDATE proyecto SET url_solicitud_deysa=?,url_observaciones_solicitud=?, estado_solicitud_director=? WHERE id_proyecto=?', [proyecto.url_solicitud_deysa, null, 3, idProyecto]);
                //Enviamos email al directorcd
                let idDirector = infoProyecto[0].fk_id_director;
                let director = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDirector);
                let correo = director[0].correo;
                let nombreProyecto = infoProyecto[0].nombre;
                nodemailer_1.email.enviarCorreo(correo, 'Nueva solicitud DEySA', `<p>El proyecto ${nombreProyecto} ha enviado una solicitud DEySA</p>`);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo enviar solictud deysa");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PROTOCOLO
    entregaVacia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("entro a enterga vacia");
            let errores = [];
            try {
                let idProyecto = req.body.id_proyecto;
                let numEntregasProtocolo = req.body.num_entregas_protocolo;
                let revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                let rechazados = 0;
                if (revisores.length > 0) {
                    if (numEntregasProtocolo == 1) {
                        for (let i = 0; i < revisores.length; i++) {
                            yield database_1.default.query('UPDATE protocolo_revisor SET estado_e1=?,url_observaciones_e1=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [2, null, idProyecto, revisores[i].fk_id_usuario]);
                            rechazados++;
                        }
                    }
                    if (numEntregasProtocolo == 2) {
                        for (let i = 0; i < revisores.length; i++) {
                            yield database_1.default.query('UPDATE protocolo_revisor SET estado_e2=?,url_observaciones_e2=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [2, null, idProyecto, revisores[i].fk_id_usuario]);
                            rechazados++;
                        }
                    }
                    if (numEntregasProtocolo == 3) {
                        for (let i = 0; i < revisores.length; i++) {
                            yield database_1.default.query('UPDATE protocolo_revisor SET estado_e3=?,url_observaciones_e3=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [2, null, idProyecto, revisores[i].fk_id_usuario]);
                            rechazados++;
                        }
                    }
                    if (revisores.length == rechazados) {
                        yield database_1.default.query('UPDATE proyecto SET estado_protocolo_revisores=? WHERE id_proyecto=?', [2, idProyecto]);
                    }
                    yield database_1.default.query('UPDATE proyecto SET num_entregas_protocolo=? WHERE id_proyecto=?', [numEntregasProtocolo, idProyecto]);
                }
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo entrega vacia");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    revisionVacia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entro a revision vacia");
            let errores = [];
            try {
                let idProyecto = req.body.id_proyecto;
                let numEntregasProtocolo = req.body.num_entregas_protocolo;
                console.log(numEntregasProtocolo);
                let revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                let aceptados = 0;
                let revisados = 0;
                let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                if (revisores.length > 0) {
                    if (numEntregasProtocolo == 1) {
                        for (let i = 0; i < revisores.length; i++) {
                            if (revisores[i].estado_e1 == 3) {
                                yield database_1.default.query('UPDATE protocolo_revisor SET estado_e1=?,url_observaciones_e1=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [1, null, idProyecto, revisores[i].fk_id_usuario]);
                                aceptados++;
                                revisados++;
                            }
                            else if (revisores[i].estado_e1 == 2) {
                                revisados++;
                            }
                            else if (revisores[i].estado_e1 == 1) {
                                revisados++;
                            }
                        }
                    }
                    if (numEntregasProtocolo == 2) {
                        console.log("entra aaaaa 2");
                        for (let i = 0; i < revisores.length; i++) {
                            if (revisores[i].estado_e2 == 3) {
                                yield database_1.default.query('UPDATE protocolo_revisor SET estado_e2=?,url_observaciones_e2=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [1, null, idProyecto, revisores[i].fk_id_usuario]);
                                aceptados++;
                                revisados++;
                            }
                            else if (revisores[i].estado_e2 == 2) {
                                revisados++;
                            }
                            else if (revisores[i].estado_e2 == 1) {
                                revisados++;
                            }
                        }
                    }
                    if (numEntregasProtocolo == 3) {
                        for (let i = 0; i < revisores.length; i++) {
                            if (revisores[i].estado_e3 == 3) {
                                yield database_1.default.query('UPDATE protocolo_revisor SET estado_e3=?,url_observaciones_e3=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [1, null, idProyecto, revisores[i].fk_id_usuario]);
                                aceptados++;
                                revisados++;
                            }
                            else if (revisores[i].estado_e3 == 2) {
                                revisados++;
                            }
                            else if (revisores[i].estado_e3 == 1) {
                                revisados++;
                            }
                        }
                    }
                    if (revisores.length == aceptados) {
                        console.log("entra aceptados");
                        yield database_1.default.query('UPDATE proyecto SET estado_proceso=?,estado_protocolo_revisores=? WHERE id_proyecto=?', [3, 1, idProyecto]);
                        //Informamos a los alumnos
                        for (let i = 0; i < alumnos.length; i++) {
                            let idAlumno = alumnos[i].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de revisores a protocolo', `<p>Los revisores han <strong>ACEPTADO</strong> el protocolo.</p>`);
                        }
                    }
                    else if (revisores.length == revisados) {
                        console.log("entra revisados");
                        //si estan revisoados pero no aprobados cambiamos los estados de asesores a 0 para que vuelva amandar el protocolo,
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
                        for (let l = 0; l < alumnos.length; l++) {
                            let idAlumno = alumnos[l].fk_id_usuario;
                            let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                            let correo = alumno[0].correo;
                            nodemailer_1.email.enviarCorreo(correo, 'Respuesta de revisores a protocolo', `<p>Los revisores han <strong>RECHAZADO</strong> el protocolo.</p>`);
                        }
                    }
                }
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo revision vacia");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA PROTOCOLO
    enviarProtocolo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                let urlProtocolo = req.file.filename;
                const infoProyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                let urlProtocoloViejo = infoProyecto[0].url_protocolo;
                let nombreProyecto = infoProyecto[0].nombre;
                //Elimnamos la anteriosrs olicitud si existe
                if (urlProtocoloViejo != null) {
                    fileSystem_1.fSystem.eliminarArchivo(urlProtocoloViejo);
                }
                yield database_1.default.query('UPDATE proyecto SET url_protocolo=?, estado_protocolo_asesores=? WHERE id_proyecto=?', [urlProtocolo, 3, idProyecto]);
                const asesores = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesores.length; i++) {
                    if (asesores[i].url_observaciones != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesores[i].url_observaciones);
                    }
                    yield database_1.default.query('UPDATE protocolo_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 3, idProyecto, asesores[i].fk_id_usuario]);
                    let idAsesor = asesores[i].fk_id_usuario;
                    let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAsesor);
                    let correo = asesor[0].correo;
                    nodemailer_1.email.enviarCorreo(correo, 'Nuevo protocolo', `<p>El proyecto ${nombreProyecto} ha enviado un protocolo para revisión</p>`);
                }
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo enviar protocolo");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA Reporte
    enviarReporte(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                let urlReporte = req.file.filename;
                const infoProyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                let urlReporteViejo = infoProyecto[0].url_reporte;
                let nombreProyecto = infoProyecto[0].nombre;
                //Elimnamos la anteriosrs olicitud si existe
                if (urlReporteViejo != null) {
                    fileSystem_1.fSystem.eliminarArchivo(urlReporteViejo);
                }
                yield database_1.default.query('UPDATE proyecto SET url_reporte=?, estado_reporte_asesores=? WHERE id_proyecto=?', [urlReporte, 3, idProyecto]);
                const asesores = yield database_1.default.query(`SELECT * FROM reporte_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesores.length; i++) {
                    if (asesores[i].url_observaciones != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesores[i].url_observaciones);
                    }
                    yield database_1.default.query('UPDATE reporte_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 3, idProyecto, asesores[i].fk_id_usuario]);
                    let idAsesor = asesores[i].fk_id_usuario;
                    let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAsesor);
                    let correo = asesor[0].correo;
                    nodemailer_1.email.enviarCorreo(correo, 'Nuevo Reporte final', `<p>El proyecto ${nombreProyecto} ha enviado un reporte final para revisión</p>`);
                }
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo enviar reporte");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA Reporte
    enviarPresentacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                let urlPresentacion = req.file.filename;
                const infoProyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                let urlPresentacionVieja = infoProyecto[0].url_presentacion;
                let nombreProyecto = infoProyecto[0].nombre;
                //Elimnamos la anteriosrs olicitud si existe
                if (urlPresentacionVieja != null) {
                    fileSystem_1.fSystem.eliminarArchivo(urlPresentacionVieja);
                }
                yield database_1.default.query('UPDATE proyecto SET url_presentacion=?, estado_presentacion_asesores=? WHERE id_proyecto=?', [urlPresentacion, 3, idProyecto]);
                const asesores = yield database_1.default.query(`SELECT * FROM presentacion_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesores.length; i++) {
                    if (asesores[i].url_observaciones != null) {
                        fileSystem_1.fSystem.eliminarArchivo(asesores[i].url_observaciones);
                    }
                    yield database_1.default.query('UPDATE presentacion_asesor SET url_observaciones=?, estado=? WHERE fk_id_proyecto=? AND fk_id_usuario=?', [null, 3, idProyecto, asesores[i].fk_id_usuario]);
                    let idAsesor = asesores[i].fk_id_usuario;
                    let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAsesor);
                    let correo = asesor[0].correo;
                    nodemailer_1.email.enviarCorreo(correo, 'Nueva presentación', `<p>El proyecto ${nombreProyecto} ha enviado una presentación para revisión</p>`);
                }
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo enviar presentacion");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerDocumentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                const asesoresProtocolo = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesoresProtocolo.length; i++) {
                    let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, asesoresProtocolo[i].fk_id_usuario);
                    let nombre = `${asesor[0].nombre} ${asesor[0].apellido_paterno} ${asesor[0].apellido_materno}`;
                    asesoresProtocolo[i].nombre = nombre;
                }
                const asesoresReporte = yield database_1.default.query(`SELECT * FROM reporte_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesoresReporte.length; i++) {
                    let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, asesoresReporte[i].fk_id_usuario);
                    let nombre = `${asesor[0].nombre} ${asesor[0].apellido_paterno} ${asesor[0].apellido_materno}`;
                    asesoresReporte[i].nombre = nombre;
                }
                const asesoresPresentacion = yield database_1.default.query(`SELECT * FROM presentacion_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesoresReporte.length; i++) {
                    let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, asesoresPresentacion[i].fk_id_usuario);
                    let nombre = `${asesor[0].nombre} ${asesor[0].apellido_paterno} ${asesor[0].apellido_materno}`;
                    asesoresPresentacion[i].nombre = nombre;
                }
                const revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < revisores.length; i++) {
                    let revisor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, revisores[i].fk_id_usuario);
                    let nombre = `${revisor[0].nombre} ${revisor[0].apellido_paterno} ${revisor[0].apellido_materno}`;
                    revisores[i].nombre = nombre;
                }
                const idsDirector = yield database_1.default.query(`SELECT fk_id_director FROM proyecto WHERE id_proyecto=?`, idProyecto);
                if (idsDirector[0].fk_id_director != null) {
                    const idDirector = idsDirector[0].fk_id_director;
                    const director = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDirector);
                    let nombreDirector = `${director[0].nombre} ${director[0].apellido_paterno} ${director[0].apellido_materno}`;
                    proyecto[0].director = nombreDirector;
                }
                const idsDeysa = yield database_1.default.query(`SELECT fk_id_usuario FROM deysa`);
                if (idsDeysa.length > 0) {
                    const idDeysa = idsDeysa[0].fk_id_usuario;
                    const deysa = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDeysa);
                    let nombreDeysa = `${deysa[0].nombre} ${deysa[0].apellido_paterno} ${deysa[0].apellido_materno}`;
                    proyecto[0].deysa = nombreDeysa;
                }
                proyecto[0].asesoresProtocolo = asesoresProtocolo;
                proyecto[0].asesoresReporte = asesoresReporte;
                proyecto[0].asesoresPresentacion = asesoresPresentacion;
                proyecto[0].revisores = revisores;
                res.json(proyecto);
            }
            catch (e) {
                console.log("Error metodo obtener documentos");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.alumnoController = new AlumnoController();
