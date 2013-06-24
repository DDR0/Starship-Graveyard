(function() { //We put the code in a function, and then call the function, to avoid polluting the global namespace with our variables. There is no block-level scope in JS yet, only function-level scope.
	"use strict";
	//Instantiate a new create.js "stage". If you wanted to use the native commands, you'd go var ctx = $('#grid-display')[0].getContext('2d') or something like that.
	var stage = new createjs.Stage($('#grid-display')[0]);
	
	//Create a demo shape for our stage. It moves! :D
	var shape = new createjs.Shape();
	var g = shape.graphics;
	g.setStrokeStyle(1);
	g.beginStroke(createjs.Graphics.getRGB(0,0,0));
	g.beginFill(createjs.Graphics.getRGB(255,0,0));
	g.drawCircle(0,0,30);
	shape.x = 45;
	shape.y = 300;
	stage.addChild(shape);
	
	//Subscribe to the 'tick' event create.js gives us. This is roughly equivalent to the native window.setInterval().
	createjs.Ticker.addEventListener("tick", function(event) {
		shape.x += 2;
		stage.update();
	});
	
	//Now that we're loaded, we'll hide the loading bar. To remove it, we would use .css('display', 'none').
	$('#loading-indicator').css('opacity', '0');
	
	//We will watch our ship for changes (such as it being loaded). We will just print the ship data to console, for now.
	server.watchControlledShip(function(ship) {console.log('got ship', ship)})
})();