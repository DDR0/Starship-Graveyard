/* jshint node: true, globalstrict: true, smarttabs: true, strict: true, proto: true */
"use strict";

var addr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || "8078";
var sqlAddr = process.env.OPENSHIFT_MYSQL_DB_HOST;
var sqlPort = process.env.OPENSHIFT_MYSQL_DB_PORT;
var USE_DEBUG = !process.env.OPENSHIFT_NODEJS_IP;

var app = require('http').createServer();
var io = require('socket.io').listen(app);
io.set('transports', ['websocket']);
io.set('log level', 2);
var _ = require('underscore');
var sql = require('mysql2');
var db = sql.createConnection(USE_DEBUG ? { user:'test', database:'test'} : { user:'nodejs-sg', database:'sg', host: sqlAddr, port: sqlPort});
var c = io.log; //Has error, warn, info, and debug which is currently disabled by log level 2 because it's ridiculous.

var startTime = Math.round(new Date().getTime()/1000);

c.info('Server listening at '+addr+':'+port+', using '+(USE_DEBUG?'local MySQL database.':'MySQL database connection at '+sqlAddr+':'+sqlPort+'.'));
app.listen(port, addr);

// mysql://$OPENSHIFT_MYSQL_DB_HOST:$OPENSHIFT_MYSQL_DB_PORT/


var available_rooms = {
	__proto__: null,
	'red base': true, 
	'blue base': true,
	'battleground': true,
};
	
io.sockets.on('connection', function(socket) {
	var room = "red base";
	
	var on = function(event_name, callback) {
		socket.on(event_name, function(event_data) {
			c.info('event ' + event_name + ' @ ' + startTime + ' + ' + (Math.round(new Date().getTime()/1000) - startTime) );
			
			//Will serve requests out of order, although sockets delivers in order.
			//NodeJS messes it up anyway by misordering the callbacks, so we might as well test for that.
			USE_DEBUG ? setTimeout(callback, Math.random()*2000, event_data) : callback(event_data);
		});
	};
	
	on('ping', function() {
		socket.emit('pong');
	});
	
	on('set location', function(dest) {
		if(dest && available_rooms[dest]) {
			room = dest;
			socket.emit('set location', true);
			return;
		}
		socket.emit('set location', false);
	});
	
	on('get location', function() {
		socket.emit('get location', room);
	});
	
	var storage = {};
	on('set', function(data) {
		_.extend(storage, data);
		socket.emit('ok');
	});
	on('get', function(keys) {
		socket.emit('print', _.pick(storage, keys));
		socket.emit('ok', _.pick(storage, keys));
	}); 
	
});