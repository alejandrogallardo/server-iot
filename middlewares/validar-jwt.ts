import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../global/environment';
import {Router, Request, Response, NextFunction} from 'express';

export const validarJWT = (req: any, res: Response, next: NextFunction) => {

    const token = req.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }
    try {

        const  obj: any  = jwt.verify( token, JWT_SECRET );
        req.uid = obj.uid;
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}
