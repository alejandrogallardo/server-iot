import Server from './server/server';
import  router from './routes/router';
import SentinelaRoutes from './routes/sentinela.route';
import UsuariosRoutes from './routes/usuarios.routes';
import AuthRoutes from './routes/auth.routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from "express";

const server=Server.instance;

server.app.use(bodyParser.urlencoded({extended:false}));
server.app.use(bodyParser.json());
server.app.use(bodyParser.text({ type: 'application/octet-stream' }));
// server.app.use(express.static())
server.app.use(cors({origin:'*',credentials:true}));
server.app.use('/api/sentinelas', SentinelaRoutes)
server.app.use('/api/usuarios', UsuariosRoutes)
server.app.use('/api/login', AuthRoutes)

server.start(()=>{
    console.log(`Servidor listo en puerto ${server.port}`)
})
