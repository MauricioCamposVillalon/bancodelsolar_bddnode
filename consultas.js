const { Pool } = require("pg");

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

const insertar = async (datos) => {
    // console.log(datos);
     const consulta = {
         text: "INSERT INTO usuarios (nombre, balance) VALUES($1,$2) RETURNING*;",
         values: datos
     };
 
     try {
         const result = await pool.query(consulta);
         return result;
         
     } catch (error) {
         console.log(error.code)
         return error;        
     }
 
 }


 const consultar = () =>{
    
    return new Promise(async (resolve, reject) => {
        try {
            const result = await pool.query("SELECT * FROM usuarios Order BY balance ASC;");
            //console.log(result.rows);
            resolve(result.rows);
            
        } catch (error) {
            reject(error);
        }
    })
}

const actualizar = async (datos) => {
   // console.log(datos);
    const consulta = {

        text: "UPDATE usuarios SET nombre= $2,  balance =$3  WHERE id = $1 RETURNING *;",
        values: datos,
    };
  //  console.log(consulta);
    try {
        const result = await pool.query(consulta);
        
        return result;
        
    } catch (error) {
        //console.log(error.code)
        return error;        
    }

}

const eliminar = (id) => {
    // console.log(id);
     return new Promise((resolve, reject) => {
             pool.query("DELETE FROM usuarios WHERE id = $1 RETURNING *;", [id], (error, result) => {
                 if(error){
                     let objError ={
                         mensaje: error.message,
                         codigo: error.code
                     }
                     reject(objError);
                 }else{
                     resolve(result);
                 }
             });
     })
 }



 module.exports = {insertar,consultar,actualizar,eliminar}