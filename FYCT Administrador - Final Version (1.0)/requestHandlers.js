//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Proposito de este modulo: contener todas las funciones necesarias para despachar cualquier recurso (html,css,js,pdf,etc) o servicio (IBM PI, login, logout,etc) solicitado por un cliente
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var fs = require("fs"); //modulo para accesar, crear, modificar, borrar archivos de extension .txt entre otros
var mysql = require("mysql"); //modulo para establecer una conexion con la base de datos de un servidor MySQL
var querystring = require("querystring"); //modulo para parsear en un objeto con sus atributos (ej. nombredelobjeto.atributo) a la informacion enviada por el usuario via metodo POST
var async = require("async"); //modulo para utilizar funciones asincronas (ej. each,foreach, y otros loops de manera asincrona)

//Uso del Middleware para subir imagenes a server
var http = require("http"),
  path = require("path"),
  mime = require("mime"),
  fs = require("fs"),
  GUID = require("GUID"),
  formidable = require("formidable"),
  util = require("util");

const express = require("express");
var app = express();
var upload = require("express-fileupload");
var multer = require("multer");
var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(upload()); // configuracion del middleware

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Acceso al servidor MySQL para usar la base de datos que esta aplicacion web necesita
//Nota: cualquier servidor MySQL sirve, solo hay que ejecutar el script 'newCreation' (que se encuentra en este proyecto) en la base de datos
//      que el servidor nos esté prestando, y dicha base de datos sera util para esta aplicacion web
//Servidor MySQL provisto por: Gearhost.com
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//BASE De datos de prueba

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "den1.mysql5.gear.host",
  user: "fyctdb",
  password: "fyct0!",
  database: "fyctdb",
  multipleStatements: true
});

//Parametros para conectarse a la base de datos de digital ocean desde fuera del servidor
//falta habilitar que el servidor acepte conexiones que no sean de localhost
// var pool  = mysql.createPool({
//  connectionLimit : 10,
//  host            : '104.131.75.96',
//  user            : 'root',
//  password        : 'b930f62a8d513ae4962f7c37433aa263482f343d9ef60e77',
//  database        : 'MostlaPI',
//  multipleStatements : true
// });

//Parametros para conectarse a la base de datos de digital ocean estando en el servidor,
// asegurate que al subir los cambios al droplet, que sean estos parametros los que esten descomentedaos
// var pool  = mysql.createPool({
//  connectionLimit : 10,
//  host            : 'localhost',
//  user            : 'root',
//  password        : 'b930f62a8d513ae4962f7c37433aa263482f343d9ef60e77',
//  database        : 'MostlaPI',
//  multipleStatements : true
// });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion que entrega al cliente la view de la homepage de la app web
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function homePage(response, postData, cookieJar) {
  console.log("Request handler 'homePage' was called.");
  fs.readFile("./admin.html", null, function(error, data) {
    if (error) {
      response.writeHead(302, { Location: "./public/error.html" });
      //response.write('File not found!');
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
    }

    response.end();
  });
}

function loginPage(response, postData, cookieJar) {
  console.log("Request handler 'loginPage' was called.");
  fs.readFile("./loginAdmin.html", null, function(error, data) {
    if (error) {
      response.writeHead(302, { Location: "./public/error.html" });
      //response.write('File not found!');
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
    }

    response.end();
  });
}

function loginAction(response, postData, cookieJar) {
  console.log("Request handler 'loginAction' was called.");

  console.log(querystring.parse(postData).email);
  console.log(querystring.parse(postData).password);

  var email = querystring.parse(postData).email;
  var password = querystring.parse(postData).password;

  pool.query(
    "SELECT * FROM Administrador WHERE Correo = '" +
      email +
      "' AND Contrasena = '" +
      password +
      "' ;",
    function(err, result) {
      if (err) throw err;

      if (result.length >= 1) {
        console.log(result[0].Nombres);

        var nameString =
          "" +
          result[0].Nombres +
          " " +
          result[0].ApellidoP +
          " " +
          result[0].ApellidoM;

        var someDate = new Date();
        someDate.setTime(someDate.getTime() + 30 * 60 * 1000);
        cookieJar.set("name", nameString, {
          httpOnly: false,
          expires: someDate
        });
        cookieJar.set("email", email, { httpOnly: false, expires: someDate });

        fs.readFile("./admin.html", null, function(error, data) {
          if (error) {
            response.writeHead(302, { Location: "./public/error.html" });
            //response.write('File not found!');
          } else {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write(data);
          }

          response.end();
        });
      } else {
        fs.readFile("./loginAdmin.html", null, function(error, data) {
          if (error) {
            response.writeHead(302, { Location: "./public/error.html" });
            //response.write('File not found!');
          } else {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write(data);
          }

          response.end();
        });
      }
    }
  );
}

function logoutAction(response, postData, cookieJar) {
  console.log("Request handler 'logout' was called.");

  //Destruye la cookie dandole una fecha de expiracion ya pasada
  var someDate = new Date();
  someDate.setTime(someDate.getTime() - 500000);

  cookieJar.set("name", "dummy", { httpOnly: false, expires: someDate });
  cookieJar.set("email", "dummy", { httpOnly: false, expires: someDate });

  fs.readFile("./loginAdmin.html", null, function(error, data) {
    if (error) {
      response.writeHead(302, { Location: "./public/error.html" });
      //response.write('File not found!');
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
    }

    response.end();
  });
}

////////////////
var http = require("http"),
  path = require("path"),
  mime = require("mime"),
  fs = require("fs"),
  GUID = require("GUID"),
  formidable = require("formidable"),
  util = require("util");
//////////////////////////////////

function addProducto(response, postData) {
  var nombre = querystring.parse(postData).nombre;
  var precio = querystring.parse(postData).precio;
  var descripcion = querystring.parse(postData).nombre;
  var cantidad = querystring.parse(postData).precio;
  var categoria = querystring.parse(postData).nombre;

  console.log("Request handler 'upload del rh' was called. -> " + precio);

  pool.query(
    "INSERT INTO producto (Nombre,Precio,Descripcion,Disponibilidad,Categoria) VALUES ('" +
      nombre +
      "'," +
      precio +
      ",'" +
      descripcion +
      "'," +
      cantidad +
      ",'" +
      categoria +
      "'); ",
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Producto Added to Database.");

        var json = JSON.stringify({
          success: true,
          reason: "Producto Added to Database."
        });

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(json);
      }
    }
  );
  /////////////////////////////////////////////////////
}

function retrieveImagesInfo(response, postData, pathname) {
  console.log("Request handler 'retrieveImagesInfo' was called.");

  pool.query("SELECT * FROM producto;", function(err, result) {
    if (err) throw err;

    if (result.length >= 1) {
      var imageInfoArray = [];
      for (var i = 0; i < result.length; i++) {
        imageInfoArray.push({
          IDProducto: result[i].IDProducto,
          Nombre: result[i].Nombre,
          Precio: result[i].Precio,
          Descripcion: result[i].Descripcion,
          Ubicacion: result[i].Ubicacion
        });
      }

      var json = JSON.stringify({
        success: true,
        reason: "Images information retrieved.",
        ProductInformation: imageInfoArray
      });

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(json);
    } else {
      var imageInfoArray = [];
      var json = JSON.stringify({
        success: false,
        reason: "Nothing retrieved.",
        ProductInformation: imageInfoArray
      });

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(json);
    }
  });
}

function deleteProducts(response, postData, pathname) {
  console.log("Request handler 'deleteProducts' was called.");

  //var IDarray = querystring.parse(postData).IDarray;
  //console.log("ID de los productos a borrar: " + IDarray);
  //console.log("ID de los productos a borrar: " + postDataParsed.IDarray[0]);
  //myJson = JSON.parse(postData);
  //console.log(myJson);

  //var stringified = JSON.stringify({stuff: postDataParsed});
  //console.log(stringified);
  //console.log(stringified.stuff.dummy);
  //console.log(stringified.stuff.IDarray);

  //LO QUE SI JALA
  /*
   var postDataParsed = querystring.parse(postData);
  var dummy = querystring.parse(postData).dummy;
  console.log(postDataParsed);
  console.log(dummy);
   console.log("ID de los productos a borrar: " + postDataParsed.IDarray);
   */
  console.log(postData);
  myObj = querystring.parse(postData);
  console.log(myObj);
  console.log(myObj.productsID);

  if (myObj.productsID instanceof Array) {
    // get JSON array
    //si es array no importa pq si jala en el for
    for (var i = 0; i < myObj.productsID.length; i++) {
      /*
       pool.query("DELETE FROM productoimagen WHERE IDProducto = " + myObj.productsID[i] + ";", function(err, result) {
            
           pool.query("DELETE FROM producto WHERE IDProducto = " + myObj.productsID[i] + ";", function(err, result) {
                
  
           });
       });*/
      pool.query(
        "delete from producto WHERE IDProducto = " + myObj.productsID[i] + ";",
        function(err, result) {
          var json = JSON.stringify({
            success: true,
            reason: "Update was done."
          });

          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(json);
        }
      );
    }
  } else {
    // get JSON object
    //Si es objeto, hay que concatenar el string
    var len = myObj.productsID[0];

    for (var i = 1; i < myObj.productsID.length; i++) {
      len = len + myObj.productsID[i];
    }

    for (var i = 0; i < myObj.productsID.length; i++) {
      /*
       pool.query("DELETE FROM productoimagen WHERE IDProducto = " + myObj.productsID[i] + ";", function(err, result) {
            
           pool.query("DELETE FROM producto WHERE IDProducto = " + myObj.productsID[i] + ";", function(err, result) {
                
  
           });
       });*/
      pool.query(
        "delete from producto WHERE IDProducto = " + len + ";",
        function(err, result) {
          var json = JSON.stringify({
            success: true,
            reason: "Update was done."
          });

          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(json);
        }
      );
    }
  }
  console.log("qqqqqqqqqqqq-------------q-----------NEWlen" + len);
}

function pdfService(response, postData, pathname) {
  //console.log("Request handler 'pdfService' was called. The file " + querystring.parse(postData).pdfNombre + " was requested.");
  console.log(
    "Request handler 'pdfService' was called. The file " +
      pathname +
      " was requested."
  );

  //var nombrePDF =  querystring.parse(postData).pdfNombre;
  //var fullpath = './documents' +  nombrePDF;
  //var fullpath = './documents' +  pathname;
  var fullpath = "." + pathname;

  var file = fs.createReadStream(fullpath);
  var stat = fs.statSync(fullpath);
  response.setHeader("Content-Length", stat.size);
  response.setHeader("Content-Type", "application/pdf");

  if (pathname == "/Casos-y-hallazgos-in.pdf")
    response.setHeader(
      "Content-Disposition",
      "attachment; filename=Casos-y-hallazgos-in.pdf"
    );
  else if (pathname == "/CaracteristicasPersonalidad.pdf")
    response.setHeader(
      "Content-Disposition",
      "attachment; filename=CaracteristicasPersonalidad.pdf"
    );
  file.pipe(response);
}

function cssContent(response, postData, pathname) {
  //	var fullpath = './public' + pathname;
  var fullpath = "." + pathname;

  console.log(
    "Request handler 'cssContent' was called. The file " +
      fullpath +
      " was requested."
  );

  fs.readFile(fullpath, null, function(error, data) {
    if (error) {
      console.log("No file found at:" + fullpath);
      response.writeHead(404);
      response.write("File not found!");
    } else {
      response.writeHead(200, { "Content-Type": "text/css" });
      response.write(data);
    }

    response.end();
  });
}

function jsContent(response, postData, pathname) {
  console.log(
    "Request handler 'jsContent' was called. The file " +
      pathname +
      " was requested."
  );

  //var fullpath = './public' + pathname;
  var fullpath = "." + pathname;

  fs.readFile(fullpath, null, function(error, data) {
    if (error) {
      console.log("No file found at:" + fullpath);
      response.writeHead(404);
      response.write("File not found!");
    } else {
      response.writeHead(200, { "Content-Type": "text/javascript" });
      response.write(data);
    }

    response.end();
  });
}

function pngContent(response, postData, pathname) {
  console.log(
    "Request handler 'pngContent' was called. The file " +
      pathname +
      " was requested."
  );

  //var fullpath = './public' + pathname;
  var fullpath = "." + pathname;

  fs.readFile(fullpath, null, function(error, data) {
    if (error) {
      console.log("No file found at:" + fullpath);
      response.writeHead(404);
      response.write("File not found!");
    } else {
      response.writeHead(200, { "Content-Type": "image/png" });
      response.write(data);
    }

    response.end();
  });
}

function jpgContent(response, postData, pathname) {
  console.log(
    "Request handler 'jpgContent' was called. The file " +
      pathname +
      " was requested."
  );

  //var fullpath = './public' + pathname;
  var fullpath = "." + pathname;

  fs.readFile(fullpath, null, function(error, data) {
    if (error) {
      console.log("No file found at:" + fullpath);
      response.writeHead(404);
      response.write("File not found!");
    } else {
      response.writeHead(200, { "Content-Type": "image/jpg" });
      response.write(data);
    }

    response.end();
  });
}

//Views de la app web
exports.homePage = homePage;
exports.loginPage = loginPage;

//Acciones o servicios que el cliente solicita manualmente
exports.loginAction = loginAction;
exports.logoutAction = logoutAction;
exports.addProducto = addProducto;
exports.upload = addProducto;
exports.retrieveImagesInfo = retrieveImagesInfo;
exports.deleteProducts = deleteProducts;

//Acciones o servicios que el cliente solicita automaticamente
exports.cssContent = cssContent;
exports.jsContent = jsContent;
exports.pngContent = pngContent;
exports.jpgContent = jpgContent;
exports.pdfService = pdfService;
