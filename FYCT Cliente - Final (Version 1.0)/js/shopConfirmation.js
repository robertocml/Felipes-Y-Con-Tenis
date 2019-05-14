var total;
var productos = "";
var nombre;
var col;
var apellido;
var ordenID;
var email;
//ID
var apellidoP;
var apellidoM;
var dinamcID;

$(document).ready(function() {
  console.log("shopConfirmation SCRIPT WAS LOADED");
  //alert("prueba de que js esta corriendo");

  email = getCookie("email");

  var jsonToSend = {
    email: email
  };

  $.ajax({
    url: "/ShopConfirmationAction",
    cache: false,
    type: "POST",
    crossDomain: true,
    data: jsonToSend,
    ContentType: "text/plain",
    dataType: "json",

    error: function(errorMessage, textStatus, errorThrown) {
      console.log(errorMessage);
      console.log(textStatus);
      console.log(errorThrown);
      alert("error");
    },

    success: function(dataReceived) {
      console.log(
        "Data that was received from the server:---------------------------------- "
      );
      //console.log("img: " + dataReceived.CartInformation[0].Ubicacion);

      //alert("entro el for cantidad de informacion:" + dataReceived.CartInformation[0].Colonia);
      var subtotalGeneral = 0;
      var colonia = dataReceived.CartInformation[0].Colonia;
      var estado = dataReceived.CartInformation[0].Estado;
      var pais = dataReceived.CartInformation[0].Pais;
      var numero = dataReceived.CartInformation[0].Numero;
      var calle = dataReceived.CartInformation[0].Calle;
      col = dataReceived.CartInformation[0].Colonia;
      apellidoP = dataReceived.CartInformation[0].ApellidoP;
      apellidoM = dataReceived.CartInformation[0].ApellidoM;

      $("#info").append("<p> Calle: " + calle + "</p>");
      $("#info").append("<p> Colonia: " + colonia + "</p>");
      $("#info").append("<p> Estado: " + estado + "</p>");
      $("#info").append("<p> Pais: " + pais + "</p>");
      $("#info").append("<p> Telefono de Usuario: " + numero + "</p>");

      for (i = 0; i < dataReceived.CartInformation.length; i++) {
        productos +=
          i + 1 + ". " + dataReceived.CartInformation[i].Nombre + " ";

        subtotalGeneral =
          subtotalGeneral +
          dataReceived.CartInformation[i].Cantidad *
            dataReceived.CartInformation[i].Precio;
        var newElement =
          " <div class='col s6'> " +
          "	<div class='card-panel cyan darken-1 hoverable'>" +
          " <h5 class='white-text'>" +
          dataReceived.CartInformation[i].Nombre +
          "</h5> " +
          " <div class='row'>" +
          " <div class='col s6'>" +
          " <img id='imagen_tenis' class='circle responsive-img' src=" +
          "http://localhost:3000/imagenes/producto" +
          dataReceived.CartInformation[i].IDProducto +
          ".jpg" +
          "  >" +
          " </div> " +
          " <div class='col s6'>" +
          " <span class='white-text left-align'>Cantidad comprada: " +
          dataReceived.CartInformation[i].Cantidad +
          "</span>" +
          " </div>" +
          " </div>" +
          " </div>" +
          " </div>";

        $("#tenisCards").append(newElement);
      }

      $("#totalF").append("$" + subtotalGeneral + ".00 MXN");
      total = subtotalGeneral;
    }
  });
});

paypal
  .Buttons({
    style: {
      layout: "horizontal",
      shape: "pill",
      color: "black"
    },

    createOrder: function(data, actions) {
      var date = new Date();
      var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      ];

      var id = components.join("");

      var dinamcIDDate = new Date();
      var dinamcIDNum = dinamcIDDate.getTime().toString();
      var dinamicAppP = apellidoP.charAt(0);
      var dinamicAppM = apellidoM.charAt(0);
      var dinamicEmail = email.charAt(0);

      dinamicID = dinamcIDNum + dinamicAppP + dinamicAppM + dinamicEmail;
      //	console.log(dinamcID);

      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: total
            },

            description: productos,

            invoice_id: dinamicID //cambiar el id para cada compra
          }
        ]
      });
    },

    onApprove: function(data, actions) {
      // se obtionon los fondos de la cuenta
      return actions.order.capture().then(function(details) {
        //
        var date = new Date();
        var components = [
          date.getYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          date.getMilliseconds()
        ];
        var id = components.join("");
        //
        // mensaje de exito para la compra
        nombre = details.payer.name.given_name;
        apellido = details.payer.name.surname;
        ordenID = data.orderID;
        email = getCookie("email");
        //2;

        var today = new Date();
        var date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate();
        alert("Gracias por tu compra" + nombre + " " + apellido);

        //Se genera el ajax para cargar la orden a la bdd
        var jsonToSend = {
          invoiceID: dinamicID,
          total: total,
          email: email,
          direccion: col,
          fecha: date
        };

        $.ajax({
          url: "/AddOrder",
          cache: false,
          type: "POST",
          crossDomain: true,
          data: jsonToSend,
          ContentType: "text/plain",
          dataType: "json",

          error: function(errorMessage, textStatus, errorThrown) {
            console.log(errorMessage);
            console.log(textStatus);
            console.log(errorThrown);
            alert("error");
            window.location.replace("/");
          },

          success: function(dataReceived) {
            console.log(
              "Data that was received from the server:---------------------------------- "
            );
            alert("Orden agregada exitosamente a la bdd");
            window.location.replace("/");
            //console.log("img: " + dataReceived.CartInformation[0].Ubicacion);
          }
        });
        //--------------------------------------------
      });
    },

    onError: function(err) {
      // Show an error page here, when an error occurs
      alert(
        "Error:Tiempo de espera muy corto (No se inicializo el API de Paypal Correctamente)"
      );
    }
  })
  .render("#paypal-button-container");
