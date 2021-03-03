import { Router } from 'express';
import upload from '../helpers/multer';

const router = Router()

import { getSentinelas, getSentinela, crearRecord, uploadFoto } from '../controllers/sentinela.controller'

router.route('/')
    .get(getSentinelas)
    .post(crearRecord)

router.route('/subir')
    .post(upload.single('image'), uploadFoto)
    //.post(uploadFoto)

router.route('/:id')
    .get(getSentinela)

export default router
