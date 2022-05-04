"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const administradorRoutes_1 = __importDefault(require("./routes/administradorRoutes"));
const alumnoRoutes_1 = __importDefault(require("./routes/alumnoRoutes"));
const directorRoutes_1 = __importDefault(require("./routes/directorRoutes"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const docenteRoutes_1 = __importDefault(require("./routes/docenteRoutes"));
const deysaRoutes_1 = __importDefault(require("./routes/deysaRoutes"));
const titularRoutes_1 = __importDefault(require("./routes/titularRoutes"));
const asesorExternoRoutes_1 = __importDefault(require("./routes/asesorExternoRoutes"));
const compartidasRoutes_1 = __importDefault(require("./routes/compartidasRoutes"));
const asesorRoutes_1 = __importDefault(require("./routes/asesorRoutes"));
const revisorRoutes_1 = __importDefault(require("./routes/revisorRoutes"));
const path_1 = __importDefault(require("path"));
class Servidor {
    constructor() {
        this.app = (0, express_1.default)();
        this.configuracion();
        this.routes();
    }
    configuracion() {
        this.app.set('port', process.env.PORT || 3000);
        //   this.app.use(morgan('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.use('/api/tt/usuario', usuarioRoutes_1.default);
        this.app.use('/api/tt/administrador', administradorRoutes_1.default);
        this.app.use('/api/tt/titular', titularRoutes_1.default);
        this.app.use('/api/tt/deysa', deysaRoutes_1.default);
        this.app.use('/api/tt/docente', docenteRoutes_1.default);
        this.app.use('/api/tt/alumno', alumnoRoutes_1.default);
        this.app.use('/api/tt/director', directorRoutes_1.default);
        this.app.use('/api/tt/asesor-externo', asesorExternoRoutes_1.default);
        this.app.use('/api/tt/asesor', asesorRoutes_1.default);
        this.app.use('/api/tt/revisor', revisorRoutes_1.default);
        this.app.use('/api/tt/compartidas', compartidasRoutes_1.default);
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        this.app.get('*', (req, res) => {
            res.sendFile(path_1.default.resolve(__dirname, 'index.html'));
        });
    }
    comenzarServidor() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Servidor en puerto", this.app.get('port'));
        });
    }
}
const servidor = new Servidor();
servidor.comenzarServidor();
