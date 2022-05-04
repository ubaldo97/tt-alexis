"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fSystem = void 0;
const fs = require('fs');
const path = require('path');
class Fsystem {
    eliminarArchivo(nombre) {
        setTimeout(() => {
            var ruta = path.join(__dirname, `../public/archivos/${nombre}`);
            fs.unlink(ruta, function (err) {
                if (err) {
                    console.log("Error al eliminar archivo");
                    console.log(err);
                }
                else {
                    console.log("Archivo eliminado");
                }
            });
        }, 3000);
    }
}
exports.fSystem = new Fsystem();
