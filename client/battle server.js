(function(exportObj) {
	"use strict";
	//var socket = io.connect(window.location.origin+":8079", {transports: ['websocket']});
	var socket = io.connect("http://sg-ddr0.rhcloud.com:8000", {transports: ['websocket']});
	
	var c = console;
	var r = {log: function(data) {socket.emit('print', data);}};
	
	var controlledWatchers = []; //Watch only the ship you control for changes.
	var enemyWatchers = [];
	
	var myShips = [];
	var enemyShips = [];

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
	});

	socket.on('reconnecting', function () {c.log('reconnecting');});
	socket.on('reconnect', function () {c.log('reconnected');});
	socket.on('connect_failed', function () {c.log('connection failure');});
	socket.on('reconnect_failed', function () {c.log('reconnect failed');});
	socket.on('error', function () {c.log('An error has occurred.');});
	
	exportObj.server = Object.create(null);
	exportObj.server.watchAllShips = function(callback) { //Include a path var asap, to watch a variable of a ship.
		controlledWatchers.push(callback);
		enemyWatchers.push(callback);
		return [controlledWatchers.length-1, enemyWatchers.length-1];
	};
	exportObj.server.watchControlledShip = function(callback) {
		controlledWatchers.push(callback);
		return controlledWatchers.length-1;
	};
	exportObj.server.watchEnemyShip = function(callback) {
		enemyWatchers.push(callback);
		return enemyWatchers.length-1;
	};
	Object.freeze(exportObj.server);
})(window);