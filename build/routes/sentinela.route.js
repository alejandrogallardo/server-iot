"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../helpers/multer"));
const router = express_1.Router();
const sentinela_controller_1 = require("../controllers/sentinela.controller");
router.route('/')
    .get(sentinela_controller_1.getSentinelas)
    .post(sentinela_controller_1.crearRecord);
router.route('/subir')
    .post(multer_1.default.single('image'), sentinela_controller_1.uploadFoto);
//.post(uploadFoto)
router.route('/:id')
    .get(sentinela_controller_1.getSentinela);
exports.default = router;
