//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Proposito de este modulo: averiguar qué recurso o accion esta solicitando el cliente para determinar a qué funcion encomendarle atender la solicitud del cliente 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function route(handle, pathname, response, postData, cookieJar) {

	console.log("About to route a request for " + pathname);

    //Si el cliente solicita algun recurso o accion llamados de una manera especifica (ej. '/Informacion'), entonces la solicitud se puede atender
	if (typeof handle[pathname] === 'function') {

		handle[pathname](response, postData, cookieJar);

			
	//Si el cliente solicita un archivo css (como sea que se llame dicho archivo), dicha solicitud se puede atender 
	} else if (/^\/[a-zA-Z0-9\/\.\-]*.css$/.test(pathname.toString())) {

		handle["/css"](response,postData, pathname);

	//Si el cliente solicita un archivo js (como sea que se llame dicho archivo), dicha solicitud se puede atender  
	} else if (/^\/[a-zA-Z0-9\/\.\-]*.js$/.test(pathname.toString())){

		handle["/js"](response,postData, pathname);

    //Si el cliente solicita un archivo png (como sea que se llame dicho archivo), dicha solicitud se puede atender  
	} else if (/^\/[a-zA-Z0-9\/\.\_\-]*.png$/.test(pathname.toString())){
			handle["/png"](response,postData, pathname);
    
    //Si el cliente solicita un archivo pdf (como sea que se llame dicho archivo), dicha solicitud se puede atender  
	}  else if (/^\/[a-zA-Z0-9\/\.\_\-]*.pdf$/.test(pathname.toString())){
			handle["/pdf"](response,postData, pathname);

	//Si el cliente solicita un archivo jpg (como sea que se llame dicho archivo), dicha solicitud se puede atender
	} else if (/^\/[a-zA-Z0-9\/\.\_\-]*.jpg$/.test(pathname.toString())){
			handle["/jpg"](response,postData, pathname);
	}

	//No se pudo identificar que es lo que el cliente esta tratando de solicitar, por lo cual la solicitud NO se puede atender
	else {

		console.log("No request handler found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not found");
		response.end();
	}
}

exports.route = route;
