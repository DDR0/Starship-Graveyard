var ship=//this ship is meant for the players ship the enemies ship will be different
{
	centerX:null,
	centerY:null,
	mapX:null,//can be negative
	mapY:null,//can be negative
	energyComp:null,
	storage:{energy:0,fuel:10},
	storagePlan:{energy:0,fuel:10},
	comps:[[]],//both comps and images will become 2D ragged arrays when comps are added
	images:[[]],
	destroyed:[[]],//destroyed contains an array of images representing the ship full of holes
	updateCenter:function()
	{
		//component 
		//updates the centre hex relative to the ship its not super accurate it should really involve squaring sum numbers but it'll work for what we want
		var hex=null;
		var sumX=0;
		var sumY=0;
		var sumZ=0;
		var numOfComps=0;
		for(var x=0;x<comps.length;x++)
		{
			for(var y=0;y<comps[x].length;y++)
			{
				if(comps[x][y]!=null)
				{
					if(comps[x][y].isSolid)
					{
						hex=base.getHex(x,y);
						sumX+=hex.x;
						sumY+=hex.y;
						sumZ+=hex.z;
						numOfComps++;
					}
				}
			}
		}
		sumX=Math.round(sumX/numOfComps);
		sumY=Math.round(sumY/numOfComps);
		sumZ=Math.round(sumZ/numOfComps);
		square=getSquare(sumX,sumY,sumZ);
		centerX=square.x;
		centerY=square.y;
	},
	canGo:function(relativeX,relativeY)
	{//sees if the ship can go to the coordinates and still be on the map, doesn't check for collisions 
		var goable=true;
		for(var f=0;f<this.comps.length;f++)
		{
			console.log('made it this far');
			for(var h=0;h<this.comps[f].length;h++)
			{
			console.log('made it this far');
				if(this.comps[f][h]!=null)
				{
			console.log('made it this far');
					if(this.comps[f][h].isSolid!==false)
					{
			console.log('made it this far');
						if((this.comps[f][h].shipX+relativeX+this.mapX)%2==0)
						{//would it be unprofessional to just see if hexes[f][h] is defined either way this isn't done
			console.log(goable,(f+relativeX+this.mapX),base.battleWidth);
							goable=(goable&&((f+relativeX+this.mapX)<base.battleWidth)&&((h+relativeY+this.mapY)<base.battleHeight));
			console.log(goable);
							goable=(goable&&((f+relativeX+this.mapX)>=0)&&((h+relativeY+this.mapY)>=0));
			console.log(goable);
						}
						else
						{
							goable=(goable&&((f+relativeX+this.mapX)<base.battleWidth)&&((h+relativeY-1+this.mapY)<base.battleHeight));
							goable=(goable&&((f+relativeX+this.mapX)>=0)&&((h+relativeY-1+this.mapY)>=0));
			console.log(goable);
						}
						console.log(goable);
					}
				}
			}
		}
		return goable;
	},
	addComponent:function(newComponent, relativeX, relativeY)
	{
		//adds or replaces a component if the array is too small it is made bigger relativeX and Y can be negative
		var displaceX=0;
		var displaceY=0;
		var newArray=false;
		if(relativeX<0)
		{
			displaceX=relativeX*-1;
			relativeX=0;
			newArrays=true;
		}
		if(relativeY<0)
		{
			displaceY=relativeY*-1;
			relativeY=0;
			newArrays=true;
		}
		if(relativeX>=this.comps.length)
		{
			newArrays=true;
		}
		else if(relativeY>=this.comps[relativeX].length)
		{
			newArrays=true;
		}
		if(newArrays)
		{
			var newComps=new Array(Math.max(this.comps.length+displaceX,relativeX+1));
			var newImages=new Array(newComps.length-this.comps.length+this.images.length);
			var newDestroyed=new Array(newImages.length-this.images.length+this.destroyed.length);
			for(var b=displaceX;b<newComps.length;b++)
			{
				if(b===relativeX)
				{//need to fix this so it handles undefined arrays proper
					newComps[b]=new Array(Math.max(this.comps[b-displaceX].length+displaceY,relativeY+1));
					newImages[b]=new Array(newComps[b].length-this.comps[b].length+this.images[b].length);//just incase we want different sized array who knows
					newDestroyed[b]=new Array(newComps[b].length-this.comps[b].length+this.destroyed[b].length);
					for(var c=0;c<this.comps[b].length;b++)
					{
						newComps[b+displaceX][c+displaceY]=this.comps[b][c];
						newComps[b+displaceX][c+displaceY].shipX=b;
						newComps[b+displaceX][c+displaceY].shipY=c;
						newImages[b+displaceX][c+displaceY]=this.images[b-displaceX][c-displaceY];
						newDestroyed[b+displaceX][c+displaceY]=this.destroyed[b-displaceX][c-displaceY];
					}
				}
				else
				{
					newComps[b]=this.comps[b-displaceX];
					for(var ab=0;ab<newComps[b].length;ab++)
					{
						newComps[b][ab].shipX=b;
					}
					newImages[b]=this.images[b-displaceX];
					newDestroyed[b]=this.images[b-displaceX];
				}
			}
			//if(array undefined
			if(relativeX<displaceX)
			{
				newComps[relativeX]=new Array(relativeY+1);
				newImages[relativeX]=new Array(relativeY+1);
				newDestroyed[relativeX]=new Array(relativeY+1);
			}
			this.images=newImages;
			this.comps=newComps;
			this.destroyed=newDestroyed
		}
		this.comps[relativeX][relativeY]=newComponent;
		newComponent.shipX=relativeX;
		newComponent.shipY=relativeY;
		base.hexes[this.mapX+relativeX][this.mapX+relativeY].compPointer=newComponent;
		console.log(base.hexes[this.mapX+relativeX][this.mapX+relativeY]);
		newComponent.partof=this;
		newComponent.location=base.hexes[this.mapX+relativeX][this.mapY+relativeY];
		if(false)
		{
			this.images[relatvieX][relativeY]=this//need to figure out where the ship images come from
			this.destroyed[relativeX][relativeY]=this
		}
	},
	moveComponent:function(component, relativeX, relativeY)
	{
		var ok=true;
		if(relativeX+component.shipX<0||relativeX+component.shipX>comps.length)
		{
			ok=false;
		}
		else if(relativeY+component.shipY<0||relativeY+component.shipY>comps[relativeX+component.shipX].length)
		{
			ok=false;
		}
		else if(comps[relativeX+component.shipX][relativeY+component.shipY]!=null)
		{
			ok=false;
		}
		else
		{
			removeComponent(component.shipX, component.shipY);
			addComponent(component, relativeX, relativeY)
			component.shipX+=relativeX;
			component.shipY+=relativeY;
		}
		return ok;
	},
	removeComponent:function(relativeX, relativeY)
	{
		//removes the component from the ship but doesn't destroy the component
		//and removes the ship from the component
		//should not be called when destroying a room
		if(this.comps[relativeX][relativeY]!=null)
		{
			this.comps[relativeX][relativeY].location=null;
			this.comps[relativeX][relativeY].partof=null;
			this.comps[relativeX][relativeY].shipX=null;
			this.comps[relativeX][relativeY].shipY=null;
			this.comps[relatvieX][relativeY]=null;
		}
		this.images[relativeX][relativeY]=null;
		this.destroyed[relativeX][relativeY]=nill;
		base.hexes[relativeX+this.mapX][relativeY+this.mapY].shipImage=null;
		base.hexes[relativeX+this.mapX][relativeY+this.mapY].compImage=null;
		base.hexes[relativeX+this.mapX][relativeY+this.mapY].compPointer=null;
		base.hexes[relativeX+this.mapX][relativeY+this.mapY].shipPointer=null;
		base.hexes[relativeX+this.mapX][relativeY+this.mapY].energyImage=null;
		base.hexes[relativeX+this.mapX][relativeY+this.mapY].seeEnergy=false;
		base.hexes[relativeX+this.mapX][relativeY+this.mapY].seeShip=false;
		base.hexes[relativeX+this.mapX][relativeY+this.mapY].seeRoom=false;
		base.hexes[relativeX+this.mapX][relativeY+this.mapY].restack();
	},
	rotate:function(direction, isAbsolute)
	{
		if(isAbsolute)
		{
		}
		else
		{
		}
		this.rotate(direction,isAbsolute);
	},
	translate:function(x,y)
	{
		
		//checks along the ships path and then teleports the ship
	},
	clearImages:function()//should only be used before addImage
	{
		for(var t=0;t<this.images.length;t++)
		{
			for(var u=0;u<this.images.lenght;u++)
			{
				base.hexes[this.mapX+t][this.mapY+u].shipImage=null;
				base.hexes[this.mapX+t][this.mapY+u].compImage=null;
				base.hexes[this.mapX+t][this.mapY+u].compPointer=null;
				base.hexes[this.mapX+t][this.mapY+u].shipPointer=null;
				base.hexes[this.mapX+t][this.mapY+u].energyImage=null;
				base.hexes[this.mapX+t][this.mapY+u].seeEnergy=false;
				base.hexes[this.mapX+t][this.mapY+u].seeShip=false;
				base.hexes[this.mapX+t][this.mapY+u].seeRoom=false;
				base.hexes[this.mapX+t][this.mapY+u].restack();
			}
		}
	},
	drawImages:function()
	{
		for(var z=0;z<this.images.length;z++)
		{
			for(var aa=0;aa<this.images.lenght;aa++)
			{
				if(comp[z][aa].isDestroyed)
					base.hexes[this.mapX+z][this.mapY+aa].shipImage=destoyed[z][aa];
				else
					base.hexes[this.mapX+z][this.mapY+aa].shipImage=images[z][aa];
				base.hexes[this.mapX+z][this.mapY+aa].compImage=this.comps[z][aa];//get image
				base.hexes[this.mapX+z][this.mapY+aa].compPointer=this.comps[z][aa];
				base.hexes[this.mapX+z][this.mapY+aa].shipPointer=this;
				base.hexes[this.mapX+z][this.mapY+aa].energyImage=null;
				base.hexes[this.mapX+z][this.mapY+aa].seeEnergy=true;
				base.hexes[this.mapX+z][this.mapY+aa].seeShip=true;
				base.hexes[this.mapX+z][this.mapY+aa].seeRoom=true;
				base.hexes[this.mapX+z][this.mapY+aa].restack();
			}
		}
	},
	teleport:function(relativeX,relativeY)
	{
		//call clear ship
		this.clearImages();
		this.mapX+=relativeX;
		this.mapY+=relativeY;
		for(var v=0;v<this.comps.length;v++)
		{
			for(var w=0;w<this.comps[v].length;w++)
			{
				console.log('made it this far');
				if(this.comps[v][w]!=null)
				{
					if(this.comps[v][w]===this.comps[v][w].location.compPointer)
						this.comps[v][w].location.compPointer=null;
					else
						console.log(this.comps[v][w],this.comps[v][w].location.compPointer,'fart');
					console.log(this.mapX,this.mapY,relativeY);
					this.comps[v][w].location=base.hexes[v+this.mapX][w+this.mapY];
					base.hexes[v+this.mapX][w+this.mapY].compPointer=this.comps[v][w];
					//collisions should already be checked on the server
				}
			}
		}
		this.drawImages();
	},
	checkStorage:function(name,amount)//checks storage levels
	{
		if(this.storagePlan[name]==undefined)
			return false;
		else
			return -this.storagePlan[name]<=amount;
	},
	changeStorage:function(name,amount)
	{
		var enough=true;
		if(this.checkStorage(name,amount))
		{
			this.forceStorage(name,amount)
		}
		else enough=false;
		return enough;
	},
	forceStorage:function(name,amount)
	{
		if(this.storagePlan[name]==undefined)
		{
			this.storagePlan[name]=amount;
			console.log(this.storagePlan[name]);
		}
		else
		{
			this.storagePlan[name]+=amount;
			console.log(this.storagePlan[name],amount);
		}
	},
	finalizeStorage:function()
	{
		for(var as in this.storage)
			as=0;
		for(var ap in this.storagePlan)
		{
			var maxStorage=0;
			for(var aq=0;aq<this.comps.length;aq++)
			{
				for(var ar;ar<this.comps[aq].length;ar++)
				{
					if(this.comps[aq][ar].maxStorages[ap.name]!=undefined)
						maxStorage+=this.comps[aq][ar].maxStorages[ap.name];
				}
			}
			if(this.storage[ap]==undefined)
				this.storage[ap.name]={name:ap.name,amount:0};
			this.storage[ap.name].amount=Math.min(maxStorage,ap.amount);
		}
		for(var ap=0;ap<this.comps.length;ap++)
		{
			for(var aq=0;aq<this.comps[ap].length;aq++)
			{
				this.comps[ap][aq].storageChanges=[];
			}
		}
	},
}
var simpleFunctions=
{
	move:function(args)
	{
	}
};
function createEngine(index, style, level, mod, durability)
{
	compForCompPurposes=this;
	this.isSelected=false;
	this.isSelected=false;
	this.isSolid=true;//does the component block other comps don't actually know why I have this but I put it in the code
	this.isDestroyed=false;
	this.move='move';//identifier for a move function used with find function
	this.generate='power';//identifier for a generate power function if one existed
	this.only=10;//actions ranked only with stop all other planned actions except for passive
	this.primary=8;//actions with a rank of primary allow for few other things to be done
	//I'm leaving it open for other ranks
	this.aux=1;//aux actions don't take much form the component so it can also do a primary action
	this.passive=0;//passive actions do not require anything from the component
	//More complex components will have several actions that can be done simultaneously rank determines actions that can be used
	//together. For example if you imagine a bedroom was a component you could sleep in your room but only sleep if you wanted
	//to invite a friend over you would have to cancel your sleep plans. Other actions can be done in the room besides hanging out
	//you and your friend could listen to music. You cannot, however, listen to music and sleep. You can do passive actions like
	//charging your phone to while you are sleeping.
	this.maxRank=10;//no two actions can have a sum of ranks that exceed the maxRank
	this.attributes=
	{
		heatBalance:true,
	};
	this.crew=[];//the actions that are planned to be executed when the turn is ended.
	this.thrustTypes=[style];//would you like this to be a string?
	this.plannedActions=[];//the crew that is currently in the component
	this.server=
	{
		idel:[],
		always:[],
		afterIdel:[],
		afterAlways:[],
		after:null,
		afterMove:[],
		afterAction:[],
	}//will be set back to null to keep most of the functions on the server
	this.server.base=//the normal stats, what the comp becomes after it is repaired
	{
		condition:durability,//how much damage the engine can take before it is nolonge there
		funcional:durability,//how much damage before the engine is completely useless
		distance:level,//how far the ship can go each turn
		stress:0,//stress is increased the more the engine is worked
		force:level*10,//how much mass the engine can push 
		energy:level*10,
		//It should be noted that an engine will still only move a ship only one space a turn even if it can move another ship 10
		//times as big one space this is related to a rather interesting physical phenomenon--hey is that free food behind you!
	}
	this.setToBase=function()//sets all the components stats to there base
	{
		for(stat in this.server.base)
		{
			this[stat]=this.server.base[stat];
		}
	}
	this.actionFunctions=[]//cant really think of a better way to do this
	this.actionFunctions[this.move]=base.simpleEngineMove,
	this.storageFunctions=[]
	this.storageFunctions[this.move]=base.simpleEngineMoveStorage;
	this.setToTarget=function()//gets everything ready to selected the target there is a whole lot to get ready trust me
	{
		base.listenerStack.push(compForCompPurposes.startTarget);
		//add images
	}
	this.startTarget=function(pixelX,pixelY)//sets the target and cancels the target setting or just cancels the target setting
	{
		var selectedHex=base.hexify(pixelX,pixelY);
		selectedHex=base.hexes[selectedHex.x][selectedHex.y];
		compForCompPurposes.target(selectedHex);
		compForCompPurposes.cancel();
	}
	this.target=function(selected)
	{
		var succesful=false;
					console.log('made it this far');
		if(this.partof.checkStorage('fuel',-2))//checking fuel
		{
					console.log('made it this far');
			if(this.partof.canGo(selected.coordinateX-this.location.coordinateX,selected.coordinateY-this.location.coordinateY))//keep it on the map
			{
						console.log(this.location.getDistance(selected.coordinateX,selected.coordinateY));
				if(this.location.getDistance(selected.coordinateX,selected.coordinateY)<=this.distance)//x is always before y
				{	
					console.log('made it this far');
					this.partof 
					this.selected=selected;
					succesful=true;
					console.log(selected);
					//this.imagePointer=pictures.arrow[0][getDirection(selected)];//pictures will have several generic engines
					//location.targets.push(this.imagePointer); 
					console.log(this.location);
					var relativeX=selected.coordinateX-this.location.coordinateX;
					var relativeY=selected.coordinateY-this.location.coordinateY;
					console.log(relativeX,relativeY,selected.coordinateX,this.location.coordinateX);
					planned=new actionInfo(this.primary,this.move,this);
					planned.args=[this,relativeX,relativeY];//other stuff
					planned.storageEffects.fuel=-2;
					this.storageFunctions[this.move](this.partof);
					this.planAction(planned);
					plan.movement.push(planned);
				}	
			}	
		}
		return succesful;
	}
	this.planAction=function(newAction)
	{
		console.log('made it this far');
		for(var ap=0;ap<this.plannedActions.length;ap++)
		{
			console.log(newAction.rank,this.plannedActions[ap].rank);
			if((newAction.rank+this.plannedActions[ap].rank)>this.maxRank)
			{
				console.log('compared happend');
				this.plannedActions[ap].reverseStorage();
				plan.removeAction(this.plannedActions[ap]);
				this.plannedActions.splice(ap,1);
				ap--;
				//also remove images
			}
		}
		this.plannedActions.push(newAction);
	}
	this.cancel=function()//stops the targeting process allowing the user to do other things
	{
		base.listenerStack.pop()//may need to do something fancy in future but for now we are treating it like a stack
		//remove images
	}
	this.clear=function()
	{
		for(var av=0;av<this.plannedActions.length;av++)//I hope this works the way I think
		{
			this.plannedActions[av].reverseStorage();
			plan.removeAction(this.plannedActions[av]);
			//also remove images
		}
		this.plannedActions=null;
	}
	this.server.doHeatDamage=[//I hope this works
	function(damageArray)
	{
		if(this.attributes.heatBalance>0)//if it is >0 it means electricity is conducted easily
		{
			damageArray=[Math.sum(damagArray)];
			//need to finish this bit
		}
		for(var ag=0;ag<damageArray.length;ag++)
		{
			this.enviroment.heat(damageArray[ag]);
			this.condition-=Math.abs(damageArray[ag]);
		}
	}]
	this.server.doRadDamage=[
	function(damageArray)
	{//comps for the most part will be immune to radiation
		for(var ad=0;ad<crew.length;ad++)
		{
			this.crew[ad].doDamage('rad',damageArray);
		}
	}]
	this.server.doElectDamage=[
	function(damageArray)//this will only exist on the server version of the comp
	{
		if(this.attributes.electBalance>0)//if it is >0 it means electricity is conducted easily
		{
			damageArray=[Math.sum(damagArray)];
			//need to finish this bit
		}
		for(var ac=0;ac<damageArray.length;ac++)
		{
			for(var ah=0;ah<crew.length;ad++)
			{
				this.crew[ah].doDamage('rad',damageArray[ac]);
			}
			this.condition-=Math.abs(damageArray[ac]);//abs because elect damage can be positive or negative
			this.force-=Math.abs(damageArray[ac]);
			if(Math.abs(damageArray[ac])>10)
			{
				this.distance-=1;
			}
		}
	}]
	this.actionList=[{
		name:"Move to",
		action:function()
			{
				compForCompPurposes.setToTarget()
				//also do something with fuel
			}
	}]
	switch(mod)
	{
		case 1://this is where the models will be different
		{
		}
	}
	switch(index)
	{
		case 2://give a little room for other engine variants
		this.server.afterAction.push(function()
		{
			if(this.condition<this.server.base.codition)
			{
				for(var aj=0;aj<this.crew.lenght;aj++)
					crew[aj].doDamage('rad',this.server.base.condition-this.codition);
			}
		})
		this.attributes.radCore=true;
		this.server.base.power=0;
		this.power=0;
		this.storageFunctions[this.genterate]=base.simpleEngineGenerateStorage;
		this.name='NR Engine 2';
		//add attributes
		this.generateEnergy=function()//sets up the generateEnergy action
		{
			//should check storage levels first
			if(compForCompPurposes.partof.checkStorage('fuel',-1));
			{
				var planned=new actionInfo(compForCompPurposes.primary,this.generate,compForCompPurposes)
				planned.storageEffects.fuel=-1;
				planned.storageEffects.energy=compForCompPurposes.force;
				this.storageFunctions[this.generate](this.partof);
				compForCompPurposes.planAction(planned);
			}
		}
		this.actionList.push({name:'Generate Energy',action:this.generateEnergy});
	}
	this.setToBase();
	return this;
}
var mainShip=ship;
ship.mapX=19;
ship.mapY=19;
ship.addComponent(new createEngine(2,1,1,0,10),0,0);
var comp=ship.comps[0][0];
var newStorage={name:'energy',amount:1};
ship.storagePlan.fuel=10;