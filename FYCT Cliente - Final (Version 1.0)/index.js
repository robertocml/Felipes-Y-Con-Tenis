//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Proposito de este modulo: inicializar todo el codigo backend necesario para que la aplicacion web arranque y funcione
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var server = require("./server"); //Modulo que se encarga de recibir con integridad un request (header del request y su contenido via metodo Post o Get) del cliente, para despues entregarselo al modulo 'router'
var router = require("./router"); //Modulo que se encarga de averiguar qué recurso o accion esta solicitando el cliente para determinar a qué funcion encomendarle atender la solicitud del cliente
var requestHandlers = require("./requestHandlers"); //Modulo que contiene todas las funciones necesarias para despachar cualquier recurso (html,css,js,pdf,etc) o servicio (IBM PI, login, logout,etc) solicitado por un cliente

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Arreglo asociativo que almacena funciones
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var handle = {};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funciones para entregar views (archivos html) de la app web
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

handle["/"] = requestHandlers.homePage;
handle["/IniciarSesion"] = requestHandlers.loginPage;
handle["/Tienda"] = requestHandlers.shopPage;
handle["/Registro"] = requestHandlers.registerPage;
handle["/Carrito"] = requestHandlers.cartPage;
handle["/ProductoDetalles"] = requestHandlers.productDetailsPage;
handle["/Perfil"] = requestHandlers.profilePage;
handle["/CerrarSesion"] = requestHandlers.logoutAction;
handle["/ShopConfirmation"] = requestHandlers.shopConfirmationPage;
handle["/AddOrder"] = requestHandlers.addOrder;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funciones para realizar acciones o servicios
//Nota: Estos son solicitados de manera manual por el usuario
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

handle["/LoginAction"] = requestHandlers.loginAction;
handle["/RegisterAction"] = requestHandlers.registerAction;
handle["/ImagesInfo"] = requestHandlers.retrieveImagesInfo;
handle["/MostSoldProducts"] = requestHandlers.mostSoldProducts;
handle["/CartAction"] = requestHandlers.cartAction;
handle["/SelectedProduct"] = requestHandlers.retrieveSelectedProduct;
handle["/CartActionRemove"] = requestHandlers.cartActionRemove;
handle["/CartActionAddCant"] = requestHandlers.cartActionAddCant;
handle["/CartActionSubstractCant"] = requestHandlers.cartActionSubstractCant;
handle["/CartInsertProduct"] = requestHandlers.cartActionInsert;
handle["/ShopConfirmationAction"] = requestHandlers.shopConfirmationAction;
handle["/ProfileUpdate"] = requestHandlers.profileUpdate;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funciones para entregar una variedad de archivos (css,js,png,jpg,pdf,etc)  al cliente
//Nota: Estos son solicitados de manera automatica por el cliente
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
handle["/css"] = requestHandlers.cssContent;
handle["/js"] = requestHandlers.jsContent;
handle["/png"] = requestHandlers.pngContent;
handle["/jpg"] = requestHandlers.jpgContent;
handle["/pdf"] = requestHandlers.pdfService;
handle["/ProfileGetRecomendations"] = requestHandlers.profileGetRecomendations;
handle["/ProfileGetPurchaseHistory"] =
  requestHandlers.profileGetPruchaseHistory;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Se le encomienda al servidor la tarea de arrancar y estar escuchando solicitudes (requests) de usuarios, ya sea que soliciten recursos o acciones
//Nota:se le hace entrega al servidor del modulo 'router' y el arreglo de funciones
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
server.start(router.route, handle);
