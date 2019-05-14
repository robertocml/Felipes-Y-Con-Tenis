//Slider && Select Init
$(document).ready(function() {
  console.log("productDetails script activated");

  $(".slider").slider({ height: 500 });
  $("select").formSelect();

  var productID = getCookie("productID");

  var jsonToSend = {
    productID: productID
  };

  $.ajax({
    url: "/SelectedProduct",
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
      console.log(
        "-------------------------------------------------------SEMIFINAL-----------------------------------Data that was received from the server: " +
          dataReceived.ProductInformation[0].IDProducto +
          " " +
          dataReceived.ProductInformation[0].Nombre
      );
      document.getElementById("productTitle").innerHTML =
        dataReceived.ProductInformation[0].Nombre;
      document.getElementById("productAvailability").innerHTML =
        "Disponibilidad: " + dataReceived.ProductInformation[0].Disponibilidad;
      document.getElementById("productDescription").innerHTML =
        "Descripcion: " + dataReceived.ProductInformation[0].Descripcion;
      document.getElementById("productPrice").innerHTML =
        "Precio: $" + dataReceived.ProductInformation[0].Precio;
      document.getElementById("productID").innerHTML =
        dataReceived.ProductInformation[0].IDProducto;

      //alert("ID: ->" + dataReceived.ProductInformation[0].IDProducto);

      for (i = 0; i < dataReceived.ProductInformation.length; i++) {
        var newElement =
          "<li><img src='" +
          "http://localhost:3000/imagenes/producto" +
          dataReceived.ProductInformation[0].IDProducto +
          ".jpg" +
          "'>" +
          "<div class='caption center-align'><h5 class='teal-text lighten-2'></h5></div></li>";

        //var newElement = '<li><img src="https://ss237.liverpool.com.mx/xl/1043934841.jpg"><div class="caption center-align"><h5 class="teal-text lighten-2">Zapato Foto2</h5></div></li>';
        $("#productPictures").append(newElement);
      }

      $(".slider").slider();

      $("#addToCartBtn").click(function(e) {
        e.preventDefault();
        console.log("addToCartBtn WAS CLICKED");
        addToCart();
      });
    }
  });

  $(".slider").slider();
});

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

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function addToCart() {
  var email = getCookie("email");
  var Cantidad = document.getElementById("quantitySelect").value;
  var IDProducto = document.getElementById("productID").innerHTML;

  console.log("email:" + email + ".");
  console.log("id producto:" + IDProducto + ".");
  console.log("cantidad:" + Cantidad + ".");

  var jsonToSend = {
    IDProducto: IDProducto,
    email: email,
    Cantidad: Cantidad
  };

  $.ajax({
    url: "/CartInsertProduct",
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
      //console.log("Data that was received from the server: Aumento");
      location.reload();
    }
  });
}
