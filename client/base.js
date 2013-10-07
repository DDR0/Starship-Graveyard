var base=
{
	hexHeight:34,//still not final
	hexWidth:40,//still not final
	hexRatio:(1.7),
	battleHeight:20,
	battleWidth:20,
	intercept:(17),
	server:false,
	hexes:null,
	coursor:null,
	canvas:document.getElementById("main-display"),
	cContext:document.getElementById('main-display').getContext('2d'),
	hexify:function(pixelX,pixelY)
	{// I created this function to tell which hex the player has clicked on
		var map=
		{
			x:(pixelX-(pixelX%(base.hexWidth*3/4)))/(base.hexWidth*3/4),
			y:null,
		}
		if(map.x%2===1)
			pixelY-=(base.hexHeight/2);
		map.y=(pixelY-(pixelY%base.hexHeight))/base.hexHeight
		console.log(pixelY);
		console.log(map.y);
		if(pixelX%(base.hexWidth)<(base.hexWidth/4))
		{
			if((pixelY%base.hexHeight)<(base.hexHeight/2))
			{
				if(((pixelY%base.hexHeight)+(pixelX%base.hexWidth)*base.hexRatio)<base.intercept)
				{
					if(map.x%2===0)
						map.y--;
					map.x--;
				}
			}
			else
			{
				if(((pixelY%base.hexHeight)-(pixelX%base.hexWidth)*base.hexRatio)>base.intercept)
				{
					if(map.x%2===1)
						map.y++;
					map.x--;
				}
			}
		}
		console.log(map.x);
		return map;
	},
	getHex: function(squareX,squareY)
	{
		var hex;
		hex.x=squareX;
		hex.y=(squareX+squareY-((squareX-(squareX%2))/2))/2;//should be enough brackets
		hex.z=squareY-squareX-((squareX+1-((squareX+1)%2))/2);//75% sure this is the right formula
		return hex;
	},
	getSquare: function(hexX,hexY,hexZ)
	{
		var square;
		square.x=hexX;
		square.y=hexZ+hexY-((hexY+1-((hexY+1)%2))/2);//ill check these later
		return square;
	},
	hexifyImage:function(oldImage)
	{
		//okay so I don't know what exactly we are going to use when it comes to canvas so for now i will use ctx2 and ctx3 this function may not even be in base
		var c = $("<canvas>")
		.attr({
			'width': oldImage.width,
			'height': oldImage.height,
		})
		.css({	
			"position": "absolute",
			"pointer-events": "none",
		});
		var ctx2=c[0].getContext('2d');
		c = $("<canvas>")
		.attr({
			'width': this.hexWidth,
			'height': this.hexHeight,
		})
		.css({	
			"position": "absolute",
			"pointer-events": "none",
		});
		var ctx3=c[0].getContext('2d');
		var imagesHeight=1+(oldImage.height-(oldImage.height%this.hexHeight))/this.hexHeight;
		var imagesWidth=1+(oldImage.width-((oldImage.width-this.hexWidth/4)%(this.hexWidth*3/4))-this.hexWidth/4)*4/3/this.hexWidth;
		var left;
		var top;
		var newImageX;
		var newImageY;
		var empty;
		var newImages=Array(imagesWidth);
		for(var q=0;q<newImages.length;q++)
		{
			newImages[q]=new Array(imagesHeight);
		}
		ctx2.drawImage(oldImage,0,0);
		var pixels=ctx2.getImageData(0,0,ctx2.canvas.width,ctx2.canvas.height);
		var newPixels=ctx3.getImageData(0,0,ctx3.canvas.width,ctx3.canvas.height);
		for(var d=0;d<newImages.length;d++)
		{
			left=d*this.hexWidth*3/4;
			for(var e=0;e<newImages[d].length;e++)
			{
				newPixels=ctx3.createImageData(newPixels);
				top=this.hexHeight*e;
				if(d%2==1)
				{
					top+=(this.hexHeight/2)//need to figure out why -3
				}
				newImageY=0;
				newImageX=-1;
				empty=true;
				//empty the newPixels data
				for(var index=0;index<newPixels.data.length;index++)
				{
					newPixels.data[index]=0;
				}
				for(var index=0;index<newPixels.data.length;index+=4)
				{
					if((newImageX+left)<left+this.hexWidth-1)
					{
						newImageX++;
					}
					else
					{
						newImageX=0;
						newImageY++;
					}
					if(((newImageX+left)>=pixels.width)||((newImageY+top)>=pixels.height))
					{
						//we dont want to get pixels form outside the image
						newPixels.data[index]=0
						newPixels.data[index+1]=0;
						newPixels.data[index+2]=0;
						newPixels.data[index+3]=0;
					}
					else if((newImageX*this.hexRatio+newImageY>=this.intercept)&&(newImageX*this.hexRatio+newImageY<=5*this.intercept)&&(newImageX*this.hexRatio-(newImageY)<=3*this.intercept)&&(newImageX*this.hexRatio-newImageY>=-this.intercept))//talk to Jarvis if this doesn’t quite work
					{
						//only adds pixels into the hex area
						for(var g=0;g<4;g++)
						{
							newPixels.data[index+g]=pixels.data[4*(newImageX+left)+4*(newImageY+top)*ctx2.canvas.width+g];
						}
					}
					else
					{
						newPixels.data[index]=0;
						newPixels.data[index+1]=0;
						newPixels.data[index+2]=0;
						newPixels.data[index+3]=0;
					}
					if(newPixels.data[index+3]!=0)
					{
						//this sees if the hex is completely transparent, transparent hexes aren't added to the image array
						empty=false;
					}
				}
				if(!empty)
				{
					ctx3.putImageData(newPixels,0,0);
					newImages[d][e]=new Image();
					newImages[d][e].src=c[0].toDataURL();
				}
				else
				{
					newImages[d][e]=null;
				}
			}
		}
		return newImages;
	},
	newHexes:function()
	{
		this.hexes=new Array(this.battleHeight)
		for(var x=0; x<this.hexes.length; x++)
		{
			this.hexes[x]=new Array(this.battleWidth)
			for(var y=0; y<this.hexes[x].length; y++)
			{
				this.hexes[x][y]=
				{
					coordinateX:x,
					coordinateY:y,
					isSelected:false,
					background:null,
					shipImage:null,
					shipPointer:null,
					seeShip:false,
					compImage:null,
					compPointer:null,
					seeRoom:null,
					energyImage:null,
					seeEnergy:false,
					targets:new Array(0),
					pixelX:x*(this.hexWidth*3/4),
					pixelY:(x%2===0)?(y*this.hexHeight):(this.hexHeight*(y+1/2)),
					restack:function()
					{//updates the graphics for the specified hex
						if(this.background!=null)
						{
							console.log('restack');
							console.log(this.background.complete);
							var pixelX=this.pixelX;
							var pixelY=this.pixelY;
							if(!this.background.complete)
								this.background.onload=function() {
									base.cContext.drawImage(this, pixelX,pixelY);
								};
							else
							{
								console.log('background is loaded at ')
								base.cContext.drawImage(this.background, this.pixelX, this.pixelY);
							}
						}
						if(this.seeShip&&this.shipImage!=null)
						{
							base.cContext.drawImage(this.shipImage, this.pixelX, this.pixelY);
						}
						if(this.seeRoom&&this.compImage!=null)
						{
							base.cContext.drawImage(this.compImage, this.pixelX, this.pixelY);
							//probably should check the comp here
						}
						if(this.seeEnergy&&this.energyImage!=null)
						{
							base.cContext.drawImage(this.energyImage, this.pixelX, this.pixelY);
						}
						if(this.seeShield&&this.shieldImage!=null)
						{
							base.cContext.drawImage(this.ShieldImage, this.pixelX, this.pixelY);
						}
						for(var z=0; z<this.targets.length; z++)
						{
							base.cContext.drawImage(this.targets[z],this.pixelX, this.pixelY);
						}
						if(this.isSelected)
						{
							base.cContext.drawImage(base.coursor,this.pixelX, this.pixelY);
						}
					},
					getDistance: function(otherX,otherY)
					{
						var otherHex=base.getHex(otherX,otherY)
						var thisHex=base.getHex(this.coordinateX,this.coordinateY)
						var distance=math.max(math.abs(thisHex.x-otherHex.x),math.abs(thisHex.y-otherHex.y),math.abs(thisHex.z-otherHex.z));
						return distance;
					},
					getDirection:function(otherX,otherY)
					{
						var clockwise=6;
						var otherHex=base.getHex(otherX,otherY)
						var thisHex=base.getHex(this.coordinateX,this.coordinateY)
						var relativeX=thisHex.x-otherHex.x;
						var relativeY=thisHex.y-otherHex.y;
						var relativeZ=thisHex.z-otherHex.z;
						if(1===math.max(math.abs(relativeX),math.abs(relativeY),math.abs(relativeZ)))
						{
							if(relativeX===0)
							{
								if(relativeY<0)
									clockwise=0;
								else
									clockwise=3;
							}
							else if(relativeY===0)
							{
								if(relativeX>0)
									clockwise=1;
								else
									clockwise=4;
							}
							else if(relativeZ===0)
							{
								if(relativeX>0)
									clockwise=2;
								else
									clockwise=5;
							}
						}
						return clockwise;
					}
				}
			}
		}
	},
	restackAll:function()
	{// restacks all the hexes
		for(var m=0;m<this.hexes.length;m++)
		{
			for(var n=0;n<this.hexes.length;n++)
			{
				this.hexes[m][n].restack();
			}
		}
	},
	newHexesByImages:function(images)
	{//creates the hexes based on a 2D array of images
		this.newHexes();
		for(var o=0;o<images.length;o++)
		{
			for(var p=0;p<images[0].length;p++)
			{
				if(this.hexes.length>o)
				{
					if(this.hexes[o].length>p)
					{
						this.hexes[o][p].background=images[o][p];
					}
				}
			}
		}
		this.restackAll();
	},
	clearSelection:function()//makes all hexes and there rooms unselected
	{
		for(var ad=0;ad<base.hexes.length;ad++)
		{
			for(var ae=0;ae<base.hexes[ad].length;ae++)
			{
				if(base.hexes[ad][ae].isSelected)
				{
					base.hexes[ad][ae].isSelected=false;
					base.hexes[ad][ae].restack();
					if(base.hexes[ad][ae].compPointer!==null)
					{
						base.hexes[ad][ae].compPointer.isSelected=false;
					}
				}
			}
		}
	},
	canvasClicked:function(event)
	{
		var windowX=event.pageX;
		var windowY=event.pageY;
		if(false)
		{
			console.log($('#main-display').offset().top);
			console.log(""+(windowX-base.canvas.clientLeft)+" "+(windowY)+' '+event.pageY);
			console.log(base.hexify(windowX-$('#main-display').offset().left,windowY-$('#main-display').offset().top).y);
			console.log(base.hexes[map.x][map.y].background.src);
		}
		var map=base.hexify(windowX-$('#main-display').offset().left,windowY-$('#main-display').offset().top);
		base.clearSelection();
		base.hexes[map.x][map.y].isSelected=true;
		base.hexes[map.x][map.y].restack();
		base.cContext.drawImage(base.coursor,0,100);
	},
	//most of the component code will be on the server
	emptyComponent:function()
	{
		//I don't know how many of these are going to be on the server, client or both
		//Let really want to handle base current and attributes you can handle the others if you want
		this.base=null;//the base stats that are returned to when the component is repaired includes max health
		this.current=null;//the current stats that are effected by the battle includes current health
		this.server=null;//a list of methods that will ONLY be on the server 
		this.attribute=null;//will be a map of booleans stating whether or not the ship has an attribute
		this.material=null;//the material or armoUr the component is made out of
		this.enviroment=null;//a map with the temp gases and other environmental information
		this.actionList=[];
		this.isSelected=false;
		this.crew=null;//an array of all crew in the component
		this.name=null;
		this.desctiption=null;
		this.isSelected=false;
		this.isSolid=true;//does the component block other comps don't actually know why I have this but I put it in the code
		this.isDestroyed=false;
		this.image=null;//the image or icon of the comp
		this.location=null;//pointer to a hex
		this.partof=null;//pointer to the ship
		this.shipX=null;
		this.shipY=null;
	},
}
var backgroundImage=new Image();
backgroundImage.src="images/Space Background.png";
var coursor=new Image();
coursor.src="images/onehex.png";
document.getElementById('main-display').onclick=base.canvasClicked;
backgroundImage.addEventListener('load',  function()
{
	var images=base.hexifyImage(backgroundImage);
	base.newHexesByImages(images);
	base.coursor=coursor;
}); //This event will be fired when the image loads.




