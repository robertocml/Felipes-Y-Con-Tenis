var http = require("http");
var url = require("url");
var fs = require("fs");
var Cookies = require("cookies");
var mysql = require("mysql");

var http = require("http"),
  path = require("path"),
  mime = require("mime"),
  fs = require("fs"),
  GUID = require("GUID"),
  formidable = require("formidable"),
  util = require("util");

//
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "den1.mysql5.gear.host",
  user: "fyctdb",
  password: "fyct0!",
  database: "fyctdb",
  multipleStatements: true
});
//

//var someTools = require('someTools');

/*
var https = require("https");

var options = {
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
};*/

function start(route, handle) {
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    var cookieJar = new Cookies(request, response /*, { "keys": keys } */);
    //cookieJar.set( "email", "yourmom@gmail.com", { httpOnly: false, expires: new Date(new Date().getTime()+86409000).toUTCString()} );

    console.log("Request for " + pathname + " received.");
    //console.log('JSON = ' + JSON.stringify(cookies));

    //request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      //Texto que manda el POST request
      console.log("Received POST data chunk");
      // '"+ postDataChunk + "'.");
      console.log("\n Add listener data \n");
    });

    if (request.method === "POST" && request.url === "/uploadIMG") {
      request.on("error", function(e) {
        console.log("Problem with requestuest: " + e.message);
      });
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      var name = "default";
      var fileDirectory = __dirname + "/imagenes/",
        form = new formidable.IncomingForm();

      form.keepExtensions = true;
      form.uploadDir = fileDirectory;

      var hm = "foto_" + name;

      /*
      pool.query(
        "select * from producto ORDER BY IDProducto DESC LIMIT 1;",
        function(err, result) {
          if (err) throw err;

          if (result.length >= 1) {
            global.IDProductoG = result[0].IDProducto;

            console.log(
              "ID del producto (dentro Query)------->---> " + IDProductoG
            );
            setIDimage(IDProductoG);
          } else {
            throw err;
          }
        }
      );

      function setIDimage(id) {
        name = id;
      }*/

      ////////////////____________________////////////////////______________
      function getLastRecord() {
        return new Promise(function(resolve, reject) {
          // The Promise constructor should catch any errors thrown on
          // this tick. Alternately, try/catch and reject(err) on catch.

          var query_str =
            "select * from producto ORDER BY IDProducto DESC LIMIT 1;";

          pool.query(query_str, function(err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
              return reject(err);
            }
            resolve(rows);
            console.log("roooooows " + rows);
          });
        });
      }

      getLastRecord()
        .then(function(rows) {
          console.log(rows);

          // now you have your rows, you can see if there are <20 of them
          form.on("file", function(field, file) {
            //rename the incoming file to the file's name
            fs.rename(
              file.path,
              form.uploadDir + "/" + "producto" + rows[0].IDProducto + ".jpg",
              function(error) {}
            );
          });
        })
        .catch(err =>
          setImmediate(() => {
            throw err;
          })
        ); // Throw
      //////////_____________________________/_/_/_/____________________________________________

      ///////////////////////

      console.log("-----<-<-<-<-<----<<--->>>>>" + hm);

      async function init() {
        console.log(1);
        await sleep(1000);
        console.log(2);
      }
      function sleep(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }

      form.parse(request, function(err, fields, files) {
        if (err) throw err;

        var pic = JSON.stringify(util.inspect(files)),
          upIndx = pic.indexOf("imagenesdb"),
          path = pic.slice(upIndx + 6, upIndx + 42);

        response.writeHead(200, {
          "Content-Type": "text/html"
        });
        fs.readFile("admin.html", function(err, page) {
          response.writeHead(200, {
            "Content-Type": "text/html"
          });
          response.write(page);
          response.end();
        });
      });

      ///////////////////////

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else {
      request.addListener("end", function() {
        route(handle, pathname, response, postData, cookieJar);
        console.log("\n Add listener end \n");
      });
    }
  }

  //https.createServer(options, onRequest).listen(8888);

  http.createServer(onRequest).listen(3000);
  console.log("Server has started.");
}
exports.start = start;
