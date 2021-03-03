"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const router = express_1.Router();
const auth_controller_1 = require("../controllers/auth.controller");
router.route('/')
    .post(auth_controller_1.login);
router.route('/renew')
    .get(validar_jwt_1.validarJWT, auth_controller_1.renewToken);
exports.default = router;
