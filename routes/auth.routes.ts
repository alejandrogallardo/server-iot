import { Router } from 'express';
import {validarJWT} from '../middlewares/validar-jwt'

const router = Router()

import { login, renewToken } from '../controllers/auth.controller'

router.route('/')
    .post(login)
router.route('/renew')
    .get(validarJWT, renewToken)
export default router
