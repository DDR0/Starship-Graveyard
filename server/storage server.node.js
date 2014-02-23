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


var available_comps = {//Components include rooms and the parts of your ship that have no room for crew but still take up a hex
	__proto__: null,
	'NR base': true, //the NR will be cyan coloured https://docs.google.com/document/d/15puliMOweI3JqverfQZApRqzlr9ZAe3byvWCVrEjiM4/edit
	'Ablu base': true, //the Ablu will be yellow coloured we dont want to be cliche 
	'battleground': true,
};

var users_data = {};

var authUserById = function(uid, pass) {
	var tmpPasses = {
		jarvis: "k93mx",
		david: "k94mx4",
		test: "password",
	};
	return tmpPasses[uid]===pass;
};
	
io.sockets.once('connection', function(socket) {
	c.info('connected…');
	
	var on = function(event_name, callback) {
		c.info('registered ' + event_name);
		socket.on(event_name, function(event_data) {
			c.info('event ' + event_name + ' @ ' + startTime + ' + ' + (Math.round(new Date().getTime()/1000) - startTime) );
			
			//Will serve requests out of order, although sockets delivers in order.
			//NodeJS messes it up anyway by misordering the callbacks, so we might as well test for that.
			USE_DEBUG ? setTimeout(callback, Math.random()*2000, event_data) : callback(event_data);
		});
	};
	
	on('ping', function() {
		c.info('got ping');
		socket.emit('pong');
	});
	
	socket.once('login', function login(event) {
		c.info('login args', arguments);
		if(!authUserById(event.nick, event.pass)) {
			c.info('failed login');
			socket.emit('fail');
			socket.once('login', login); //Wait for the next attempt.
		} else {
			c.info('passed login');
			var nick = event.nick;
			var user_data = users_data[nick] || (users_data[nick] = {
				room: Math.random()<0.5?"red base":"blue base",
				store: {},
			});
		
			on('set location', function(dest) {
				if(dest && available_comps[dest]) {
					user_data.room = dest;
					socket.emit('ok');
					return;
				}
				socket.emit('fail');
			});
			
			on('get location', function() {
				socket.emit('ok', user_data.room);
			});
			
			on('set', function(data) {
				_.extend(user_data.store, data);
				socket.emit('ok');
			});
			on('get', function(keys) {
				socket.emit('ok', _.pick(user_data.store, keys));
			}); 
		
			socket.emit('ok');
		}
	});
	
});