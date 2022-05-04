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
exports.administradorController = void 0;
const database_1 = __importDefault(require("../database"));
const fileSystem_1 = require("../lib/fileSystem");
const Usuario_1 = require("../models/Usuario");
const variablesGlobales_1 = require("../models/variablesGlobales");
const bcriptjs_1 = require("../lib/bcriptjs");
const uuid = require('uuid/v4');
const nodemailer_1 = require("../lib/nodemailer");
class AdministradorController {
    //PESTAÑA PROYECTOS
    actualizarLugarFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let idProyecto = req.body.id_proyecto;
            let fecha = req.body.fecha_examen;
            let lugar = req.body.lugar_examen;
            let hora = req.body.hora_examen;
            let fechaReporte = req.body.fecha_reporte;
            try {
                yield database_1.default.query('UPDATE proyecto SET lugar_examen=?,fecha_examen=?,hora_examen=?,fecha_reporte=? WHERE id_proyecto=?', [lugar, fecha, hora, fechaReporte, idProyecto]);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo lugar y fecha");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA USUARIOS--------------------------------------------------------
    preregistrarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let id = uuid();
                let tipo = req.body.tipo;
                let correo = req.body.correo;
                let preregistro = req.body.estado_registro;
                let errores = [];
                let banderaCorreo = false;
                let banderaTitular = false;
                let banderaDeysa = false;
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, correo);
                if (correoRegistrados.length > 0) {
                    banderaCorreo = true;
                    errores.push("Correo registrado");
                }
                else {
                    banderaCorreo = false;
                }
                if (tipo === 'Titular') {
                    const titularesRegistrados = yield database_1.default.query(`SELECT * FROM tipo_usuario WHERE fk_id_tipo=?`, 2);
                    if (titularesRegistrados.length > 0) {
                        banderaTitular = true;
                        errores.push("Titular registrado");
                    }
                    else {
                        banderaTitular = false;
                    }
                }
                else if (tipo === 'Deysa') {
                    const deysaRegistrados = yield database_1.default.query(`SELECT * FROM tipo_usuario WHERE fk_id_tipo=?`, 3);
                    if (deysaRegistrados.length > 0) {
                        banderaDeysa = true;
                        errores.push("Deysa registrado");
                    }
                    else {
                        banderaDeysa = false;
                    }
                }
                if (!banderaCorreo && !banderaTitular && !banderaDeysa) {
                    yield database_1.default.query(`INSERT INTO usuario (id_usuario,correo,estado_registro) VALUES (?,?,?)`, [id, correo, preregistro]);
                    //Sacamos los ids de la relacion
                    const idsTipoRelacion = yield database_1.default.query(`SELECT id_tipo FROM tipo WHERE tipo=?`, tipo);
                    const idTipoRelacion = idsTipoRelacion[0].id_tipo;
                    const idsUsuarioRelacion = yield database_1.default.query(`SELECT id_usuario FROM usuario WHERE correo=?`, correo);
                    const idUsuarioRelacion = idsUsuarioRelacion[0].id_usuario;
                    //Insertamos la relacion
                    yield database_1.default.query(`INSERT INTO tipo_usuario (fk_id_usuario,fk_id_tipo) VALUES (?,?)`, [idUsuarioRelacion, idTipoRelacion]);
                    //Deysa
                    if (tipo == 'Deysa') {
                        yield database_1.default.query(`INSERT INTO deysa (fk_id_usuario) VALUES (?)`, [idUsuarioRelacion]);
                    }
                    //Docente o Titular
                    else if (tipo == 'Docente' || tipo == 'Titular') {
                        yield database_1.default.query(`INSERT INTO docente (fk_id_usuario) VALUES (?)`, [idUsuarioRelacion]);
                    }
                    //email.enviarCorreo(correo,'Completar registro',`<p>Ya estas pre registrado. Ya puedes completar el registro.<a href="${VariablesGlobales.dominio}/registro">Completar registro</a></p>`);
                    errores.push("Ninguno");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error Metodo preregistro");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //Mostrar Titulares
    mostrarTitulares(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsTitular = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 2);
                if (idsTitular.length > 0) {
                    const idTitular = idsTitular[0].fk_id_usuario;
                    const titular = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idTitular);
                    const titulares = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idTitular);
                    const numEmpleado = titulares[0].num_empleado;
                    const curriculum = titulares[0].url_curriculum;
                    const idsAcademia = yield database_1.default.query(`SELECT fk_id_academia FROM docente WHERE fk_id_usuario=?`, idTitular);
                    let idAcademia = idsAcademia[0].fk_id_academia;
                    if (idAcademia != null) {
                        let academias = yield database_1.default.query(`SELECT * FROM academia WHERE id_academia=?`, idAcademia);
                        const academia = academias[0].nombre;
                        titular[0].academia = academia;
                    }
                    titular[0].num_empleado = numEmpleado;
                    titular[0].url_curriculum = curriculum;
                    res.json(titular);
                }
                else {
                    errores.push("No existe");
                    let respuesta = { errores };
                    res.json(respuesta);
                }
            }
            catch (e) {
                console.log("Error Metodo mostrar titulares");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarDocentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsDocentes = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 4);
                let docentes = [];
                for (let i = 0; i < idsDocentes.length; i++) {
                    const idDocente = idsDocentes[i].fk_id_usuario;
                    let docente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDocente);
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
                    docentes.push(docente[0]);
                }
                res.json(docentes);
            }
            catch (e) {
                console.log("Error Metodo mostrar docentes");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarDeysa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsDeysa = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 3);
                if (idsDeysa.length > 0) {
                    const idDeysa = idsDeysa[0].fk_id_usuario;
                    const deysa = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDeysa);
                    const numsEmpleado = yield database_1.default.query(`SELECT * FROM deysa WHERE fk_id_usuario=?`, idDeysa);
                    const numEmpleado = numsEmpleado[0].num_empleado;
                    deysa[0].num_empleado = numEmpleado;
                    res.json(deysa);
                }
                else {
                    errores.push("No existe");
                    let respuesta = { errores };
                    res.json(respuesta);
                }
            }
            catch (e) {
                console.log("Error Metodo mostrar deysa");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarAsesoresExternos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsAsesoresExternos = yield database_1.default.query(`SELECT fk_id_usuario FROM asesor_externo`);
                let asesoresExternos = [];
                for (let i = 0; i < idsAsesoresExternos.length; i++) {
                    const idAsesoresExterno = idsAsesoresExternos[i].fk_id_usuario;
                    let asesorExterno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAsesoresExterno);
                    const cartas = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idAsesoresExterno);
                    const carta = cartas[0].url_carta_compromiso;
                    let proyectos = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idAsesoresExterno);
                    const IdProyecto = proyectos[0].fk_id_proyecto;
                    let proyectos2 = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, IdProyecto);
                    let proyecto = proyectos2[0].nombre;
                    asesorExterno[0].proyecto = proyecto;
                    asesorExterno[0].url_carta_compromiso = carta;
                    asesoresExternos.push(asesorExterno[0]);
                }
                res.json(asesoresExternos);
            }
            catch (e) {
                console.log("Error Metodo mostrar asesores externos");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarTitulares(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsTitular = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 2);
                const idTitular = idsTitular[0].fk_id_usuario;
                const estadosDocente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idTitular);
                const estadoDocente = estadosDocente[0].estado_registro;
                if (estadoDocente === 'Registrado') {
                    const curriculums = yield database_1.default.query(`SELECT url_curriculum FROM docente WHERE fk_id_usuario=?`, idTitular);
                    const curriculum = curriculums[0].url_curriculum;
                    fileSystem_1.fSystem.eliminarArchivo(curriculum);
                }
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idTitular);
                res.json({ error: "Ninguno", msg: "Titulares eliminados" });
            }
            catch (e) {
                console.log("Error Metodo elimnar titulares");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarTitular(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idTitular = req.params.id;
                const estadosDocente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idTitular);
                const estadoDocente = estadosDocente[0].estado_registro;
                if (estadoDocente === 'Registrado') {
                    const curriculums = yield database_1.default.query(`SELECT url_curriculum FROM docente WHERE fk_id_usuario=?`, idTitular);
                    const curriculum = curriculums[0].url_curriculum;
                    fileSystem_1.fSystem.eliminarArchivo(curriculum);
                }
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idTitular);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error Metodo elimnar titular");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarDeysas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsDeysa = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 3);
                const idDeysa = idsDeysa[0].fk_id_usuario;
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idDeysa);
                res.json({ error: "Ninguno", msg: "Deysa eliminados" });
            }
            catch (e) {
                console.log("Error Metodo elimnar deysas");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarDeysa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idDeysa = req.params.id;
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idDeysa);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error Metodo elimnar deysa");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarDocentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsDocentes = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 4);
                for (let i = 0; i < idsDocentes.length; i++) {
                    const idDocente = idsDocentes[i].fk_id_usuario;
                    const estadosDocente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDocente);
                    const estadoDocente = estadosDocente[0].estado_registro;
                    if (estadoDocente === 'Registrado') {
                        const curriculums = yield database_1.default.query(`SELECT url_curriculum FROM docente WHERE fk_id_usuario=?`, idDocente);
                        const curriculum = curriculums[0].url_curriculum;
                        fileSystem_1.fSystem.eliminarArchivo(curriculum);
                    }
                    yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idDocente);
                }
                res.json({ error: "Ninguno", msg: "Docentes eliminados" });
            }
            catch (e) {
                console.log("Error Metodo eliminar docentes");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idDocente = req.params.id;
                const estadosDocente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idDocente);
                const estadoDocente = estadosDocente[0].estado_registro;
                if (estadoDocente === 'Registrado') {
                    const curriculums = yield database_1.default.query(`SELECT url_curriculum FROM docente WHERE fk_id_usuario=?`, idDocente);
                    const curriculum = curriculums[0].url_curriculum;
                    fileSystem_1.fSystem.eliminarArchivo(curriculum);
                }
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idDocente);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error Metodo eliminar docente");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarAsesoresExternos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsAsesoresExternos = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 7);
                for (let i = 0; i < idsAsesoresExternos.length; i++) {
                    const idAsesorExterno = idsAsesoresExternos[i].fk_id_usuario;
                    //Eliminamos los archivos antes
                    const curriculums = yield database_1.default.query(`SELECT url_curriculum FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                    if (curriculums[0].url_curriculum != null) {
                        const curriculum = curriculums[0].url_curriculum;
                        fileSystem_1.fSystem.eliminarArchivo(curriculum);
                    }
                    const cartas = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                    const carta = cartas[0].url_carta_compromiso;
                    fileSystem_1.fSystem.eliminarArchivo(carta);
                    yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idAsesorExterno);
                }
                res.json({ error: "Ninguno", msg: "Asesores externos eliminados" });
            }
            catch (e) {
                console.log("Error Metodo eliminar asesores externos");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarAsesorExterno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idAsesorExterno = req.params.id;
                const curriculums = yield database_1.default.query(`SELECT url_curriculum FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                if (curriculums[0].url_curriculum != null) {
                    const curriculum = curriculums[0].url_curriculum;
                    fileSystem_1.fSystem.eliminarArchivo(curriculum);
                }
                const cartas = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                const carta = cartas[0].url_carta_compromiso;
                fileSystem_1.fSystem.eliminarArchivo(carta);
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idAsesorExterno);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error Metodo eliminar asesores externo");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    rechazarAsesorExterno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idAsesorExterno = req.params.id;
                let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAsesorExterno);
                let nombreAsesor = asesor[0].nombre + " " + asesor[0].apellido_paterno + " " + asesor[0].apellido_materno;
                let proyectos = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                const idProyecto = proyectos[0].fk_id_proyecto;
                let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < alumnos.length; i++) {
                    let idAlumno = alumnos[i].fk_id_usuario;
                    let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                    let correo = alumno[0].correo;
                    nodemailer_1.email.enviarCorreo(correo, 'Asesor Externo Rechazado', `<p>El asesor externo:<strong> ${nombreAsesor} </strong> ha sido <strong>RECHAZADO</strong></p>`);
                }
                const curriculums = yield database_1.default.query(`SELECT url_curriculum FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                if (curriculums[0].url_curriculum != null) {
                    const curriculum = curriculums[0].url_curriculum;
                    fileSystem_1.fSystem.eliminarArchivo(curriculum);
                }
                const cartas = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                const carta = cartas[0].url_carta_compromiso;
                fileSystem_1.fSystem.eliminarArchivo(carta);
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idAsesorExterno);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo rechazar asesor externo");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    aceptarAsesorExterno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idAsesorExterno = req.params.id;
                let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAsesorExterno);
                let nombreAsesor = asesor[0].nombre + " " + asesor[0].apellido_paterno + " " + asesor[0].apellido_materno;
                let correoAsesor = asesor[0].correo;
                let proyectos = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                const idProyecto = proyectos[0].fk_id_proyecto;
                //Actualizamos su estado en usuario
                yield database_1.default.query('UPDATE usuario SET estado_registro=? WHERE id_usuario=?', ["Registrado", idAsesorExterno]);
                //Lo registramos en los distintas tablas
                yield database_1.default.query(`INSERT INTO protocolo_asesor (fk_id_proyecto,fk_id_usuario,estado,tipo_asesor) VALUES (?,?,?,?)`, [idProyecto, idAsesorExterno, 0, "Externo"]);
                yield database_1.default.query(`INSERT INTO reporte_asesor (fk_id_proyecto,fk_id_usuario,estado,tipo_asesor) VALUES (?,?,?,?)`, [idProyecto, idAsesorExterno, 0, "Externo"]);
                yield database_1.default.query(`INSERT INTO presentacion_asesor (fk_id_proyecto,fk_id_usuario,estado,tipo_asesor) VALUES (?,?,?,?)`, [idProyecto, idAsesorExterno, 0, "Externo"]);
                //Informamos a los alumnos
                let alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < alumnos.length; i++) {
                    let idAlumno = alumnos[i].fk_id_usuario;
                    let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                    let correo = alumno[0].correo;
                    nodemailer_1.email.enviarCorreo(correo, 'Asesor Externo Aceptado', `<p>El asesor externo:<strong> ${nombreAsesor} </strong> ha sido <strong>ACEPTADO</strong></p>`);
                }
                //Generamos una contraseña de 8 digitos
                let password = "";
                for (let i = 0; i < 16; i++) {
                    password += Math.floor(Math.random() * (9 - 0) + 1);
                }
                console.log(password);
                //La encriptamos
                let nuevaPassword = bcriptjs_1.bcriptjsConfig.encriptar(password);
                console.log(nuevaPassword);
                //Se la enviamos
                nodemailer_1.email.enviarCorreo(correoAsesor, 'Registro Aceptado', `<p>${nombreAsesor} ha sido aceptado(a) como asesor(a) externo(a). Ya puede ingresar al sistema con su correo y la siguiente contraseña:<strong>${nuevaPassword}</strong>. Se recomienda cambiar esta contraseña al ingresar al sistema.<a href="${variablesGlobales_1.VariablesGlobales.dominio}/login">Ir al sistema</a></p>`);
                yield database_1.default.query('UPDATE usuario SET password=? WHERE id_usuario=?', [nuevaPassword, idAsesorExterno]);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo aceptar asesor externo");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTALÑA FECHAS
    existeCalendario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let msgs = [];
            let errores = [];
            try {
                let calendarios = yield database_1.default.query(`SELECT * FROM calendario`);
                if (calendarios.length > 0) {
                    msgs.push("Si");
                }
                else {
                    msgs.push("No");
                }
                let respuesta = { msgs };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo limites entrega");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    crearCalendario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const existe = yield database_1.default.query(`SELECT * FROM calendario`);
                if (existe.length > 0) {
                    errores.push("Existe");
                }
                else {
                    yield database_1.default.query(`INSERT INTO calendario (id_calendario) VALUES (?)`, 1);
                    errores.push("Ninguno");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo crear calendario");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    registrarLimitesEntrega(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const existe = yield database_1.default.query(`SELECT * FROM calendario`);
                if (existe.length > 0) {
                    let e1 = req.body.entrega1;
                    let e2 = req.body.entrega2;
                    let e3 = req.body.entrega3;
                    if (e1 != undefined) {
                        yield database_1.default.query('UPDATE calendario SET entrega1=? WHERE id_calendario=?', [e1, 1]);
                    }
                    if (e2 != undefined) {
                        yield database_1.default.query('UPDATE calendario SET entrega2=? WHERE id_calendario=?', [e2, 1]);
                    }
                    if (e3 != undefined) {
                        yield database_1.default.query('UPDATE calendario SET entrega3=? WHERE id_calendario=?', [e3, 1]);
                    }
                    errores.push("Ninguno");
                }
                else {
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo limites entrega");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    registrarLimitesRevision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const existe = yield database_1.default.query(`SELECT * FROM calendario`);
                if (existe.length > 0) {
                    let r1 = req.body.revision1;
                    let r2 = req.body.revision2;
                    let r3 = req.body.revision3;
                    if (r1 != undefined) {
                        yield database_1.default.query('UPDATE calendario SET revision1=? WHERE id_calendario=?', [r1, 1]);
                    }
                    if (r2 != undefined) {
                        yield database_1.default.query('UPDATE calendario SET revision2=? WHERE id_calendario=?', [r2, 1]);
                    }
                    if (r3 != undefined) {
                        yield database_1.default.query('UPDATE calendario SET revision3=? WHERE id_calendario=?', [r3, 1]);
                    }
                    errores.push("Ninguno");
                }
                else {
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo limites revision");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarLimitesEntrega(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const fechas = yield database_1.default.query(`SELECT * FROM calendario`);
                res.json(fechas[0]);
            }
            catch (e) {
                console.log("Error metodo mostrar limites entrega");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarLimitesRevision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const fechas = yield database_1.default.query(`SELECT * FROM calendario`);
                res.json(fechas[0]);
            }
            catch (e) {
                console.log("Error metodo mostrar limites revision");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA CONFIGURACION----------------------------------------------------------------------------
    obtenerAdministrador(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idAdministrador = req.params.id;
                const administrador = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAdministrador);
                const numsEmpleado = yield database_1.default.query(`SELECT * FROM administrador WHERE fk_id_usuario=?`, idAdministrador);
                const numEmpleado = numsEmpleado[0].num_empleado;
                administrador[0].num_empleado = numEmpleado;
                res.json(administrador);
            }
            catch (e) {
                console.log("Error metodo obtener administrador");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    actualizarAdministrador(req, res) {
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
                const numEmpleados2 = yield database_1.default.query(`SELECT num_empleado FROM deysa WHERE num_empleado=?`, usuario.num_empleado);
                if (numEmpleados2.length > 0) {
                    errores.push("Num empleado registrado");
                }
                const numEmpleados3 = yield database_1.default.query(`SELECT num_empleado FROM administrador WHERE num_empleado=? AND fk_id_usuario!=?`, [usuario.num_empleado, idUsuario]);
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
                    yield database_1.default.query('UPDATE administrador SET num_empleado=? WHERE fk_id_usuario=?', [usuario.num_empleado, idUsuario]);
                    errores.push("Ninguno");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo actualizar administrador");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.administradorController = new AdministradorController();
