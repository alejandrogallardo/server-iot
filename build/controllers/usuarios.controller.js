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
exports.crearUsuario = void 0;
const database_1 = require("../database/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function crearUsuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { usr_usuario, usr_nombre, usr_apellido, usr_password, usr_rango, usr_pin } = req.body;
        const connetion = yield database_1.connect();
        try {
            const salt = bcryptjs_1.default.genSaltSync();
            const enpassword = bcryptjs_1.default.hashSync(usr_password, salt);
            yield connetion.request().query(`insert into Usuarios values('${usr_usuario}', '${usr_nombre}', '${usr_apellido}', '${enpassword}',  CURRENT_TIMESTAMP, ${usr_rango}, ${usr_pin})`);
            return res.status(200).json({
                ok: true,
                message: 'Usuario Creado'
            });
        }
        catch (error) {
            return res.status(404).json({
                ok: false,
                message: error.message
            });
        }
        finally {
            connetion.close();
        }
    });
}
exports.crearUsuario = crearUsuario;
