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
exports.asesorExternoController = void 0;
const database_1 = __importDefault(require("../database"));
const Usuario_1 = require("../models/Usuario");
const bcriptjs_1 = require("../lib/bcriptjs");
const fileSystem_1 = require("../lib/fileSystem");
class AsesorExternoController {
    //Pestaña configuracion----------------------------------------------------------------------------
    obtenerAsesorExterno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idUsuario = req.params.id;
                const asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                res.json(asesor);
            }
            catch (e) {
                console.log("Error metodo obtener asesor");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    actualizarAsesorExterno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let usuario = new Usuario_1.Usuario();
                const idUsuario = req.params.id;
                usuario.nombre = req.body.nombre;
                usuario.apellido_paterno = req.body.apellido_paterno;
                usuario.apellido_materno = req.body.apellido_materno;
                usuario.correo = req.body.correo;
                usuario.password = bcriptjs_1.bcriptjsConfig.encriptar(req.body.password);
                usuario.url_curriculum = req.file.filename;
                //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=? AND id_usuario!=?`, [usuario.correo, idUsuario]);
                if (correoRegistrados.length > 0) {
                    errores.push("Correo registrado");
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
                    const asesorExterno = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idUsuario);
                    const curriculum = asesorExterno[0].url_curriculum;
                    if (curriculum != null) {
                        fileSystem_1.fSystem.eliminarArchivo(curriculum);
                    }
                    yield database_1.default.query('UPDATE asesor_externo SET url_curriculum=? WHERE fk_id_usuario=?', [usuario.url_curriculum, idUsuario]);
                    errores.push("Ninguno");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo actualizar asesor externo");
                errores.push("Consultas");
                let respuesta = { errores };
                fileSystem_1.fSystem.eliminarArchivo(req.file.filename);
                res.json(respuesta);
            }
        });
    }
}
exports.asesorExternoController = new AsesorExternoController();
