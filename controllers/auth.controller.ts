import { Router, Request, Response } from 'express';
import {connect}  from '../database/database';
import bcrypt from 'bcryptjs';
import {generarJWT} from '../helpers/jwt'

export async function login(req: Request, res: Response): Promise<Response> {
    console.log('Login: ', req.body);

    const {usr_usuario, usr_password} = req.body;
    const connetion = await connect();
    try{
        const usuarioDB = await connetion.request().query(`select * from Usuarios where usr_usuario = '${usr_usuario}'`);

        if ( !usuarioDB.recordset[0]['usr_usuario'] ) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no encontrado'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( usr_password, usuarioDB.recordset[0]['usr_password']);
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuarioDB.recordset[0]['usr_usuario'] );

        return res.status(200).json({
            ok: true,
            token
        });


    }catch (error){
        return res.status(404).json({
            ok: false,
            message: error.message
        })
    }finally {
        connetion.close();
    }
}

export async function renewToken(req: any, res: Response): Promise<Response> {
    const uid = req.uid;
    const connetion = await connect();
    // Generar el TOKEN - JWT
    const token = await generarJWT( uid );

    // Obtener el usuario por UID
    const usuario = await connetion.request().query(`select * from Usuarios where usr_usuario = '${uid}'`);

    return res.json({
        ok: true,
        token,
        usuario
    });
}

