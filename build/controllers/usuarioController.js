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
exports.usuarioController = void 0;
const database_1 = __importDefault(require("../database"));
const nodemailer_1 = require("../lib/nodemailer");
const Usuario_1 = require("../models/Usuario");
const fileSystem_1 = require("../lib/fileSystem");
const bcriptjs_1 = require("../lib/bcriptjs");
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
class UsuarioController {
    iniciarSesion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let correo = req.body.correo;
                let password = req.body.password;
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, correo);
                let estadoUsuario;
                if (correoRegistrados.length > 0) {
                    estadoUsuario = correoRegistrados[0].estado_registro;
                    //Si existe el correo y esta registrado
                    if (estadoUsuario == 'Registrado') {
                        const idUsuario = correoRegistrados[0].id_usuario;
                        const passwords = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                        const passwordBase = passwords[0].password; //Contraseña de la base de datos
                        if (!bcriptjs_1.bcriptjsConfig.comparar(password, passwordBase)) {
                            errores.push("Password incorrecta");
                            let respuesta = { errores };
                            res.json(respuesta);
                        }
                        else {
                            const idsTipo = yield database_1.default.query(`SELECT * FROM tipo_usuario WHERE fk_id_usuario=?`, idUsuario);
                            const idTipo = idsTipo[0].fk_id_tipo;
                            const nombresTipo = yield database_1.default.query(`SELECT * FROM tipo WHERE id_tipo=?`, idTipo);
                            const nombreTipo = nombresTipo[0].tipo;
                            //Crear TOKEN
                            const usuario = new Usuario_1.Usuario();
                            usuario.id_usuario = idUsuario;
                            usuario.correo = correo;
                            usuario.tipo = nombreTipo;
                            if (nombreTipo === "Alumno") {
                                const alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_usuario=?`, idUsuario);
                                const idProyecto = alumnos[0].fk_id_proyecto;
                                usuario.id_proyecto = idProyecto;
                            }
                            if (nombreTipo === "Asesor externo") {
                                const asesores = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idUsuario);
                                const idProyecto = asesores[0].fk_id_proyecto;
                                usuario.id_proyecto = idProyecto;
                            }
                            var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }); //usuario, clave, 4 horas de expiracion
                            errores.push("Ninguno");
                            res.json({ errores: errores, token: token, usuarioToken: usuario });
                        }
                    }
                    else {
                        errores.push("Usuario no registrado");
                        let respuesta = { errores };
                        res.json(respuesta);
                    }
                }
                else {
                    errores.push("Usuario no registrado");
                    let respuesta = { errores };
                    res.json(respuesta);
                }
            }
            catch (e) {
                console.log("Error metodo iniciar sesion");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //----------------------------------------------------------------------------------------------
    recuperarPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let correo = req.body.correo;
                let errores = [];
                let banderaCorreo = false;
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, correo);
                if (correoRegistrados.length > 0) {
                    banderaCorreo = false;
                }
                else {
                    banderaCorreo = true;
                    errores.push("Correo no registrado");
                }
                if (!banderaCorreo) {
                    const passwordsUsuario = yield database_1.default.query(`SELECT password FROM usuario WHERE correo=?`, correo);
                    const password = passwordsUsuario[0].password;
                    nodemailer_1.email.enviarCorreo(correo, 'Recuperación de contraseña', `<p>Tu Contraseña es:<strong style="color:red">${password}</strong></p>`);
                    errores.push("Ninguno");
                }
                else {
                    console.log("Correo no registrado");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //--------------------------------------------
    existeAdministrador(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsAdministradores = yield database_1.default.query(`SELECT * FROM tipo_usuario WHERE fk_id_tipo=?`, 1);
                res.json(idsAdministradores);
            }
            catch (e) {
                console.log("Error Metodo mostrar docentes registrados");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    registrarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let usuario = new Usuario_1.Usuario();
                usuario.tipo = req.body.tipo;
                usuario.nombre = req.body.nombre;
                usuario.apellido_paterno = req.body.apellido_paterno;
                usuario.apellido_materno = req.body.apellido_materno;
                usuario.correo = req.body.correo;
                usuario.password = bcriptjs_1.bcriptjsConfig.encriptar(req.body.password);
                usuario.estado_registro = req.body.estado_registro;
                usuario.url_curriculum = "";
                //INSERTAMOS LOS DATOS FALTANTES SEGUN EL USAURIO
                if (usuario.tipo === 'Alumno') {
                    usuario.boleta = req.body.boleta;
                    usuario.carrera = req.body.carrera;
                }
                if (usuario.tipo === 'Docente' || usuario.tipo === 'Deysa' || usuario.tipo === 'Titular' || usuario.tipo === 'Administrador') {
                    usuario.num_empleado = req.body.num_empleado;
                }
                if (usuario.tipo === 'Docente' || usuario.tipo === 'Titular') {
                    usuario.url_curriculum = req.file.filename;
                    usuario.academia = req.body.academia;
                }
                //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, usuario.correo);
                if (usuario.tipo == 'Administrador') {
                }
                else {
                    if (correoRegistrados.length > 0) {
                        const estadoUsuario = correoRegistrados[0].estado_registro;
                        const idUsuario = correoRegistrados[0].id_usuario;
                        const idsTipo = yield database_1.default.query(`SELECT * FROM tipo_usuario WHERE fk_id_usuario=?`, idUsuario);
                        const idTipo = idsTipo[0].fk_id_tipo;
                        const nombresTipo = yield database_1.default.query(`SELECT * FROM tipo WHERE id_tipo=?`, idTipo);
                        const nombreTipo = nombresTipo[0].tipo;
                        if (estadoUsuario === 'Registrado') {
                            errores.push("Usuario registrado");
                        }
                        if (nombreTipo != usuario.tipo) {
                            errores.push("Tipo distinto");
                        }
                    }
                    else {
                        errores.push("Correo no preregistrado");
                    }
                }
                //VALIDAMOS los campos que no deben estar registrados para cada usuario
                if (usuario.tipo === 'Titular' || usuario.tipo === 'Docente' || usuario.tipo === 'Deysa' || usuario.tipo === 'Administrador') {
                    const numEmpleados = yield database_1.default.query(`SELECT num_empleado FROM docente WHERE num_empleado=?`, usuario.num_empleado);
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
                }
                else if (usuario.tipo === 'Alumno') {
                    const boleta = yield database_1.default.query(`SELECT boleta FROM alumno WHERE boleta=?`, usuario.boleta);
                    if (boleta.length > 0) {
                        errores.push("Boleta registrada");
                    }
                }
                //SI HUBO ERRORES DE CAMPOS REGITRADOS
                if (errores.length > 0) {
                    let respuesta = { errores };
                    console.log("Hay campos invalidos en el servidor");
                    if (usuario.tipo === 'Titular' || usuario.tipo === 'Docente') {
                        fileSystem_1.fSystem.eliminarArchivo(usuario.url_curriculum);
                    }
                    res.json(respuesta);
                }
                else {
                    //INSERTAMOS DATOS---------------------------------------------
                    console.log("No hay errores en la respuesta");
                    let idsUsuarios;
                    let idUsuario;
                    if (usuario.tipo == "Administrador") {
                    }
                    else {
                        idsUsuarios = yield database_1.default.query(`SELECT id_usuario FROM usuario WHERE correo=?`, usuario.correo);
                        idUsuario = idsUsuarios[0].id_usuario;
                    }
                    yield database_1.default.query('UPDATE usuario SET nombre=?, apellido_paterno=?, apellido_materno=?, password=?, estado_registro=? WHERE correo=?', [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.password, usuario.estado_registro, usuario.correo]);
                    if (usuario.tipo === 'Titular' || usuario.tipo === 'Docente') {
                        const idsAcademias = yield database_1.default.query(`SELECT id_academia FROM academia WHERE nombre=?`, usuario.academia);
                        const idAcademia = idsAcademias[0].id_academia;
                        yield database_1.default.query('UPDATE docente SET num_empleado=?,fk_id_academia=?, url_curriculum=? WHERE fk_id_usuario=?', [usuario.num_empleado, idAcademia, usuario.url_curriculum, idUsuario]);
                    }
                    else if (usuario.tipo === 'Deysa') {
                        yield database_1.default.query('UPDATE deysa SET num_empleado=? WHERE fk_id_usuario=?', [usuario.num_empleado, idUsuario]);
                    }
                    else if (usuario.tipo === 'Administrador') {
                        idUsuario = uuid();
                        yield database_1.default.query(`INSERT INTO usuario (id_usuario,correo,nombre,apellido_paterno,apellido_materno,password,estado_registro) VALUES (?,?,?,?,?,?,?)`, [idUsuario, usuario.correo, usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.password, usuario.estado_registro]);
                        yield database_1.default.query(`INSERT INTO tipo_usuario (fk_id_usuario,fk_id_tipo) VALUES (?,?)`, [idUsuario, 1]);
                        yield database_1.default.query(`INSERT INTO administrador (fk_id_usuario,num_empleado) VALUES (?,?)`, [idUsuario, usuario.num_empleado]);
                    }
                    else if (usuario.tipo === 'Alumno') {
                        const idsCarreras = yield database_1.default.query(`SELECT id_carrera FROM carrera WHERE nombre=?`, usuario.carrera);
                        const idCarrera = idsCarreras[0].id_carrera;
                        yield database_1.default.query('UPDATE alumno SET boleta=?, fk_id_carrera=? WHERE fk_id_usuario=?', [usuario.boleta, idCarrera, idUsuario]);
                    }
                    //ENVIAMOS RESPUESTA
                    let errores = [];
                    errores.push("Ninguno");
                    let respuesta = { errores };
                    res.json(respuesta);
                }
            }
            catch (e) {
                console.log("Error Metodo registrar usuario");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.usuarioController = new UsuarioController();
