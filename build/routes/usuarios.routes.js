"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const usuarios_controller_1 = require("../controllers/usuarios.controller");
router.route('/')
    .post(usuarios_controller_1.crearUsuario);
exports.default = router;
