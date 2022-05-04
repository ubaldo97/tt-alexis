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
exports.compartidasController = void 0;
const database_1 = __importDefault(require("../database"));
class CompartidasController {
    //Pestaña proyectos--------------------------------------------------------------------------------
    obtenerEstadoProcesoAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let estadoProceso;
            try {
                let idProyecto = req.params.id;
                const estadosProcesos = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                estadoProceso = estadosProcesos[0].estado_proceso;
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
    mostrarProyectosDirector(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let idAsesor = req.params.id;
            let proyectos = [];
            try {
                const idsProyectos = yield database_1.default.query(`SELECT id_proyecto FROM proyecto WHERE fk_id_director=?`, idAsesor);
                for (let i = 0; i < idsProyectos.length; i++) {
                    let alumnos = [];
                    const idProyecto = idsProyectos[i].id_proyecto;
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
                console.log("Error metodo mostrar proyectos director");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarProyectosAsesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let idAsesor = req.params.id;
            let proyectos = [];
            try {
                const idsProyectos = yield database_1.default.query(`SELECT fk_id_proyecto FROM protocolo_asesor WHERE fk_id_usuario=?`, idAsesor);
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
                console.log("Error metodo mostrar proyectos asesor");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarProyectosJurado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let idAsesor = req.params.id;
            let proyectos = [];
            try {
                const idsProyectos = yield database_1.default.query(`SELECT fk_id_proyecto FROM proyecto_jurado WHERE fk_id_usuario=?`, idAsesor);
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
    mostrarProyectos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsProyectos = yield database_1.default.query(`SELECT id_proyecto FROM proyecto`);
                let proyectos = [];
                for (let i = 0; i < idsProyectos.length; i++) {
                    let alumnos = [];
                    const idProyecto = idsProyectos[i].id_proyecto;
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
                console.log("Error Metodo mostrar asesores externos");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarAlumnos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsAlumnos = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 5);
                let alumnos = [];
                for (let i = 0; i < idsAlumnos.length; i++) {
                    const idAlumno = idsAlumnos[i].fk_id_usuario;
                    let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                    //Buscamos los demas atributos
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
                    if (alumno.length > 0) {
                        alumnos.push(alumno[0]);
                    }
                }
                res.json(alumnos);
            }
            catch (e) {
                console.log("Error Metodo mostrar alumnos");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerInfoProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                res.json(proyecto);
            }
            catch (e) {
                console.log("Error metodo obtener proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerAlumnosProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let listaAlumnos = [];
            try {
                const idProyecto = req.params.id;
                const alumnos = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_proyecto=?`, idProyecto);
                //Extraemos la infromacion de cada alumno
                for (let i = 0; i < alumnos.length; i++) {
                    const idAlumno = alumnos[i].fk_id_usuario;
                    let alumno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAlumno);
                    //Buscamos los demas atributos
                    const boletas = yield database_1.default.query(`SELECT * FROM alumno WHERE fk_id_usuario=?`, idAlumno);
                    const boleta = boletas[0].boleta;
                    alumno[0].boleta = boleta;
                    const idsCarrera = yield database_1.default.query(`SELECT fk_id_carrera FROM alumno WHERE fk_id_usuario=?`, idAlumno);
                    let idCarrera = idsCarrera[0].fk_id_carrera;
                    let carreras = yield database_1.default.query(`SELECT * FROM carrera WHERE id_carrera=?`, idCarrera);
                    const carrera = carreras[0].nombre;
                    alumno[0].carrera = carrera;
                    if (alumno.length > 0) {
                        listaAlumnos.push(alumno[0]);
                    }
                }
                res.json(listaAlumnos);
            }
            catch (e) {
                console.log("Error metodo obtener alumnos proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerAsesoresProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let listaAsesores = [];
            try {
                const idProyecto = req.params.id;
                const asesoresInternos = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=? AND tipo_asesor=?`, [idProyecto, "Interno"]);
                //const asesoresExternos = await db.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=? AND tipo_asesor=?`, [idProyecto,"Externo"]);
                const asesoresExternos2 = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_proyecto=?`, [idProyecto]);
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
                for (let i = 0; i < asesoresExternos2.length; i++) {
                    const idAsesorExterno = asesoresExternos2[i].fk_id_usuario;
                    let asesorExterno = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idAsesorExterno);
                    asesorExterno[0].tipo_asesor = "Externo";
                    const curriculums = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idAsesorExterno);
                    const curriculum = curriculums[0].url_curriculum;
                    asesorExterno[0].url_curriculum = curriculum;
                    listaAsesores.push(asesorExterno[0]);
                }
                res.json(listaAsesores);
            }
            catch (e) {
                console.log("Error metodo obtener asesores proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerRevisoresProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let listaRevisores = [];
            try {
                const idProyecto = req.params.id;
                const revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                //Datos Internos
                for (let i = 0; i < revisores.length; i++) {
                    const idRevisor = revisores[i].fk_id_usuario;
                    let revisor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idRevisor);
                    const curriculums = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idRevisor);
                    const curriculum = curriculums[0].url_curriculum;
                    const numsEmpleado = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idRevisor);
                    const numEmpleado = numsEmpleado[0].num_empleado;
                    const idsAcademia = yield database_1.default.query(`SELECT fk_id_academia FROM docente WHERE fk_id_usuario=?`, idRevisor);
                    let idAcademia = idsAcademia[0].fk_id_academia;
                    if (idAcademia != null) {
                        let academias = yield database_1.default.query(`SELECT * FROM academia WHERE id_academia=?`, idAcademia);
                        const academia = academias[0].nombre;
                        revisor[0].academia = academia;
                    }
                    revisor[0].num_empleado = numEmpleado;
                    revisor[0].url_curriculum = curriculum;
                    listaRevisores.push(revisor[0]);
                }
                res.json(listaRevisores);
            }
            catch (e) {
                console.log("Error metodo obtener revisores proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerJuradoProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let listaJurado = [];
            try {
                const idProyecto = req.params.id;
                const jurado = yield database_1.default.query(`SELECT * FROM proyecto_jurado WHERE fk_id_proyecto=?`, idProyecto);
                //Datos Internos
                for (let i = 0; i < jurado.length; i++) {
                    const idMiembro = jurado[i].fk_id_usuario;
                    let miembro = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idMiembro);
                    miembro[0].rol = jurado[i].rol;
                    const asesoresExternos = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idMiembro);
                    if (asesoresExternos.length > 0) {
                        const curriculums = yield database_1.default.query(`SELECT * FROM asesor_externo WHERE fk_id_usuario=?`, idMiembro);
                        if (curriculums[0].url_curriculum != null) {
                            const curriculum = curriculums[0].url_curriculum;
                            miembro[0].url_curriculum = curriculum;
                        }
                    }
                    else {
                        const curriculums = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idMiembro);
                        const curriculum = curriculums[0].url_curriculum;
                        const numsEmpleado = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idMiembro);
                        const numEmpleado = numsEmpleado[0].num_empleado;
                        const idsAcademia = yield database_1.default.query(`SELECT fk_id_academia FROM docente WHERE fk_id_usuario=?`, idMiembro);
                        let idAcademia = idsAcademia[0].fk_id_academia;
                        if (idAcademia != null) {
                            let academias = yield database_1.default.query(`SELECT * FROM academia WHERE id_academia=?`, idAcademia);
                            const academia = academias[0].nombre;
                            miembro[0].academia = academia;
                        }
                        miembro[0].num_empleado = numEmpleado;
                        miembro[0].url_curriculum = curriculum;
                    }
                    listaJurado.push(miembro[0]);
                }
                res.json(listaJurado);
            }
            catch (e) {
                console.log("Error metodo obtener jurado proyecto");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarDocentesRegistrados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsDocentes = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 4);
                let docentes = [];
                for (let i = 0; i < idsDocentes.length; i++) {
                    const idDocente = idsDocentes[i].fk_id_usuario;
                    let docente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=? AND estado_registro=?`, [idDocente, "Registrado"]);
                    if (docente.length != 0 && docente[0].estado_registro === 'Registrado') {
                        const curriculums = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idDocente);
                        const curriculum = curriculums[0].url_curriculum;
                        const numsEmpleado = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idDocente);
                        const numEmpleado = numsEmpleado[0].num_empleado;
                        const idsAcademia = yield database_1.default.query(`SELECT fk_id_academia FROM docente WHERE fk_id_usuario=?`, idDocente);
                        let idAcademia = idsAcademia[0].fk_id_academia;
                        if (idAcademia > 0) {
                            let academias = yield database_1.default.query(`SELECT * FROM academia WHERE id_academia=?`, idAcademia);
                            const academia = academias[0].nombre;
                            docente[0].academia = academia;
                        }
                        docente[0].num_empleado = numEmpleado;
                        docente[0].url_curriculum = curriculum;
                        docentes.push(docente[0]);
                    }
                }
                res.json(docentes);
            }
            catch (e) {
                console.log("Error Metodo mostrar docentes registrados");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    mostrarDocentesRegistradosSistemas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idsDocentes = yield database_1.default.query(`SELECT fk_id_usuario FROM tipo_usuario WHERE fk_id_tipo=?`, 4);
                let docentes = [];
                for (let i = 0; i < idsDocentes.length; i++) {
                    const idDocente = idsDocentes[i].fk_id_usuario;
                    let docente = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=? AND estado_registro=?`, [idDocente, "Registrado"]);
                    if (docente.length != 0 && docente[0].estado_registro === 'Registrado') {
                        const curriculums = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idDocente);
                        const curriculum = curriculums[0].url_curriculum;
                        const numsEmpleado = yield database_1.default.query(`SELECT * FROM docente WHERE fk_id_usuario=?`, idDocente);
                        const numEmpleado = numsEmpleado[0].num_empleado;
                        const idsAcademia = yield database_1.default.query(`SELECT fk_id_academia FROM docente WHERE fk_id_usuario=?`, idDocente);
                        let idAcademia = idsAcademia[0].fk_id_academia;
                        if (idAcademia > 0) {
                            let academias = yield database_1.default.query(`SELECT * FROM academia WHERE id_academia=?`, idAcademia);
                            const academia = academias[0].nombre;
                            docente[0].academia = academia;
                        }
                        docente[0].num_empleado = numEmpleado;
                        docente[0].url_curriculum = curriculum;
                        if (docente[0].academia == "Sistemas Computacionales") {
                            docentes.push(docente[0]);
                            console.log("hola");
                        }
                    }
                }
                console.log(docentes);
                res.json(docentes);
            }
            catch (e) {
                console.log("Error Metodo mostrar docentes registrados");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerFechas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const fechas = yield database_1.default.query(`SELECT * FROM calendario WHERE id_calendario=?`, 1);
                res.json(fechas);
            }
            catch (e) {
                console.log("Error metodo obtener fechas");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerInfoProyectoSolicitud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
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
                res.json(proyecto);
            }
            catch (e) {
                console.log("Error metodo obtener proyecto solicitud");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerInfoProyectoProtocolo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                const asesores = yield database_1.default.query(`SELECT * FROM protocolo_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesores.length; i++) {
                    let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, asesores[i].fk_id_usuario);
                    let nombre = `${asesor[0].nombre} ${asesor[0].apellido_paterno} ${asesor[0].apellido_materno}`;
                    asesores[i].nombre = nombre;
                }
                const revisores = yield database_1.default.query(`SELECT * FROM protocolo_revisor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < revisores.length; i++) {
                    let revisor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, revisores[i].fk_id_usuario);
                    let nombre = `${revisor[0].nombre} ${revisor[0].apellido_paterno} ${revisor[0].apellido_materno}`;
                    revisores[i].nombre = nombre;
                }
                proyecto[0].asesores = asesores;
                proyecto[0].revisores = revisores;
                res.json(proyecto);
            }
            catch (e) {
                console.log("Error metodo obtener proyecto protocolo");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerInfoProyectoReporte(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                const asesores = yield database_1.default.query(`SELECT * FROM reporte_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesores.length; i++) {
                    let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, asesores[i].fk_id_usuario);
                    let nombre = `${asesor[0].nombre} ${asesor[0].apellido_paterno} ${asesor[0].apellido_materno}`;
                    asesores[i].nombre = nombre;
                }
                const jurado = yield database_1.default.query(`SELECT * FROM proyecto_jurado WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < jurado.length; i++) {
                    let miembro = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, jurado[i].fk_id_usuario);
                    let nombre = `${miembro[0].nombre} ${miembro[0].apellido_paterno} ${miembro[0].apellido_materno}`;
                    jurado[i].nombre = nombre;
                }
                proyecto[0].asesores = asesores;
                proyecto[0].jurado = jurado;
                res.json(proyecto);
            }
            catch (e) {
                console.log("Error metodo obtener proyecto reporte");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerInfoProyectoPresentacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idProyecto = req.params.id;
                const proyecto = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                const asesores = yield database_1.default.query(`SELECT * FROM presentacion_asesor WHERE fk_id_proyecto=?`, idProyecto);
                for (let i = 0; i < asesores.length; i++) {
                    let asesor = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, asesores[i].fk_id_usuario);
                    let nombre = `${asesor[0].nombre} ${asesor[0].apellido_paterno} ${asesor[0].apellido_materno}`;
                    asesores[i].nombre = nombre;
                }
                proyecto[0].asesores = asesores;
                res.json(proyecto);
            }
            catch (e) {
                console.log("Error metodo obtener proyecto presentacion");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    existeUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                console.log("Validó usuario");
                const idUsuario = req.params.id;
                const existe = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                if (existe.length > 0) {
                    errores.push("Ninguno");
                }
                else {
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo existe usuario");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    existeProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                console.log("Validó proyecto");
                const idProyecto = req.params.id;
                const existe = yield database_1.default.query(`SELECT * FROM proyecto WHERE id_proyecto=?`, idProyecto);
                if (existe.length > 0) {
                    errores.push("Ninguno");
                }
                else {
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo existe usuario");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.compartidasController = new CompartidasController();
