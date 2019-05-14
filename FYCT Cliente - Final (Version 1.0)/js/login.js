$(document).ready(function() {

	console.log("LOGIN SCRIPT WAS LOADED");

	$("#login").click (function(e){

		e.preventDefault();
		console.log("LOGIN BUTTON WAS CLICKED");
		sendInfo();
		
	});


});


	

function sendInfo(){

	var email = $("#email").val();
	var password = $("#password").val();
	console.log("password: " + password);
	console.log("email: " + email);
	
	
	var jsonToSend = {
			"email" : email,
			"password" : password
	};

	$.ajax({

			url: "/LoginAction",
			cache : false,
		    type : "POST",
		    crossDomain: true,
			data : jsonToSend,
			ContentType : "text/plain",
			dataType : "json",

			error : function(errorMessage, textStatus, errorThrown) {
		        console.log(errorMessage);
		        console.log(textStatus);
		        console.log(errorThrown);
			},

			success: function(dataReceived){

					console.log("Data that was received from the server: ");


					if (dataReceived.names.length >= 1){
						/*alert("Usuario identificado: " + dataReceived.names[0].Nombres + " " + dataReceived.names[0].ApellidoP + " " +
							   dataReceived.names[0].ApellidoM);*/
						window.location.assign("http://localhost:8080/");

					}
					else
						alert("Las credenciales provistas no coinciden. Por favor escribe tus credenciales para iniciar sesion.");
					   
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