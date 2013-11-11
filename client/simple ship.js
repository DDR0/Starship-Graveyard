var ship=//this ship is meant for the players ship the enemies ship will be different
{
	centerX:null,
	centerY:null,
	mapX:null,//can be negative
	mapY:null,//can be negative
	energyComp:null,
	comps:[],//both comps and images will become 2D ragged arrays when comps are added
	images:[],
	destroyed:[],//destroyed contains an array of images representing the ship full of holes
	updateCenter:function()
	{
		//component 
		//updates the centre hex relative to the ship its not super accurate it should really involve squaring sum numbers but it'll work for what we want
		var hex;
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
					if(comps[x][y].isSolid
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
		sumX=math.round(sumX/numOfComps);
		sumY=math.round(sumY/numOfComps);
		sumZ=math.round(sumZ/numOfComps);
		square=getSquare(sumX,sumY,sumZ);
		centerX=square.x;
		centerY=square.y;
	},
	canGo:function(var newX, var newY)
	{//sees if the ship can go to the coordinates and still be on the map, doesn't check for collisions 
		var goable=true
		for(var f=0;f<comps.length;f++)
		{
			for(var h=0;h<comps[f].length;h++)
			{
				if(comps[f][h]!=null)
				{
					if(comps[f][h].isSolid)
					{
						if((comps[f][h].shipX+relativeX+mapX)%2==0)
						{//would it be unprofessional to just see if hexes[f][h] is defined either way this isn't done
							goable=goable&&((comps[f][h].shipX+relativeX+shipX)<base.battleWidth)&&((comps[f][h].shipY+relativeY);
						}
						else
						{
							goable=goable&&(comps[f][h].shipX+relativeX)&&(comps[f][h].shipY+relativeY-1);
						}
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
		if(relativeX>=comps.length)
		{
			newArrays=true;
		}
		else if(relativeY>=comps[relativeX].length)
		{
			newArrays=true;
		}
		if(newArrays)
		{
			var newComps=new array(math.max(comps.length+displaceX,relativeX+1));
			var newImages=new array(newComps.length-comps.length+images.length);
			var newDestroyed=new array(newImages.length-images.length+destroyed.length);
			for(var b=displaceX;b<newComps.length;b++)
			{
				if(b===relativeX)
				{
					newComps[b]=new array(math.max(comps[b].length+displaceY,relativeY+1));
					newImages[b]=new array(newComps[b].length-comps.length[b]+images.length[b]);
					newDestroyed[b]=new array(newImages[b].length-comps.length[b]+images.length[b]);
					for(var c=displaceY;c<newComps[b].length;b++)
					{
						newComps[b][c]=comps[b-displaceX][c-displaceY];
						newComps[b][c].shipX=b;
						newComps[b][c].shipY=c;
						newImages[b][c]=images[b-displaceX][c-displaceY];
						newDestroyed[b][c]=destroyed[b-displaceX][c-displaceY];
					}
				}
				else
				{
					newComps[b]=comps[b-displaceX];
					for(var ab=0;ab<newComps[b].length;ab++)
					{
						newComps[b][ab].shipX=b;
					}
					newImages[b]=images[b-displaceX];
					newDestroyed[b]=images[b-displaceX];
				}
			}
			if(relativeX<displaceX)
			{
				newComps[relativeX]=new Array(relativeY+1);
				newImages[relativeX]=new Array(relativeY+1);
				newDestroyed[relativeX]=new Array(relativeY+1);
			}
			images=newImages;
			comps=newComps;
			destroyed=newDsstroyed
		}
		comps[relativeX][relativeY]=newComponent;
		newComponent.shipX=relativeX;
		newComponent.shipY=relativeY;
		images[relatvieX][relativeY]=//need to figure out where the ship images come from
		destroyed[relativeX][relativeY]=
	},
	moveComponent:function(component, relativeX, relativeY)=
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
			addComponent(component, relativeX+component.shipX, relativeY+component.shipY)
			removeComponent(component.shipX, component.shipY);
			component.shipX+=relativeX;
			component.shipY+=relativeY;
		}
		return ok;
	},
	removeComponent:function(relativeX, relativeY)=
	{
		//removes the component from the ship but doesn't destroy the component
		//should not be called when destroying a room
		comps[relatvieX][relativeY]=null;
		images[relativeX][relativeY]=null;
		destroyed[relativeX][relativeY]=nill;
		base.hexes[relativeX+mapX][relativeY+mapY].shipImage=null;
		base.hexes[relativeX+mapX][relativeY+mapY].compImage=null;
		base.hexes[relativeX+mapX][relativeY+mapY].compPointer=null;
		base.hexes[relativeX+mapX][relativeY+mapY].shipPointer=null;
		base.hexes[relativeX+mapX][relativeY+mapY].energyImage=null;
		base.hexes[relativeX+mapX][relativeY+mapY].seeEnergy=false;
		base.hexes[relativeX+mapX][relativeY+mapY].seeShip=false;
		base.hexes[relativeX+mapX][relativeY+mapY].seeRoom=false;
		base.hexes[relativeX+mapX][relativeY+mapY].restack();
	},
	rotate:function(x,y)=
	{
		this.rotate(x,y);
	},
	translate:function(x,y)=
	{
		//checks along the ships path and then teleports the ship
	},
	clearImages;function()//should only be used before addImage
	{
		for(var t=0;t<images.length;t++)
		{
			for(var u=0;u<images.lenght;u++)
			{
				base.hexes[mapX+t][mapY+u].shipImage=null;
				base.hexes[mapX+t][mapY+u].compImage=null;
				base.hexes[mapX+t][mapY+u].compPointer=null;
				base.hexes[mapX+t][mapY+u].shipPointer=null;
				base.hexes[mapX+t][mapY+u].energyImage=null;
				base.hexes[mapX+t][mapY+u].seeEnergy=false;
				base.hexes[mapX+t][mapY+u].seeShip=false;
				base.hexes[mapX+t][mapY+u].seeRoom=false;
				base.hexes[mapX+t][mapY+u].restack();
			}
		}
	},
	drawImages;function()
	{
		for(var z=0;z<images.length;z++)
		{
			for(var aa=0;aa<images.lenght;aa++)
			{
				if(comp[z][aa].isDestroyed
					base.hexes[mapX+z][mapY+aa].shipImage=destoyed[z][aa];
				else
					base.hexes[mapX+z][mapY+aa].shipImage=images[z][aa];
				base.hexes[mapX+z][mapY+aa].compImage=comps[z][aa];
				base.hexes[mapX+z][mapY+aa].compPointer=comps[z][aa];
				base.hexes[mapX+z][mapY+aa].shipPointer=this;
				base.hexes[mapX+z][mapY+aa].energyImage=null;
				base.hexes[mapX+z][mapY+aa].seeEnergy=true;
				base.hexes[mapX+z][mapY+aa].seeShip=true;
				base.hexes[mapX+z][mapY+aa].seeRoom=true;
				base.hexes[mapX+z][mapY+aa].restack();
			}
		}
	}
	teleport:function(relativeX,relativeY)=
	{
		this.clearImages();
		this.mapX+=relativeX;
		this.mapY+=relativeY;
		for(var v=0;v<comps.length;v++)
		{
			for(var w=0;w<comps[v].lenth;w++)
			{
				if(comps[v][w]!=null)
				{
					comps[v][w].hex=hexes[v+mapX][w+mapY];
					//collisions should already be checked on the server
				}
			}
		}
		this.drawImages();
	},
}
function createEngine(index, style, level, mod, durability)
{
	this.isSelected=false;
	this.isSelected=false;
	this.isSolid=true;//does the component block other comps don't actually know why I have this but I put it in the code
	this.isDestroyed=false;
	this.attributes.heatBalance=true;
	this.crew=[];
	this.base=//the normal stats, what the comp becomes after it is repaired
	{
		condition:durability,//how much damage the engine can take
		distance:level,//how far the ship can go each turn
		stress:0,//stress is increased the more the engine is worked
		force:level*10,//how much mass the engine can push 
		energy:level*10,
		//It should be noted that an engine will still only move a ship only one space a turn even if it can move another ship 10
		//times as big one space this is related to a rather interesting physical phenomenon--hey is that free food behind you!
	}
	this.current=this.base//need to be careful with this
	this.thrustType=style;//would you like this to be a string?
	this.target=function(selected)
	{
		this.partof.clearStorage(this);
		var succesful=false;
		if(this.partof.changeStorage('energy',this.current.energy,this));//returns false if there isn't enough energy
		if(this.location.getDistance(selected.coordinateX,selected.coordinateY)<=this.power)//x is always before y
		{
			this.selected=selected;
			succesful=true;
			this.imagePointer=pictures.arrow[0][getDirection(selected);//pictures will have several generic engines
			location.targets.push(imagePointer]; 
			var relativeX=selected.coordinateX-this.coordinateX;
			var relativeY=selected.coordinateY-this.coordinateY;
			this.moveFunction.comp=this;
			this.moveFunction.func=function() {
				partof.teleport(relativeX,relativeY);
				if(this.comp.attributes.selfPatch)
				{
					if(this.comp.current.force<this.comp.base.force)
					{//this is to correct ion damage but I may need to improve how corrections are done
						this.comp.current.force++;
					}
					if(this.comp.current.distance<this.comp.base.distance)
					{
						this.comp.current.distance++;
					}
				}
				if(this.comp.attributes.radCore)
				{
					for(var af=0;af<crew.length;af++)
					{
						this.comp.crew[af].doDamage('rad', this.comp.base.distance*(this.comp.base.condition-this.comp.current.condition));
					}
				}
				else
				{
					this.comp.enviroment.heat(this.comp.base.condition-this.comp.current.condition);
				}
			};
			plan.engines.push(this.moveFunction);
		}
		return succesful;
	}
	this.clear()
	{
		this.partof.clearStorage(this);
		var index=location.targets.indexOf(this.imagePointer);
		if(index!=-1)//-1 means its already gone
			if(location.targets.[index-1].comp===this)
				location.targets.splice(index,1);
		index=plan.engine.indexOf(moveFunction);
		if(index!=-1)
			plan.engine.splice(indes,1);
	}
	this.clearTarget=function()
	{
		this.clear();
	}
	this.doHeatDamage=function(damageArray)
	{
		if(this.attributes.heatBalance>0)//if it is >0 it means electricity is conducted easily
		{
			damageArrayu=[math.sum(damagArray)];
			//need to finish this bit
		}
		for(var ag=0;ag<damageArray.length)
		{
			this.enviroment.heat(damageArray[ag]);
			this.current.condition-=math.abs(damageArray[ag]);
		}
	}
	this.doRadDamage=function(damageArray)
	{//comps for the most part will be immune to radiation
		for(var ad=0;ad<crew.length;ad++)
		{
			this.crew[ad].doDamage('rad',damageArray);
		}
	}
	this.doElectDamage=function(damageArray)//this will only exist on the server version of the comp
	{
		if(this.attributes.electBalance>0)//if it is >0 it means electricity is conducted easily
		{
			damageArrayu=[math.sum(damagArray)];
			//need to finish this bit
		}
		for(var ac=0;ac<damageArray.length;ac++)
		{
			for(var ah=0;ah<crew.length;ad++)
			{
				this.crew[ah].doDamage('rad',damageArray[ac]);
			}
			this.current.condition-=math.abs(damageArray[ac]);//abs because elect damage can be positive or negative
			this.current.force-=math.abs(damageArray[ac]);
			if(math.abs(damageArray[ac])>10))
			{
				this.current.distance-=1;
			}
		}
	}
	switch(mod)
	case //this is where the models will be different
	{
		
	}
	switch(index)
	case 2//give a little room for other engine variants
	{
		this.attributes.radCore=true;
		this.base.power=0;
		this.current.power=0;
		this.name=”NR Engine 2.0"
		//add attributes
		this.beginTurn()//beginTurns are like upkeep in MTG
		{
			this.partof.changeStorage('energy',this.current.force,this);
		}
		this.cleartarget()//as a default the engine generates energy
		{
			this.clear();
			this.partof.changeStorage('energy',this.current.force,this);//this wont become permanent until the end of the turn
			if(this.current.condition<this.base.damage)
			{
				//don't know how to do this so it is only on server
			}
		}
	}
}
function()
{
	
}