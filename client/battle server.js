(function(exportObj) {
	"use strict";
	var serverLoc = window.location.origin+":8079";
	//var serverLoc = "http://sg-ddr0.rhcloud.com:8000";
	var socket = io.connect(serverLoc, {transports: ['websocket']});
	
	var c = console;
	
	socket.once('connect', function() { //Uses "once" instead of "on", because "on" will add event listeners the next time we connect. This happens if the server goes down and comes back up.
		c.log('sent ping @ ' + Math.round(new Date().getTime()/1000));
		socket.emit('ping');
		
		socket.on('pong', function(data) {
			c.log('received pong @ ' + Math.round(new Date().getTime()/1000));
		});
		
		socket.on('print', function(data) {
			c.log('printing', data);
		});
		
		socket.on('snapshot_ships', function(data) {
			myShips = data.myShips;
			myShips.forEach(function(ship) {
				controlledWatchers.forEach(function(watcher) {
					watcher(ship);
				});
			});
		});
		
		socket.emit('set', {foo:1, bar:2}).once('ok', socket.emit.bind(this, 'get', ['foo']));
	});
	
	window.server = socket;
})(window);