import { Router } from 'express';

const router = Router()

import { crearUsuario } from '../controllers/usuarios.controller'

router.route('/')
    .post(crearUsuario)

export default router
