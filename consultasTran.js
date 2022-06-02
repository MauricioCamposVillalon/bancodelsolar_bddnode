const { Pool } = require("pg");
const moment = require('moment');


let fecha = moment().format('DD-MM-YYYY hh:mm ');
console.log(fecha);


const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    password: 'admin',
    database: 'bancosolar',
    port: '5432',
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
});

const registraTransaccion = async (datos) => {
    const valor = Object.values(datos);
    
    let emisor=valor[0];
    let receptor = valor[1];
    let monto = valor[2];
    const registrarTransaccion ={
        rowMode: "array",
        text : `INSERT INTO transferencias (emisor,receptor ,monto ,fecha) VALUES ($1,$2,$3,$4) RETURNING*;`,
        values: [emisor, receptor, monto ,fecha] ,
    }

    const usuarioemisor ={
        rowMode: "array",
        text: "UPDATE usuarios SET balance= balance - $2  WHERE id =$1 RETURNING *;",
        values: [emisor, monto],
    }
    const usuarioreceptor ={
        rowMode: "array",
        text: "UPDATE usuarios SET balance= balance + $2  WHERE id =$1 RETURNING *;",
        values: [receptor,monto],
    }
    try{
        await pool.query("BEGIN");
       await pool.query(registrarTransaccion);
        await pool.query(usuarioemisor);
        await pool.query(usuarioreceptor);

        await pool.query("COMMIT");


    }catch (error) {
        
        await client.query("ROLLBACK");
        
    }


}


const consultarTransaccion = async () =>{
    const consulta = {
        text: "SELECT t.id, u.nombre as emisor,(select nombre from usuarios where id=t.receptor) as receptor, t.monto, t.fecha FROM transferencias t INNER JOIN usuarios u ON u.id=t.emisor group by t.id,t.fecha, t.monto, u.nombre,receptor ORDER BY t.id ASC;",
        rowMode: "array",
    }
    const resultado = await pool.query(consulta);
    return resultado.rows;

};


module.exports = {consultarTransaccion, registraTransaccion}