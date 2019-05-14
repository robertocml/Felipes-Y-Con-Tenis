//Trigger del DropDown
//Se manda la informacion al server para que pueda desplegar los articulos
$(".dropdown-trigger").dropdown({
  coverTrigger: false,
  alignment: "right",
  constrainWidth: false,
  isScrollable: true,
  closeOnClick: false
});
var subtotalGeneral;

$(document).ready(function() {
  console.log("CartJS SCRIPT WAS LOADED");

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
      subtotalGeneral = 0;

      for (i = 0; i < dataReceived.CartInformation.length; i++) {
        subtotalGeneral =
          subtotalGeneral +
          dataReceived.CartInformation[i].Cantidad *
            dataReceived.CartInformation[i].Precio;
        var subtotalProducto =
          dataReceived.CartInformation[i].Cantidad *
          dataReceived.CartInformation[i].Precio;

        var newElement =
          "<tr id ='" +
          dataReceived.CartInformation[i].IDProducto +
          "carrito'><td><img src='" +
          "http://localhost:3000/imagenes/producto" +
          dataReceived.CartInformation[i].IDProducto +
          ".jpg" +
          "' height='100' width='200'></td>" +
          "<td>" +
          dataReceived.CartInformation[i].Nombre +
          "</td> <td id='cant'>" +
          dataReceived.CartInformation[i].Cantidad +
          "</td> <td> <div><a onclick='aumentaCant(" +
          dataReceived.CartInformation[i].IDProducto +
          ")' href='#!'><i class='tiny material-icons left'>expand_less</i></a></div>" +
          "<div><a onclick='disminuyeCant(" +
          dataReceived.CartInformation[i].IDProducto +
          ")' href='#!'><i class='tiny material-icons left'>expand_more</i></a></div>" +
          "</td> <td>$" +
          subtotalProducto +
          ".00</td>" +
          "<td><a onclick='remove(" +
          dataReceived.CartInformation[i].IDProducto +
          ", this.parentNode.parentNode.rowIndex, this.parentNode.previousSibling.innerHTML, \"carrito\")' id='idz' class='waves-effect waves-light btn'><i id='idz' class='material-icons bt'>remove_shopping_cart</i></a></td> </tr>";

        var newDropdownElement =
          "<li id='" +
          dataReceived.CartInformation[i].IDProducto +
          "dropdown' class='collection-item avatar'>" +
          "<img src=" +
          "http://localhost:3000/imagenes/producto" +
          dataReceived.CartInformation[i].IDProducto +
          ".jpg" +
          " alt='' class='circle'>" +
          "<div class='row'>" +
          "<div class='valign-wrapper col s4'><h5>" +
          dataReceived.CartInformation[i].Nombre +
          "</h5></div>" +
          "<div id='carrito_menos' class='col s2'><a onclick='aumentaCant(" +
          dataReceived.CartInformation[i].IDProducto +
          ")' href='#!'><i class='tiny material-icons'>expand_less</i></a></div>" +
          "<div class='valign-wrapper col s1'><h5>" +
          dataReceived.CartInformation[i].Cantidad +
          "</h5></div>" +
          "<div id='carrito_mas'class='col s2'><a onclick='disminuyeCant(" +
          dataReceived.CartInformation[i].IDProducto +
          ")' href='#!'><i class='tiny material-icons'>expand_more</i></a></div>" +
          "<div class='col s2'> <a onclick='remove(" +
          dataReceived.CartInformation[i].IDProducto +
          ",\"\", \"\",\"dropdown\")' href='#!' class='secondary-content'><i class='material-icons'>remove_shopping_cart</i></a></div>" +
          "</div>" +
          "</li>";

        $("#product_container").append(newElement);
        $("#dropdown_container").append(newDropdownElement);
      }

      var newSubtotal =
        "<tr><td></td><td></td><td></td> <td>Total: $</td><td id='subtotal'>" +
        subtotalGeneral +
        ".00 MXN</td><td></td></tr>";
      $("#product_container").append(newSubtotal);
    }
  });
});

// Ahorita estaré haciendo esto y lo de cantidad
function remove(IDProducto, renglonIndex, costoEliminado, tipo) {
  var email = getCookie("email");

  console.log("index del renglon: " + renglonIndex);
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
      if (tipo == "carrito") {
        console.log("Data that was received from the server: ");
        var table = document.getElementById("product_container");
        table.deleteRow(renglonIndex);
        var dropdownItem = document.getElementById(IDProducto + "dropdown");
        dropdownItem.parentNode.removeChild(dropdownItem);

        var subtotalElement = document.getElementById("subtotal");
        costoEliminado = costoEliminado.substring(1, costoEliminado.length - 3);
        console.log("Costo eliminado: " + costoEliminado);
        subtotalGeneral = subtotalGeneral - costoEliminado;
        subtotalElement.innerHTML = subtotalGeneral + ".00 MXN";
        //location.reload();
        //$("#tr").load(location.href + " #tr");
      } else if (tipo == "dropdown") {
        var row = document.getElementById(IDProducto + "carrito");
        var dropdownItem = document.getElementById(IDProducto + "dropdown");
        dropdownItem.parentNode.removeChild(dropdownItem);
        costoEliminado = row.cells[4].innerHTML;

        var subtotalElement = document.getElementById("subtotal");
        costoEliminado = costoEliminado.substring(1, costoEliminado.length - 3);
        console.log("Costo eliminado: " + costoEliminado);
        subtotalGeneral = subtotalGeneral - costoEliminado;
        subtotalElement.innerHTML = subtotalGeneral + ".00 MXN";

        var table = document.getElementById("product_container");
        table.deleteRow(row.rowIndex);

        //row.parentNode.deleteRow(row.rowIndex);
      }
    }
  });
}

function aumentaCant(IDProducto) {
  var email = getCookie("email");

  var row = document.getElementById(IDProducto + "carrito");
  var dropdownItem = document.getElementById(IDProducto + "dropdown");

  var Cantidad = parseInt(row.cells[2].innerHTML);

  var jsonToSend = {
    IDProducto: IDProducto,
    email: email,
    Cantidad: Cantidad
  };

  //console.log("Cantidad actual carrito: " + Cantidad);
  //console.log("Cantidad actual dropdown: " + dropdownItem.childNodes[1].childNodes[2].childNodes[0].innerHTML);

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
      dropdownItem.childNodes[1].childNodes[2].childNodes[0].innerHTML =
        Cantidad + 1;
      row.cells[2].innerHTML = Cantidad + 1;

      var subtotalElement = document.getElementById("subtotal");
      var precio = row.cells[4].innerHTML;
      precio = parseInt(precio.substring(1, precio.length - 3));
      var precioUnitario = precio / Cantidad;
      var nuevoPrecio = precioUnitario + precio;
      row.cells[4].innerHTML = "$" + nuevoPrecio + ".00";
      subtotalGeneral = subtotalGeneral + precioUnitario;
      subtotalElement.innerHTML = subtotalGeneral + ".00 MXN";

      //location.reload();
    }
  });
}

function disminuyeCant(IDProducto) {
  var email = getCookie("email");

  var row = document.getElementById(IDProducto + "carrito");
  var dropdownItem = document.getElementById(IDProducto + "dropdown");

  var Cantidad = parseInt(row.cells[2].innerHTML);

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
      //location.reload();

      dropdownItem.childNodes[1].childNodes[2].childNodes[0].innerHTML =
        Cantidad - 1;
      row.cells[2].innerHTML = Cantidad - 1;

      var subtotalElement = document.getElementById("subtotal");
      var precio = row.cells[4].innerHTML;
      precio = parseInt(precio.substring(1, precio.length - 3));
      var precioUnitario = precio / Cantidad;
      var nuevoPrecio = precio - precioUnitario;
      row.cells[4].innerHTML = "$" + nuevoPrecio + ".00";
      subtotalGeneral = subtotalGeneral - precioUnitario;
      subtotalElement.innerHTML = subtotalGeneral + ".00 MXN";

      if (Cantidad - 1 <= 0) {
        dropdownItem.parentNode.removeChild(dropdownItem);
        var table = document.getElementById("product_container");
        table.deleteRow(row.rowIndex);
      }
    }
  });
}

//
