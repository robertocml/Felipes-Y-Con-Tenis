//Slider && Select Init
$(document).ready(function() {
  console.log("perfil script activated");
  //alert("ready() is Working");

  getPurchaseHistory();
  getRecomendations();

  $(".slider").slider({ height: 500 });
  $("select").formSelect();

  $("#update").click(function(e) {
    e.preventDefault();
    console.log("update BUTTON WAS CLICKED");
    sendInfo();
  });
});

function sendInfo() {
  var direccion = $("#direccion").val();
  var pais = $("#pais").val();
  var estado = $("#estado").val();
  var ciudad = $("#ciudad").val();
  var email = getCookie("email");

  console.log("password: " + pais + estado + ciudad + direccion);
  //alert("alert: " + pais + estado + ciudad + direccion);

  var jsonToSend = {
    direccion: direccion,
    pais: pais,
    estado: estado,
    ciudad: ciudad,
    email: email
  };

  $.ajax({
    url: "/ProfileUpdate",
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
    },

    success: function(dataReceived) {
      console.log("Data that was received from the server: ");
      alert("Tus Cambios se guardaron exitosamente");

      if (dataReceived.names.length >= 1) {
        alert("Se han actualizado tus datos exitosamente!");
      } else
        alert(
          "No se pudo actualizar tu informacion personal, intenta de nuevo mas tarde"
        );
    }
  });
}

function getPurchaseHistory() {
  var email = getCookie("email");

  var jsonToSend = {
    email: email
  };

  $.ajax({
    url: "/ProfileGetPurchaseHistory",
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
    },

    success: function(dataReceived) {
      if (dataReceived.PurchaseHistory.length >= 1) {
        //alert("Se han recibido el historial");

        //Aqui se agregan las imagenes que se recibieron del server al css de perfil
        for (i = 0; i < dataReceived.PurchaseHistory.length; i++) {
          var newElement =
            "<div class='row'>" +
            "<div class='col s2'><img src= " +
            dataReceived.PurchaseHistory[i].Ubicacion +
            " height='100' width='150'></div>" +
            "<div class='col s2 center-align '> ID Orden: " +
            dataReceived.PurchaseHistory[i].IDOrden +
            "</div>" +
            "<div class='col s2 center-align '> Fecha de Compra: " +
            dataReceived.PurchaseHistory[i].Fecha +
            "</div>" +
            "<div class='col s2 center-align '> Cantidad:" +
            dataReceived.PurchaseHistory[i].Cantidad +
            "</div>" +
            "<div class='col s2 center-align '> Subtotal: $" +
            dataReceived.PurchaseHistory[i].Subtotal +
            ".00 MXN</div>" +
            "<div class='col s2 center-align '> &nbsp;&nbsp;</div></div>";
          if (i < 3) {
            $("#history").append(newElement);
          }
        }
      } else alert("No se pudo recibir el historial de compras (NOT >= 1)");
    }
  });
}

function getRecomendations() {
  var email = getCookie("email");

  var jsonToSend = {
    email: email
  };

  $.ajax({
    url: "/ProfileGetRecomendations",
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
    },

    success: function(dataReceived) {
      if (dataReceived.Recomendations.length >= 1) {
        //alert("Se han recibido las recomendaciones");

        //Aqui se agregan las imagenes que se recibieron del server al css de perfil
        for (i = 0; i < dataReceived.Recomendations.length; i++) {
          var newElement =
            "<div class='row'>" +
            "<div class='col s2'><img src= " +
            dataReceived.Recomendations[i].Ubicacion +
            " height='100' width='150'></div>" +
            "<div class='col s4 center-align '>  " +
            dataReceived.Recomendations[i].Nombre +
            "</div>" +
            "<div class='col s2 center-align '> $" +
            dataReceived.Recomendations[i].Precio +
            ".00 MXN</div>" +
            "<div class='col s4 center-align '> &nbsp;&nbsp;</div></div>";
          if (i < 3) {
            $("#recomendations").append(newElement);
          }
        }
      } else alert("No se pudo recibir el historial de compras (NOT >= 1)");
    }
  });
}

/*
//Trigger del DropDown
$('.dropdown-trigger').dropdown({coverTrigger: false, alignment: 'right', constrainWidth: false, isScrollable: true, closeOnClick: false});

var carrCant = 1;

var carrElement = "<li class='collection-item avatar'>" +
    "<img src='https://ss237.liverpool.com.mx/xl/1043934841.jpg' alt='' class='circle'>"+
     "<div class='row'>"+ 
        "<div class='valign-wrapper col s4'><h5>ZapatoTest</h5></div>"+
        "<div id='carrito_menos' class='col s2'><a><i class='tiny material-icons'>expand_less</i></a></div>"+
        "<div class='valign-wrapper col s1'><h5>"+carrCant+"</h5></div>"+
        "<div id='carrito_mas'class='col s2'><a><i class='tiny material-icons'>expand_more</i></a></div>"+
        "<div class='col s2'> <a href='#!' class='secondary-content'><i class='material-icons'>remove_shopping_cart</i></a></div>"+
     "</div>" +
   "</li>";

$("#dropdown_container").append(carrElement);
$("#dropdown_container").append(carrElement);
$("#dropdown_container").append(carrElement);
$("#dropdown_container").append(carrElement);
*/
