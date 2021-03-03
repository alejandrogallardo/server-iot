import { ConnectionPool, pool } from 'mssql';
import keys from './keys';
export async function connect(): Promise<ConnectionPool>{
    const pool = new ConnectionPool(keys.config);
    try {
        console.log('Base de datos conectada')
        return await pool.connect();
    }catch(err){
        console.log(err);
        return err;
    }
}
