const http = require('http');
const url = require('url');
const fs = require('fs');

const { insertar,consultar,actualizar,eliminar} = require("./consultas");
const {consultarTransaccion,  registraTransaccion} = require("./consultasTran")


http.createServer(async (req, res) => {

    
    if(req.url == '/' && req.method == 'GET'){
        res.setHeader("content-type", "text/html");
        res.statusCode = 200;
        const html = fs.readFileSync("index.html", "utf8");
        res.end(html);
    }

    if(req.url == '/usuario' && req.method == 'POST'){
        console.log("ingrese al post");
        let body = "";
        req.on("data", (chunk) => {
            body+= chunk;
        });
        req.on("end", async() => {
          
            const datos = Object.values(JSON.parse(body));
            const respuesta = await insertar(datos);
            if(respuesta.code){
                res.statusCode = 400;
                res.end(respuesta.message);
            }else {
                res.statusCode = 201;
                res.end();
            }
            
        })
    }


     if(req.url == "/usuarios" && req.method == "GET"){
          try{
              const usuario = await consultar();
              console.log(usuario);
              res.end(JSON.stringify(usuario));

          }catch (err){
              res.statusCode = 500;
              res.end("Ocurrio un erroe en el servidor"+ err.code)
          }

      }



    if( req.url.startsWith('/usuario?id=') && req.method == 'PUT'){
        console.log("ingreso a PUT");
        let body = "";
        req.on("data", (chunk) => {
            body+= chunk;
        });
        req.on("end", async() => {
            //console.log(body);
            const result = Object.values(JSON.parse(body));
           
            console.log(result);
            const respuesta = await actualizar(result);
           // console.log(respuesta)
            if(respuesta.code){
                res.statusCode = 400;
                res.end(respuesta.message);
            }else {
                res.statusCode = 201;
                res.end();
            }
            
        })
    }
    
    if(req.url.startsWith('/usuario?id') && req.method == 'DELETE'){
        const { id } = url.parse(req.url, true).query;
       
        //console.log(id);
        eliminar(id).then(respuesta => {
            res.statusCode = 200;
            res.end();
        }).catch(error => {
            res.statusCode = 200;
            console.log(error)
            res.end(JSON.stringify(error));
        })

    }

    if (req.url == '/transferencia' && req.method == 'POST'){
        let body = "";
        req.on("data", (chunk) => {
            body+= chunk;
        });
        req.on("end", async() => {
          try{
           const datos = JSON.parse(body);
          // const datos = Object.values(JSON.parse(body));
          //  console.log(datos);
            await  registraTransaccion(datos);
            
            res.statusCode = 201;
            res.end();
          }catch(error){
            res.statusCode = 400;
                res.end("Ocurrio un problema al gestionar"+error);
          }
        });
    }



    if( req.url.startsWith('/transferencia') && req.method == 'GET'){
        
        try{
            const data = await consultarTransaccion();
           // console.log(data);
            res.end(JSON.stringify(data));
            

        }catch (err){
            res.statusCode = 500;
            res.end("Ocurrio un erroe en el servidor"+ err.code)
        }

    }






}).listen(3000, console.log("Servidor corriendo en http://localhost:3000/"))
