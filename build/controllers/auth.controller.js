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
exports.renewToken = exports.login = void 0;
const database_1 = require("../database/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../helpers/jwt");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Login: ', req.body);
        const { usr_usuario, usr_password } = req.body;
        const connetion = yield database_1.connect();
        try {
            const usuarioDB = yield connetion.request().query(`select * from Usuarios where usr_usuario = '${usr_usuario}'`);
            if (!usuarioDB.recordset[0]['usr_usuario']) {
                return res.status(404).json({
                    ok: false,
                    msg: 'usuario no encontrado'
                });
            }
            // Verificar contraseña
            const validPassword = bcryptjs_1.default.compareSync(usr_password, usuarioDB.recordset[0]['usr_password']);
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña no válida'
                });
            }
            // Generar el TOKEN - JWT
            const token = yield jwt_1.generarJWT(usuarioDB.recordset[0]['usr_usuario']);
            return res.status(200).json({
                ok: true,
                token
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
exports.login = login;
function renewToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const uid = req.uid;
        const connetion = yield database_1.connect();
        // Generar el TOKEN - JWT
        const token = yield jwt_1.generarJWT(uid);
        // Obtener el usuario por UID
        const usuario = yield connetion.request().query(`select * from Usuarios where usr_usuario = '${uid}'`);
        return res.json({
            ok: true,
            token,
            usuario
        });
    });
}
exports.renewToken = renewToken;
