$(document).ready(function() {
  var nameCookie = getCookie("name");

  $(".modal").modal();
  $(".tabs").tabs();
  $(".tooltipped").tooltip();
  CargaProductos();

  console.log("name cookie: " + nameCookie);
  //alert("email cookie: " + emailCookie);
  document.getElementById("saludoAdmin").innerHTML = nameCookie;

  $("#añadirProducto").click(function(e) {
    e.preventDefault();
    console.log("Añadir Producto BUTTON WAS CLICKED");
    AñadeProducto();
  });

  $("#clickFoto").click(function(e) {
    e.preventDefault();
    console.log("Tab Fotografia WAS CLICKED");
    AñadeProducto();
  });

  $("#EliminarProductos").click(function(e) {
    e.preventDefault();
    console.log("elimina productos BUTTON WAS CLICKED");
    eliminaProductos();
  });
});

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

function AñadeProducto() {
  //alert("se añadio el producto!");
  var nombre = $("#nombreProducto").val();
  var precio = $("#precioProducto").val();
  var descripcion = $("#descripcionProducto").val();
  var cantidad = $("#cantidadProducto").val();
  var categoria = $("#categoriaProducto").val();

  var jsonToSend = {
    nombre: nombre,
    precio: precio,
    descripcion: descripcion,
    cantidad: cantidad,
    categoria: categoria
  };

  $.ajax({
    url: "/upload",
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
      //alert("Producto Añadido a la base de datos");
    }
  });
}

function addFotografia() {}

function CargaProductos() {
  $.ajax({
    url: "/ProductsInfo",
    cache: false,
    type: "POST",
    crossDomain: true,
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

      for (i = 0; i < dataReceived.ProductInformation.length; i++) {
        /*var newElement = "<tr id ='" + dataReceived.ProductInformation[i].IDProducto + "'><td><img src='"+ dataReceived.ProductInformation[i].Ubicacion +"' height='100' width='200'></td>" +
                                  "<td>"+dataReceived.ProductInformation[i].Nombre +"</td> <td id='cant'>"+ dataReceived.ProductInformation[i].Cantidad +
                                  "</td>";*/
        var newElement =
          "<tr><td><input type='checkbox' class='filled-in' name='products' value='" +
          dataReceived.ProductInformation[i].IDProducto +
          "'/></td> <td>" +
          dataReceived.ProductInformation[i].Nombre +
          "</td> <td>$" +
          dataReceived.ProductInformation[i].Precio +
          ".00 MXN</td> </tr>";

        $("#product_selection").append(newElement);
      }

      /*
                $('input[type=checkbox]').each(function() {
                if(this.nextSibling.nodeName != 'label') {
                  $(this).after('<label for="'+this.id+'"></label>')
                }
              })*/
    }
  });
}

function eliminaProductos() {
  var productsID = [];

  $('input[name="products"]:checked').each(function() {
    productsID.push(parseInt(this.value));
    var table = document.getElementById("product_selection");
    var row = this.parentNode.parentNode;
    table.deleteRow(row.rowIndex);
  });

  console.log(productsID);

  var jsonToSend = {
    IDarray: productsID,
    dummy: "hola dummy"
  };

  var stringToSend = "";

  for (i = 0; i < productsID.length; i++) {
    stringToSend += "productsID=";
    stringToSend += productsID[i];
    if (i < productsID.length - 1) stringToSend += "&";
  }

  console.log(stringToSend);

  $.ajax({
    url: "/DeleteProducts",
    cache: false,
    type: "POST",
    crossDomain: true,
    data: stringToSend,
    ContentType: "text/plain",
    dataType: "json",

    error: function(errorMessage, textStatus, errorThrown) {
      console.log(errorMessage);
      console.log(textStatus);
      console.log(errorThrown);
      alert("error");
    },

    success: function(dataReceived) {}
  });
}
