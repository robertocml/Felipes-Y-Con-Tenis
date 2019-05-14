$(document).ready(function() {

	//console.log("SHOP IMAGE INSERTER SCRIPT WAS LOADED");

	$("#image_button").click (function(e){

		e.preventDefault();
		//console.log("IMAGE BUTTON  WAS CLICKED");
		insertImage();
		
	});


});


function insertImage(){

	var newElement = "<div class='col s4'><div class='card'><div class='card-image waves-effect waves-block waves-light'>" + 
	                 "<img class='activator' src='imagenes/productos/producto3/producto3_1.jpg'></div>" + 
	                 "<div class='card-content'><span class='card-title activator grey-text text-darken-4'>Zapato<i class='material-icons right'>more_vert</i></span></div>" + 
	                 "<div class='card-reveal'><span class='card-title grey-text text-darken-4'>Zapato<i class='material-icons right'>close</i></span><p>Here is some more information about this product that is only revealed once clicked on.</p></div></div>";    
	
	$("#product_container").append(newElement);
		





}