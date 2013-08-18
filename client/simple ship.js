var ship=//this ship is meant for the players ship the enemies ship will be different
{
	centerX:null,
	centerY:null,
	mapX:null,//can be negative
	mapY:null,//can be negative
	energyComp,null;
	comps:[],//both comps and images will become 2D ragged arrays when comps are added
	images:[],
	destroyed;[],//destroyed contains an array of images representing the ship full of holes
	updateCenter:function
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
//most of the component code will be on the server
var emptyComponent=
{
	//I don't know how many of these are going to be on the server, client or both
	//Let really want to handle base current and attributes you can handle the others if you want
	base:null,//the base stats that are returned to when the component is repaired includes max health
	current:null,//the current stats that are effected by the battle includes current health
	attribute:null,//will be a map of booleans stating whether or not the ship has an attribute
	material:null,//the material or armoUr the component is made out of
	enviroment:null,//a map with the temp gases and other environmental information
	crew:null,//an array of all crew in the component
	name:null,
	desctiption;null;,
	image;null,//the image or icon of the comp
	location;null,//pointer to a hex
	partof;null,//pointer to the ship
	shipX:null,
	shipY:null,
	isSolid;true,//does the component block other comps don't actually know why I have this but i put it in the code
	isDestroyed;false,
}
{
}