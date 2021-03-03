import { Router, Request, Response } from 'express';
import {connect}  from '../database/database';
import bcrypt from 'bcryptjs';

export async function crearUsuario(req: Request, res: Response): Promise<Response>{
    const { usr_usuario, usr_nombre, usr_apellido, usr_password, usr_rango, usr_pin } = req.body;
    const connetion = await connect();
    try{
        const salt = bcrypt.genSaltSync();
        const enpassword = bcrypt.hashSync(usr_password, salt);
        await connetion.request().query(`insert into Usuarios values('${usr_usuario}', '${usr_nombre}', '${usr_apellido}', '${enpassword}',  CURRENT_TIMESTAMP, ${usr_rango}, ${usr_pin})`)
        return res.status(200).json({
            ok: true,
            message: 'Usuario Creado'
        })
    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: error.message
        })
    }
    finally{
        connetion.close();
    }

}
