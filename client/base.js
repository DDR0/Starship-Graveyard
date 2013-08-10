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
	canvasID:document.getElementById('grid-display').getContext('2d'),
	hexify:function(pixelX,pixelY)
	{// I created this function to tell which hex the player has clicked on
		var map=
		{
			x:pixelX/(this.hexWidth*3/4),
			y:pixelY/this.hexHeight
		}
		if(pixelX%(map.x)<(this.hexWidth/4))
		{
			if(map.x%2==0)
			{
				if((pixelY%this.hexHeight)<this.hexHeight/2)
				{
					if(((pixelX%this.hexHeight)*this.hexRatio+(pixelY%this.hexWidth))<this.topEnd)
					{
						map.x-=1;
					}
				}
				else
				{
					if(((pixelX%this.hexHeight)*this.hexRatio-(pixelY%this.hexWidth))<this.topEnd)
					{
						map.x-=1;
					}
				}
			}
			else
			{
				if((pixelY%this.hexHeight)<this.hexHeight/2)
				{
					if(((pixelX%this.hexHeight)*this.hexRatio-(pixelY%this.hexWidth))<this.topEnd)
					{
						map.x-=1;
					}
				}
				else
				{
					if(((pixelX%this.hexHeight)*this.hexRatio+(pixelY%this.hexWidth))<this.topEnd)
					{
						map.x-=1;
					}
				}
			}
		}
		else
		{
		}
			if(map.x%2==1)
			{
				if((pixelY%this.hexHeight)<this.hexHeight/2)
				{
					map.y-=1;
				}
			}
	},
	getHex: function(squareX,squareY)
	{
		var hex={x:0,y:0,z:0,}
		hex.x=squareX;
		hex.y=(squareX+squareY-((squareX-(squareX%2))/2))/2;//should be enough brackets
		hex.z=squareY-squareX-((squareX+1-((squareX+1)%2))/2);//75% sure this is the right formula
		return hex;
	},
	getSquare: function(hexX,hexY,hexZ)
	{
		var square={x:0,y:0,}
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
		var srcs=Array(imagesWidth);
		for(var q=0;q<newImages.length;q++)
		{
			newImages[q]=new Array(imagesHeight);
			srcs[q]=new Array(imagesHeight);
		}
		ctx2.drawImage(oldImage,0,0);
		var pixels=ctx2.getImageData(0,0,ctx2.canvas.width,ctx2.canvas.height);
		var newPixels=ctx3.getImageData(0,0,ctx3.canvas.width,ctx3.canvas.height);
		for(var d=0;d<newImages.length;d++)
		{
			left=d*this.hexWidth*3/4;
			for(var e=0;e<newImages[d].length;e++)
			{
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
						newPixels.data[index+1]=200;
						newPixels.data[index+3]=250;
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
						newPixels.data[index+3]=0;
					}
					if(newPixels.data[index+3]!=0)
					{
						//this sees if the hex is completely transparent, transparent hexes aren't added to the image array
						empty=false;
					}
				}
				ctx3.putImageData(newPixels,0,0);//may not work depending on how the pointers work
				if(!empty)
				{
					newImages[d][e]=new Image();
					var src=c[0].toDataURL();
					srcs[d][e]=src;
				}
			}
		}
		for(var r=0;r<srcs.length;r++)
		{
			for(var s=0;s<srcs[r].length;s++)
			{
				newImages[r][s].src=srcs[r][s];
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
					background:null,
					shipImage:null,
					shipPointer:null,
					seeShip:false,
					roomImage:null,
					roomPointer:null,
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
							this.background.addEventListener('load', base.canvasID.drawImage(this.background, this.pixelX, this.pixelY));
							base.canvasID.drawImage(this.background, this.pixelX, this.pixelY);
						}
						if(this.seeShip&&this.shipImage!=null)
						{
							base.canvasID.drawImage(this.shipImage, this.pixelX, this.pixelY);
						}
						if(this.seeRoom&&this.roomImage!=null)
						{
							base.canvasID.drawImage(this.roomImage, this.pixelX, this.pixelY);
							//probably should check the room here
						}
						if(this.seeEnergy&&this.energyImage!=null)
						{
							base.canvasID.drawImage(this.energyImage, this.pixelX, this.pixelY);
						}
						if(this.seeShield&&this.shieldImage!=null)
						{
							base.canvasID.drawImage(this.ShieldImage, this.pixelX, this.pixelY);
						}
						for(var z=0; z<this.targets.length; z++)
						{
							base.canvasID.drawImage(this.targets[z],this.pixleX, this.pixelY);
						}
					},
					getDistance: function(otherX,otherY)
					{
						otherHex=getHex(otherX,otherY)
						thisHex=getHex(this.coordinateX,this.coordinateY)
						var distance=math.max(math.abs(thisHex.x-otherHex.y),math.abs(thisHex.y-otherHex.y),math.abs(thisHex.z-otherHex.y));
						return distance;
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
	}
}
var backgroundImage=new Image();
backgroundImage.src="images/Space Background.png";
backgroundImage.addEventListener('load',  function()
{
	var images=base.hexifyImage(backgroundImage);
	base.newHexesByImages(images);
	base.restackAll();
	setTimeout(	base.restackAll(),10000);
}); //This event will be fired when the image loads.




