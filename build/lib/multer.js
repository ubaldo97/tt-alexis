"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v4');
class MulterConfig {
    config() {
        //Middlewares (MULTER)
        const storage = multer.diskStorage({
            destination: path.join(__dirname, '../public/archivos'),
            filename: (req, file, cb) => {
                cb(null, uuid() + path.extname(file.originalname).toLowerCase());
            }
        });
        //Tenemos que hacerlo antes de las rutas ya que es un middleware
        const upload = (multer({
            storage: storage,
            dest: path.join(__dirname, '../public/archivos'),
            fileFilter: (req, file, cb) => {
                const fileTypes = /pdf|docx/;
                //  const mimetype=fileTypes.test(file.mimetype);
                const extname = fileTypes.test(path.extname(file.originalname));
                if (extname) {
                    return cb(null, true);
                }
                cb("Error: Archivo invalido");
            }
        }).single('archivo')); //Le pasamos singles porque solo queremos subir 1, y le pasamos el name del input file
        return upload;
    }
}
exports.multerConfig = new MulterConfig().config();
