(function() { //We put the code in a function, and then call the function, to avoid polluting the global namespace with our variables. There is no block-level scope in JS yet, only function-level scope.
	"use strict";
//I made these constants good thing too because I may change the 20/18 hex size
var ratio=(9/5);
var topEnd=9;
var bottomEnd=27;
var hexWidth=20;
var hexHeight=18;
var battleWidth=20;
var battleHeight=20;
var backgroundImage=new Image();
backgroundImage.src="images/tempBack.png";
var canvasID=document.getElementById('grid-display').getContext('2d');
//wait until script is loaded please 11
var hexes=new Array(battleHeight)
{
	for(var x=0; x<hexes.lengh; x++)
	{
		hexs[x]=new Array(battleWidth)
		for(var y=0; y<hexes[x].length; y++)
		{
			hexes[x][y]=
			{
				coordinateX:x,
				coordinateY:y,
				background:backgroundImage,//this will NOT be in the final product but I wanna test
				shipImage:null,
				shipPointer:null,
				seeShip:false,
				roomImage:null,
				roomPointer:null,
				seeRoom:null,
				energyImage:null,
				seeEnergy:false,
				targets:new array(0),
				pixelX:x*(hexWidth*3/4),
				pixelY:(x%2===0)?(y*hexHeight):(hexHeight*(y+1/2)),
				restack:function()
				{
					canvasID.drawImage(this.background, pixelX, pixelY);
					if(seeShip&&shipImage!=null)
					{var x=20
						canvasID.drawImage(this.shipImage, pixelX, pixelY);
					}
					if(seeRoom&&roomImage!=null)
					{
						canvasID.drawImage(this.roomImage, pixelX, pixelY);
						//probably should check the room here
					}
					if(seeEnergy&&energyImage!=null)
					{
						canvasID.drawImage(this.energyImage, pixelX, pixelY);
					}
					if(seeShield&&shieldImage!=null)
					{
						canvasID.drawImage(this.ShieldImage, pixelX, pixelY);
					}
					for(var z=0; z<targets.length; z++)
					{
						canvasID.drawImage(this.targets[z]);
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
}
for(var k in hexes)
{
	k.restack();
}

})();