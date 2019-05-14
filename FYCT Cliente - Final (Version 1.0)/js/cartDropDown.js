//Trigger del DropDown
//Se manda la informacion al server para que pueda desplegar los articulos
$(".dropdown-trigger").dropdown({
  coverTrigger: false,
  alignment: "right",
  constrainWidth: false,
  isScrollable: true,
  closeOnClick: false
});

$(document).ready(function() {
  console.log("cartDropDown SCRIPT WAS LOADED");

  //var email = "roberto@mail.com";
  var email = getCookie("email");

  var jsonToSend = {
    email: email
  };

  $.ajax({
    url: "/CartAction",
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

      //alert("entro el for cantidad de informacion:" + dataReceived.CartInformation.length);
      var subtotalGeneral = 0;

      for (i = 0; i < dataReceived.CartInformation.length; i++) {
        var newDropdownElement =
          "<li class='collection-item avatar'>" +
          "<img src=" +
          "http://localhost:3000/imagenes/producto" +
          dataReceived.CartInformation[i].IDProducto +
          ".jpg" +
          " alt='' class='circle'>" +
          "<div class='row'>" +
          "<div class='valign-wrapper col s4'><h5>" +
          dataReceived.CartInformation[i].Nombre +
          "</h5></div>" +
          "<div id='carrito_menos' class='col s2'><a onclick=aumentaCant(" +
          dataReceived.CartInformation[i].IDProducto +
          "," +
          dataReceived.CartInformation[i].Cantidad +
          ") href='#!'><i class='tiny material-icons'>expand_less</i></a></div>" +
          "<div class='valign-wrapper col s1'><h5>" +
          dataReceived.CartInformation[i].Cantidad +
          "</h5></div>" +
          "<div id='carrito_mas'class='col s2'><a onclick=disminuyeCant(" +
          dataReceived.CartInformation[i].IDProducto +
          "," +
          dataReceived.CartInformation[i].Cantidad +
          ") href='#!'><i class='tiny material-icons'>expand_more</i></a></div>" +
          "<div class='col s2'> <a onclick=remove(" +
          dataReceived.CartInformation[i].IDProducto +
          ") href='#!' class='secondary-content'><i class='material-icons'>remove_shopping_cart</i></a></div>" +
          "</div>" +
          "</li>";

        $("#dropdown_container").append(newDropdownElement);
      }
    }
  });
});

// Ahorita estaré haciendo esto y lo de cantidad
function remove(IDProducto) {
  var email = getCookie("email");
  //alert("Seguro que deseas eliminar este Articulo de tu Carrito de Compra? ID:" + IDProducto + email);

  var jsonToSend = {
    IDProducto: IDProducto,
    email: email
  };

  $.ajax({
    url: "/CartActionRemove",
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
      location.reload();
      //$("#tr").load(location.href + " #tr");
    }
  });
}

function aumentaCant(IDProducto, Cantidad) {
  var email = getCookie("email");

  var jsonToSend = {
    IDProducto: IDProducto,
    email: email,
    Cantidad: Cantidad
  };

  //alert("aumentando cantidad jsoooooooooooon");

  $.ajax({
    url: "/CartActionAddCant",
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
      console.log("Data that was received from the server: Aumento");
      location.reload();
    }
  });
}

function disminuyeCant(IDProducto, Cantidad) {
  var email = getCookie("email");

  var jsonToSend = {
    IDProducto: IDProducto,
    email: email,
    Cantidad: Cantidad
  };

  //alert("aumentando cantidad jsoooooooooooon");

  $.ajax({
    url: "/CartActionSubstractCant",
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
      console.log("Data that was received from the server: Aumento");
      location.reload();
    }
  });
}
