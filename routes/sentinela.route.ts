import express, { Router } from 'express';
import upload from '../helpers/multer';

const router = Router()

import { getSentinelas, getSentinela, crearRecord, uploadFoto } from '../controllers/sentinela.controller'

router.route('/')
    .get(express.json(), getSentinelas)
    .post(express.json(), crearRecord)

router.route('/subir')
    .post(express.raw({
        inflate: true,
        limit: "100mb",
        type: "application/octet-stream"
    }), uploadFoto)
//.post(uploadFoto)

router.route('/:id')
    .get(express.json(), getSentinela)

export default router
