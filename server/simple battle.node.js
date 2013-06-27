"use strict"
//To launch: sudo nodejs hello\ worldode.js
//Visit hello world.html to run from the browser.

var port = process.env.OPENSHIFT_NODEJS_PORT || "8078"

var app = require('http').createServer();
var io = require('socket.io').listen(app);
io.set('transports', ['websocket']);
io.set('log level', 2);
var _ = require('underscore');
var c = console;

c.log('Listening on port '+port+'.')
app.listen(port);


//--- Logic ---//

var location = function(x,y,rot) {
	return {x:x||0, y:y||0, rot/*ation*/:rot||0};
}

var crew_member = function(name, race, sex, room_index) {return {
	//__proto__: new location, //Location is implied by room.
	name: name, /*const*/
	number: 0,
	in_room: room_index,
	on_ship: null,
	activity: 'idling',
	target_room: null,
	order: null,
	last_order: null,
	health: 10,
	max_health: 10,
	race: race, /*const*/
	sex: sex, /*const*/
};};
	
var ship_room = function(ship, type, name, x, y) { //Add a 'point' type if room position isn't predetermined.
	if(!type) {throw new Error('No type given for new room.');}
	if(!name) {name = type;}
	//if(typeof is_room != "number") {throw new Error('Bad room number given for new room.');}
	
	var base_room = Object.seal({
		__proto__: new location(x,y),
		name: name,
		type: type, /*const*/
		//number: is_room, /*const*/
		size: 4, /*const*/
		effects: [], //strs in ['fire', 'breach', 'mould', 'ion']
		get crew() {var room = this; return ship.crew.filter(function(crew) {return ship.rooms[crew.in_room] === room;});},
		set crew() {throw new Error('Read-only.');},
		get visible() {return !!(this.crew.length || ship.get_max('telemetry', 'level'))},
		set visible() {throw new Error('Read-only.');},
		gravity: 1,
		atmosphere: { //A pressure of 100 would be 1 atmosphere of pressure here.
			__proto__: null,
			nitrogen:        78.0,
			oxygen:          20.9,
			argon:            0.9,
			carbon_dioxide:   0.03,
			water:            1.0,
			neon:             0.0,
			helium:           0.0,
			methane:          0.0,
			krypton:          0.0,
			hydrogen:         0.0,
			nitrous_oxide:    0.0,
			carbon_monoxide:  0.0,
			xenon:            0.0,
			ozone:            0.0,
			nitrogen_dioxide: 0.0,
			iodine:           0.0,
			ammonia:          0.0,
			temperature:    295.2, //kelvins
			//TODO: Convert pressure to mapping over the keys, instead of being explicit. Make temperature non-mappable.
			get pressure() {return (this.nitrogen + this.oxygen + this.argon + this.carbon_dioxide + this.water + this.neon + this.helium + this.methane + this.krypton + this.hydrogen + this.nitrous_oxide + this.carbon_monoxide + this.xenon + this.ozone + this.nitrogen_dioxide + this.iodine + this.ammonia) / 100},
			set pressure(delta) {this.nitrogen *= delta; this.oxygen *= delta; this.argon *= delta; this.carbon_dioxide *= delta; this.water *= delta; this.neon *= delta; this.helium *= delta; this.methane *= delta; this.krypton *= delta; this.hydrogen *= delta; this.nitrous_oxide *= delta; this.carbon_monoxide *= delta; this.xenon *= delta; this.ozone *= delta; this.nitrogen_dioxide *= delta; this.iodine *= delta; this.ammonia *= delta; this.temperature *= delta/3},
			percentage_of: function(element) {return this[element]/this['pressure']},
		},
	});
	
	var base_system = Object.seal({
		__proto__: base_room,
		level: 1,
		consoles: 1, /*const*/
		power: 1, //MAKE GETTER based on level?
		get max_power() {return this.level},
		set max_power() {throw new Error('Read-only.');},
		life: 1, //MAKE GETTER based on level?
		get max_life() {return this.level},
		set max_life() {throw new Error('Read-only.');},
	});
	
	switch(type) {
		case 'empty':
			return base_room;
		case 'droids':
			return Object.seal({
				__proto__: base_system, 
				bays: 2,  /*const*/
				powermap: Object.seal({__proto__: null, 0:1, 1:0}), 
			});
		case 'shields':
			return Object.seal({
				__proto__: base_system, 
				charge: 1, 
				shield: 'normal',
				get max_charge() {return this.level}, 
				set max_charge() {throw new Error('Read-only.');}, 
				charge_interval: 120, //MAKE GETTER
			});
		case 'engineering':
			return Object.seal({
				__proto__: base_system, 
				consoles: 2,
				charge: 0.0,
				charge_rate: 0.01, //MAKE GETTER
			});
		case 'helm':
			return Object.seal({
				__proto__: base_system, 
				power: 0,
				max_power: 0, /*const*/
				get autopilot_skill() {return this.level*0.25}, 
				set autopilot_skill() {throw new Error('Read-only.');}, 
			});
		case 'medbay':
			return Object.seal({
				__proto__: base_system, 
				heal_interval: 10.0, //MAKE GETTER
			});
		case 'oxygen':
			return Object.seal({
				__proto__: base_system,
				charge_rate: 0.1, //MAKE GETTER
			});
		case 'teleporter':
			return Object.seal({
				__proto__: base_system, 
				charge: 0.0,
				charge_rate: 0.01, //MAKE GETTER
			});
		case 'weapons':
			return Object.seal({
				__proto__: base_system, 
				bays: 3,  /*const*/
				powermap: Object.seal({__proto__: null, 0:1, 1:0, 2:0}), 
			});
		case 'storage':
			var storageCapicityVSLevel = Object.freeze({__proto__: null, 0:0.0, 1:1.0, 2:1.6, 3:2.0});
			return Object.seal({
				__proto__: base_system, 
				consoles: 0,
				get capacity() {return storageCapicityVSLevel[this.level]}, 
				set capacity() {throw new Error('Read-only.');}, 
			});
		case 'doors':
			return Object.seal({
				__proto__: base_system, 
				power: 0,
				max_power: 0, /*const*/
			});
		case 'telemetry':
			return Object.seal({
				__proto__: base_system, 
				consoles: 0,
				power: 0,
				max_power: 0, /*const*/
			});
		default:
			throw new Error('Bad type ('+type+') given for new room.');
	};
};

var team = 0;
var ship = function() {
	var ship = {
		__proto__: new location,
		type: 'prototype', /*const*/
		name: 'The Ship',
		hull_integrety: 8,
		max_hull_integrety: 10,
		augments: [,,,],
		//get visible() {return ship.get_max('telemetry', 'level')}, //This is either handled on a per-room basis, or via the perspective system.
		//set visible() {throw new Error('Read-only.');},
		team: team++,
		
		crew: [
			new crew_member('Alice', 'human', 'female', 0),
			new crew_member('Bob', 'human', 'male', 0),
			new crew_member('Candice', 'human', 'male', 1),
			new crew_member('Dale', 'human', 'male', 1),
		],
	};
	ship.rooms = [
		new ship_room(ship, 'helm', 'Helm', 3, 7),
		new ship_room(ship, 'weapons', 'Jarvis Niedersteiner Memorial Weapons Bay', 3, 4),
		new ship_room(ship, 'engineering', 'Bay 12 - Engineering', 3, 0),
	];
	ship.room_size = {x:6,y:8};
	Object.defineProperty(ship, "get_rooms", {
		get: function() {return function(type) {return ship.rooms.filter(function(room) {return room.type === type});};},
		set: function() {throw new Error('Read-only.');},
		configurable: false,
		enumerable: false,
		//writable: false, //This isn't allowed with get? It complains about a setter. I suspect the node.js defaults aren't to spec, here.
	});
	ship.get_max = function(room_type, property) {
		var rooms = ship.get_rooms(room_type);
		switch(rooms.length) {
			case 0: return 0;
			case 1: return rooms[0][property]
			default: //TODO: This is untested.
				rooms.forEach(function(a) {if(typeof(a[property]) !== "number") {throw new Error('Room property '+property+' is not a number; is ' + a[property] + '.')}});
				return rooms.map(function(a) {return a[property]}).reduce(function(a, b) {return Math.max(a + b)});
		};
	};
	Object.defineProperty(ship, "shields", {
		get: function() {return ship.get_rooms('shields').map(function(room) {return {shield: room.shield, charge: room.charge}});},
		set: function() {throw new Error('Read-only.');},
		configurable: false,
		enumerable: false,
	});
	return ship;
};


//--- Events ---//

io.sockets.on('connection', function(socket) {
	var r = {log: function(data) {socket.emit('print', data)}};
	
	//Temporary code to set up ships at all. This should probably be read from a DB.
	var battle = {
		ships: [new ship(), new ship()],
		frame: 0,
	};
	
	var perspective = {
		my_ships: [battle.ships[0]],
		ally_ships: [],
		other_ships: [battle.ships[1]],
	};
	
	var ships = battle.ships; //Set up rooms.
	ships[1].rooms = [
		new ship_room(ships[1], 'helm', 'The Seat of Power', 3, 6),              //As opposed to The Throne of Thunder, for obvious reasons.
		new ship_room(ships[1], 'weapons', 'Forces Of Evil', 1, 3),              //Oh noes! The FOE are firing on us!
		new ship_room(ships[1], 'engineering', 'Evil Empire Engineering', 3, 1), //Or E³.
		new ship_room(ships[1], 'storage', '', 4, 2),                           //Test that 'no' name given produces the right default.
	];
	ships[1].crew[0].in_room=0;
	ships[1].crew[1].in_room=1;
	ships[1].crew[2].in_room=2;
	ships[1].crew[3].in_room=3;
	
	
	
	socket.on('ping', function() {
		c.log('req:', 'pinged @ ' + Math.round(new Date().getTime()/1000))
		
		//setTimeout(function() { //For testing! It is, indeed, much worse with two seconds of lag.
		//	socket.emit('pong');
		//}, 2000);
		socket.emit('pong');
	});
	
	socket.on('print', function(data) {
		c.log('printing', data);
	});
	
	socket.emit('snapshot_ships', {
		myShips:
			perspective.my_ships.map(function(my_ship) {
				return render_ship(my_ship, 'all', true);
			}),
		enemyShips: [],
		neutralShips: [],
		friendlyShips: [],
	});
	
	//r.log(ships[0].rooms.map(function(room) {return room.visible;})); //Here we are. Next up: filter stuff and send it to the client.
});


//--- Functions ---//

var make_2d_grid = function(size_x, size_y, initial_value) {
	return _.range(size_x).map(function() {return _.range(size_y).map(function() {return initial_value||{}})});
};

//--- Functional Functions ---//

var render_ship = function(s, visiblity_level, reports_to_viewer) { //Ship, visiblity_level.
	var v = Object.create(null); //View of a ship.
	
	v.rooms = make_2d_grid(s.room_size.x, s.room_size.y);
	
	var set_all_effects = false;
	switch(visiblity_level) {
		case 'all': // ['invisible', 'hull', 'rooms', 'crew', 'systems', 'all'])
		s.rooms.forEach(function(rm) {
			var vrm = v.rooms[rm.x][rm.y];
			var interesting_keys = ['effects', 'level', 'life', 'power'];
			if(reports_to_viewer) {
				interesting_keys.push('powermap');
			};
			interesting_keys.forEach(function(key) {
				if(key in rm) {
					vrm[key] = rm[key];
				};
			});
			if('max_charge' in rm) {vrm.maxCharge = rm.max_charge};
			vrm.maxLife = rm.max_life;
			vrm.maxPower = rm.max_power;
		});
		set_all_effects = true;
		case 'systems':
		s.rooms.forEach(function(rm) {
			var vrm = v.rooms[rm.x][rm.y];
			var interesting_keys = ['atmosphere', 'bays', 'capacity', 'charge', 'gravity', 'name', 'type'];
			if(reports_to_viewer) {
				interesting_keys.push('powermap');
			};
			interesting_keys.forEach(function(key) {
				if(key in rm) {
					vrm[key] = rm[key];
				};
			});
			vrm.broken = rm.life <= 0;
			vrm.damaged = rm.life < rm.max_life;
			if(!set_all_effects && _.contains(rm.effects, 'ion')) { //A breach to space is, logically, visible from said space. Which you are in.
				vrm.effects = vrm.effects || [];
				vrm.effects.push('ion');
			};
		});
		case 'crew':
		v.crew = s.crew.map(function(crew) {return render_crew_member(crew);});
		s.crew.forEach(function(crew, index) {
			if(crew.in_room && reports_to_viewer) {
				var rm = s.rooms[crew.in_room];
				var vcrew = v.rooms[rm.x][rm.y].crew = v.rooms[rm.x][rm.y].crew || [];
				vcrew.push(index);
			};
		});
		case 'rooms':
		s.rooms.forEach(function(rm) {
			var vrm = v.rooms[rm.x][rm.y];
			vrm.type = rm.type;
			vrm.crew = vrm.crew || [];
			vrm.effects = vrm.effects || [];
			if(!set_all_effects && _.contains(rm.effects, 'breach')) { //A breach to space is, logically, visible from said space. Which you are in.
				vrm.effects.push('breach');
			};
		});
		case 'hull':
		Object.keys(location()).concat(['hull', 'shields', 'name']).forEach(function(key) {v[key] = s[key]});
		v.hullIntegrety = s.hull_integrety;
		v.maxHullIntegrety = s.max_hull_integrety;
		case 'invisible':
		break;
		default: throw new Error("render_ship doesn't know visibility level '"+visiblity_level+'\'.');
		};
	
	v.rooms = _.contains(['invisible', 'hull'], visiblity_level) ? [] : v.rooms; //Don't give away the size of the ship!
	v.crew = v.crew || []; //Ensure crew is a list, as it may not have been set.
	return v;
};

var render_crew_member = function(crew) {
	var crew_data_to_export = {};
	['name', 'in_room', 'activity', 'target_room', 'health', 'max_health', 'race', 'sex'].forEach(function(key) {
		crew_data_to_export[key] = crew[key];
	});
	return crew_data_to_export;
};