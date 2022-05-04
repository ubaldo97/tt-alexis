"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcriptjsConfig = void 0;
const multer = require('multer');
const bcript = require('bcryptjs');
class BcriptjsConfig {
    encriptar(password) {
        let salt = bcript.genSaltSync(10);
        let passwordEncriptada = bcript.hashSync(password, salt);
        return passwordEncriptada;
    }
    comparar(password, passwordBase) {
        return bcript.compareSync(password, passwordBase);
    }
}
exports.bcriptjsConfig = new BcriptjsConfig();
