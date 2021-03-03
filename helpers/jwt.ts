import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../global/environment'

export const generarJWT = (uid: string) => {
    return new Promise( ( resolve, reject ) => {

        const payload = {
            uid,
        };

        jwt.sign( payload, JWT_SECRET, {
            expiresIn: '12h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }

        });

    });
}
