import { Router, Request, Response } from 'express';
import { connect } from '../database/database';
import { StringBuilder } from '../helpers/stringbuilder';
import Server from '../server/server';

import { v4 as uuidV4 } from 'uuid';

import fs from 'fs';

export async function getSentinelas(req: Request, res: Response): Promise<Response> {
    const connection = await connect();
    try {
        const datos = await connection.request().query('select * from Sentinelas')
        return res.status(200).json({
            ok: true,
            respuesta: datos.recordset
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: error.message
        });
    }
    finally {
        connection.close();
    }

}

export async function getSentinela(req: Request, res: Response): Promise<Response> {

    const id = req.params.id
    // console.log(id)
    try {
        const conn = await connect()
        const agencia = await conn.request().query(`select * from Sentinelas where ID = '${id}'`)
        return res.status(200).json({
            ok: true,
            agencia: agencia.recordset
        })
    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: error.message
        });
    }

}

export async function crearRecord(req: Request, res: Response): Promise<Response> {

    const server = Server.instance;
    const target_dir = 'uploads/';
    let dataFull = req;

    let headers = dataFull.headers;
    let org: any = headers.from;
    let nomarchOld = org.substr(0, org.indexOf('|')); // test Device
    let nomarch = nomarchOld; // test Device
    org = org.substr(org.indexOf('|') + 1, org.length);
    let deviceClass = org.substr(0, org.indexOf('|')); // ATM
    org = org.substr(org.indexOf('|') + 1, org.length); // All
    let contentName = headers['content-name']; // config/status
    let archsize = headers['content-length']; // 685


    let tempStr: string = "";
    let tempLen: number = 0;

    let nombreSize: string = "";
    let lastStatusString: string = "";
    let lastConfString: string = "";
    let resultado: string = "";
    let isInsert = true;
    let SQL: string = "";
    let result: string = "";
    let fotoCorrel: number = 0;
    let secString: string = "";
    let data = req.body;
    console.log('Headrts: ', headers)
    console.log('Content-Name: ', contentName);
    console.log(data);


    const connection = await connect();

    try {
        if (connection) { // verificar conexion

            try {
                SQL = `SELECT * from Sentinelas where ID = '${nomarchOld}'`;
                const result = await connection.request().query(SQL);
                if (result.rowsAffected[0] != 0) {

                    for (let i = 0; i < result.rowsAffected[0]; i++) {
                        fotoCorrel = result.recordset[i].FotoCorrel;
                        lastStatusString = result.recordset[i].LastStatusString;
                        lastConfString = result.recordset[i].LastConfString;
                        secString = result.recordset[i].SecString;
                        isInsert = false;
                    }

                } // fin if

            } catch (error) {
                return res.status(404).json({
                    ok: false,
                    message: error.message
                })
            }

            if (contentName == "config/status") {
                console.log('Entre al content name')
                while (data.length > 4) {
                    if (data.substr(0, 3) == 'ID_') {
                        tempStr = data.substr(3, 6)
                        tempLen = parseInt(tempStr, 10);
                        nomarch = data.substr(9, tempLen);
                        if (connection) {
                            try {
                                SQL = `SELECT * from Notificaciones where Dest = '${nomarchOld}'`;
                                const resultnoti = await connection.request().query(SQL);
                                if (resultnoti.rowsAffected[0] != 0) {
                                    for (let i = 0; i < resultnoti.rowsAffected[0]; i++) {
                                        console.log('Entre al for de noti')
                                        resultado = resultado + "ORG" + resultnoti.recordset[0].Origen + "|" + resultnoti.recordset[0].Notificacion + "\n\r"; // + "\n\r";
                                        console.log('Resultado For: ', resultado);
                                    }
                                    SQL = `DELETE from Notificaciones where Dest = '${nomarchOld}'`;
                                    const result = await connection.request().query(SQL);
                                } // no hay dest
                            } catch (error) {
                                console.log(error)
                            }

                        }
                        data = data.substr(9 + tempLen, data.length);
                    } else if (data.substr(0, 3) === 'CLS') {
                        console.log('Viene una clase');
                        tempStr = data.substr(3, 6);
                        tempLen = parseInt(tempStr, 10);
                        deviceClass = data.substr(9, tempLen);
                        // resultado = resultado + deviceClass;
                        data = data.substr(9 + tempLen, data.length);
                    } else if (data.substr(0, 3) === 'CFG') {
                        console.log('Viene una configuracion');
                        tempStr = data.substr(3, 6);
                        tempLen = parseInt(tempStr, 10);
                        tempStr = data.substr(9, tempLen);
                        lastConfString = tempStr;
                        //resultado = resultado + tempStr;
                        console.log('Resultado en Congiguaracion: ', resultado)
                        data = data.substr(9 + tempLen, data.length);
                    } else if (data.substr(0, 3) === 'STA') {
                        console.log('Viene un status');
                        tempStr = data.substr(3, 6);
                        tempLen = parseInt(tempStr, 10);
                        tempStr = data.substr(9, tempLen);
                        lastStatusString = tempStr;
                        // resultado = resultado + tempStr;
                        data = data.substr(9 + tempLen, data.length);
                    } else if (data.substr(0, 3) === 'SEC') {
                        console.log('Viene un sec')
                        tempStr = data.substr(3, 6);
                        tempLen = parseInt(tempStr, 10);
                        tempStr = data.substr(9, tempLen);
                        secString = tempStr;
                        resultado = resultado + secString;
                        if (connection) {
                            try {
                                SQL = `insert into Notificaciones Values('${nomarchOld}', '${org}', '${secString}', GETDATE() )`;
                                console.log('Insert noti: -> ', SQL)
                                const result = await connection.request().query(SQL);
                                // sqlsrv_free_stmt($result);
                                /*return res.status(200).json({
                                    ok: true,
                                    respuesta: result.output // .recordset
                                })*/
                            } catch (error) {
                                return res.status(404).json({
                                    ok: false,
                                    message: error.message
                                })
                            }
                        }
                        data = data.substr(9 + tempLen, data.length);
                    } else if (data.substr(0, 3) === 'TKN') {
                        console.log('Viene un Token')
                        tempStr = data.substr(3, 6);
                        tempLen = parseInt(tempStr, 10);
                        tempStr = data.substr(9, tempLen);
                        secString = tempStr;
                        resultado = resultado + secString;
                        if (connection) {
                            SQL = `insert into Notificaciones Values('${nomarchOld}', '${org}', TOKEN:'${secString}', getdate() )`;
                            const result = await connection.request().query(SQL);
                        }
                        data = data.substr(9 + tempLen, data.length);
                    } else if (data.substr(0, 3) === 'RFID') {
                        console.log('Viene un RFID')
                        tempStr = data.substr(3, 6);
                        tempLen = parseInt(tempStr, 10);
                        tempStr = data.substr(9, tempLen);
                        secString = tempStr;
                        resultado = resultado + secString;
                        if (connection) {
                            SQL = `insert into Notificaciones Values('${nomarchOld}', '${org}', RFID:'${secString}', getdate() )`;
                            const result = await connection.request().query(SQL);
                        }
                        data = data.substr(9 + tempLen, data.length);
                    }
                }

                if (nomarchOld != "") {
                    if (connection) {
                        const SQL = new StringBuilder();
                        if (!isInsert) {
                            SQL.Append(`update Sentinelas set LastPing = getdate(), `);
                            SQL.Append(`ID = '${nomarch}', `);
                            SQL.Append(`LastConfString = '${lastConfString}', `);
                            SQL.Append(`LastStatusString = '${lastStatusString}', `);
                            SQL.Append(`SecString = '${secString}', `);
                            SQL.Append(`fotoCorrel =  ${fotoCorrel} `);
                            SQL.Append(`where ID = '${nomarchOld}'`);
                            // console.log('SQL en update: ');
                        } else {
                            const SQL = new StringBuilder();
                            SQL.Append(`insert into Sentinelas values ('${nomarchOld}', '${deviceClass}', '`);
                            SQL.Append(`${lastStatusString}', '${lastConfString}', '`);
                            SQL.Append(`${secString}', getdate(), ${fotoCorrel}, 0, 0)`);
                            // console.log('SQL en Insert ');
                        }

                        //resultado = resultado + SQL;
                        const result = await connection.request().query(SQL.ToString());
                    }
                }
            } else if (contentName == 'CAM') {
                console.log('Viene una camara')
                fotoCorrel = fotoCorrel + 1;
                console.log('Foto Correl: ', fotoCorrel);

                let algo = target_dir + nomarchOld + fotoCorrel.toString() + ".jpg";
                console.log('Archivo imagen: ', algo);
                // file_put_contents(target_dir + nomarchOld + fotoCorrel + ".jpg", data);
                fs.writeFile(target_dir + nomarchOld + fotoCorrel + ".jpg", data, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Archivo guardado correctamente');
                    }
                });

                if (connection) {
                    try {
                        SQL = `update Sentinelas set fotoCorrel = fotoCorrel + 1, LastPing = getdate()`;
                        SQL = SQL + ` where ID = '${nomarchOld}'`;
                        console.log('Query en CAM 1: ', SQL);
                        const result = await connection.request().query(SQL);
                        // sqlsrv_free_stmt($result);
                    } catch (err) {
                        console.log(err)
                    }

                    try {
                        SQL = `insert into Notificaciones Values('${nomarchOld}', '${org}', '${nomarchOld}${fotoCorrel}.jpg', getdate() )`;
                        console.log('Query en CAM 2: ', SQL);
                        const result = await connection.request().query(SQL);
                        // sqlsrv_free_stmt($result);
                        // sqlsrv_close($conn);
                    } catch (err) {
                        console.log(err)
                    }

                }
            } else if (contentName == 'ERROR') {
                if (connection) {
                    SQL = `insert into Notificaciones Values('${nomarchOld}', '${org}', 'ERROR:${data}', getdate() )`;
                    console.log('ERORR ', SQL);
                    const result = await connection.request().query(SQL);
                    // sqlsrv_free_stmt($result);
                    // sqlsrv_close($conn);
                }
            } else {
                resultado = "Syntax error !!";
                console.log(resultado)
            }
        } // Fin If verifica conexion

        server.io.emit('Actualizacion');
        resultado = resultado + 'OK';
        console.log('Resultado final antes del res: ', resultado);

        return res.format({
            'text/plain': function () {
                res.send(resultado)
            }
        })

        // FIN DEL TRY
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: error.message
        });
    }
    finally {
        console.log('Se cerro conexion')
        connection.close();
    }


}

export async function uploadFoto(req: Request, res: Response): Promise<Response> {
    const target_dir = 'uploads/';
    const data = req.body;
    const nomarchOld = uuidV4();
    const fotoCorrel = '5';

    // const { title, description } = req.body;
    // console.log('Titulo: ', title);
    // console.log('Descripcion: ', description);

    const buff = Buffer.from(data).toString('binary');

    try {

        fs.writeFileSync(target_dir + nomarchOld + fotoCorrel + ".jpg", buff, 'binary');

        return res.status(200).json({
            ok: true
        })

    } catch (error) {

        return res.status(400).json({
            ok: false,
            message: error.message
        });

    }
}
