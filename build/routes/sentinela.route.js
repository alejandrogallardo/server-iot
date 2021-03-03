"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const router = express_1.Router();
const sentinela_controller_1 = require("../controllers/sentinela.controller");
router.route('/')
    .get(express_1.default.json(), sentinela_controller_1.getSentinelas)
    .post(express_1.default.json(), sentinela_controller_1.crearRecord);
router.route('/subir')
    .post(express_1.default.raw({
    inflate: true,
    limit: "100mb",
    type: "application/octet-stream"
}), sentinela_controller_1.uploadFoto);
//.post(uploadFoto)
router.route('/:id')
    .get(express_1.default.json(), sentinela_controller_1.getSentinela);
exports.default = router;
