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
exports.docenteController = void 0;
const database_1 = __importDefault(require("../database"));
const Usuario_1 = require("../models/Usuario");
const fileSystem_1 = require("../lib/fileSystem");
const bcriptjs_1 = require("../lib/bcriptjs");
class DocenteController {
    //Pestaña proyectos
    mostrarProyectosRevisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let idAsesor = req.params.id;
            let proyectos = [];
            try {
                const idsProyectos = yield database_1.default.query(`SELECT fk_id_proyecto FROM protocolo_revisor WHERE fk_id_usuario=?`, idAsesor);
                for (let i = 0; i < idsProyectos.length; i++) {
                    let alumnos = [];
                    const idProyecto = idsProyectos[i].fk_id_proyecto;
                    const proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                    const idsAlumnos = yield database_1.default.query(`SELECT fk_id_usuario FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                    for (let i = 0; i < idsAlumnos.length; i++) {
                        const idAlumno = idsAlumnos[i].fk_id_usuario;
                        const alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                        alumnos.push(alumno[0]);
                    }
                    proyecto[0].alumnos = alumnos.length;
                    proyectos.push(proyecto[0]);
                }
                res.json(proyectos);
            }
            catch (e) {
                console.log("Error metodo mostrar proyectos jurado");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //PESTAÑA CONFIGURACION----------------------------------------------------------------------------
    obtenerDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idUsuario = req.params.id;
                const docente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                const docentes = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idUsuario);
                const numEmpleado = docentes[0].num_empleado;
                const idAcademia = docentes[0].fk_id_academia;
                const academias = yield database_1.default.query(`SELECT * FROM academia WHERE id_academia=?`, idAcademia);
                const academia = academias[0].nombre;
                docente[0].academia = academia;
                docente[0].num_empleado = numEmpleado;
                res.json(docente);
            }
            catch (e) {
                console.log("Error metodo obtener docente");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    actualizarDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let usuario = new Usuario_1.Usuario();
                const idUsuario = req.params.id;
                const existe = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                if (existe.length > 0) {
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
                        const docentes = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idUsuario);
                        const curriculum = docentes[0].url_curriculum;
                        fileSystem_1.fSystem.eliminarArchivo(curriculum);
                        const idsAcademias = yield database_1.default.query(`SELECT id_academia FROM academia WHERE nombre=?`, usuario.academia);
                        const idAcademia = idsAcademias[0].id_academia;
                        yield database_1.default.query('UPDATE docente SET fk_id_academia=?, num_empleado=?, url_curriculum=? WHERE fk_id_usuario=?', [idAcademia, usuario.num_empleado, usuario.url_curriculum, idUsuario]);
                        errores.push("Ninguno");
                    }
                }
                else {
                    errores.push("No existe");
                }
                let respuesta = { errores };
                console.log(respuesta);
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo actualizar docente");
                errores.push("Consultas");
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.docenteController = new DocenteController();
