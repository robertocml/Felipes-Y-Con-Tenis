var http = require("http");
var url = require("url");
var fs = require("fs");

var Cookies = require("cookies");

///////////////////////// Conexion interna entre ambos servers////////////

/////////////////////////////////////////////////////////////////////////////7

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

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      //Texto que manda el POST request
      console.log("Received POST data chunk");
      // '"+ postDataChunk + "'.");
      console.log("\n Add listener data \n");
    });

    request.addListener("end", function() {
      route(handle, pathname, response, postData, cookieJar);
      console.log("\n Add listener end \n");
    });
  }

  //https.createServer(options, onRequest).listen(8888);

  http.createServer(onRequest).listen(8080);
  console.log("Server has started.");
}
exports.start = start;
