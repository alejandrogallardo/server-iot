"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server/server"));
const sentinela_route_1 = __importDefault(require("./routes/sentinela.route"));
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const server = server_1.default.instance;
server.app.use(body_parser_1.default.urlencoded({ extended: false }));
server.app.use(body_parser_1.default.json());
server.app.use(body_parser_1.default.text({ type: 'application/octet-stream' }));
// server.app.use(express.static())
server.app.use(cors_1.default({ origin: '*', credentials: true }));
server.app.use('/api/sentinelas', sentinela_route_1.default);
server.app.use('/api/usuarios', usuarios_routes_1.default);
server.app.use('/api/login', auth_routes_1.default);
server.start(() => {
    console.log(`Servidor listo en puerto ${server.port}`);
});
