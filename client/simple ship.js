var ship=
{
	centerX:null,
	centerY:null,
	mapX:null,//can be negative
	mapY:null,//can be negative
	rooms:[],//both rooms and images will become 2D ragged arrays when rooms are added
	images:[],
	updateCenter:function
	{
		//updates the center hex relative to the ship its not super accurate it should really involve squaring sum numbers but itll work for what we want
		var hex;
		var sumX=0;
		var sumY=0;
		var sumZ=0;
		var numOfRooms=0;
		for(var x=0;x<rooms.length;x++)
		{
			for(var y=0;y<rooms[x].length;y++)
			{
				if(rooms[x][y]!=null)
				{
					if(rooms[x][y].isSolid
					{
						hex=base.getHex(x,y);
						sumX+=hex.x;
						sumY+=hex.y;
						sumZ+=hex.z;
						numOfRooms++;
					}
				}
			}
		}
		sumX=math.round(sumX/numOfRooms);
		sumY=math.round(sumY/numOfRooms);
		sumZ=math.round(sumZ/numOfRooms);
		square=getSquare(sumX,sumY,sumZ);
		centerX=square.x;
		centerY=square.y;
	},
	function canGo(var relativeX, var relativeY)
	{
		var goable=true
		for(var f=0;f<rooms.length;f++)
		{
			for(var h=0;h<rooms[f].length;h++)
			{
				if(rooms[f][h]!=null)
				{
					if(rooms[f][h].isSolid)
					{
						if((rooms[f][h].shipX+relativeX)%2==0)
						{
							goable=goable&&(rooms[f][h].shipX+relativeX)&&(rooms[f][h].shipY+relativeY);
						}
						else
						{
							goable=goable&&(rooms[f][h].shipX+relativeX)&&(rooms[f][h].shipY+relativeY-1);
						}
					}
				}
			}
		}
		return goable;
	},
	addRoom:function(newRoom, relativeX, relativeY)
	{
		//this will add or replace a room to the ship
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
		if(relativeX>=rooms.length)
		{
			newArrays=true;
		}
		else if(relativeY>=rooms[relativeX].length)
		{
			newArrays=true;
		}
		if(newArrays)
		{
			var newRooms=new array(max(rooms.length+displaceX,relativeX+1));
			var newImages=new array(newRooms.length-rooms.length+images.length);
			for(var b=displaceX;b<newRooms.length;b++)
			{
				if(b===relativeX)
				{
					newRooms[b]=new array(max(rooms[b].length+displaceY,relativeY+1));
					newImages[b]=new array(newRooms[b].length-rooms.length[b]+images.length[b]);
					for(var c=displaceY;c<newRooms[b].length;b++)
					{
						newRooms[b][c]=rooms[b-displaceX][c-displaceY];
						newRooms[b][c].shipX=b;
						newRooms[b][c].shipY=c;
						newImages[b][c]=images[b-displaceX][c-displaceY];
					}
				}
				else
				{
					newRooms[b]=rooms[b-displaceX];
					for(var h in newRooms[b])
					{
						h.shipX=b;
					}
					newImages[b]=images[b-displaceX];
				}
			}
			if(relativeX<displaceX)
			{
				newRooms[relativeX]=new Array(relativeY+1);
				newImages[relativeX]=new Array(relativeY+1);
			}
			images=newImages;
			rooms=newRooms;
		}
		rooms[relativeX][relativeY]=newRoom;
		newRoom.shipX=relativeX;
		newRoom.shipY=relativeY;
		images[relatvieX][relativeY]=//need to figure out where the ship images come from
	},
	moveRoom:function(room, relativeX, relativeY)=
	{
		var ok=true;
		if(relativeX+room.shipX<0||relativeX+room.shipX>rooms.length)
		{
			addRoom(room, relativeX+room.shipX, relativeY+room.shipY)
			removeRoom(room.shipX, room.shipY);
		}
		else if(relativeY+room.shipY<0||relativeY+room.shipY>rooms[relativeX+room.shipX].length)
		{
			addRoom(room, relativeX+room.shipX, relativeY+room.shipY);
			removeRoom(room.shipX, room.shipY);
		}
		else if(rooms[relativeX+room.shipX][relativeY+room.shipY]!=null)
		{
			ok=false;
		}
		else
		{
			room
		}
		return ok;
	},
	removeRoom:function(relativeX, relativeY)=
	{
		rooms[relatvieX][relativeY]=null;
		//destroy the room
		//update the graphics
	},
	rotate:function()=
	{
		this.rotate();
	},
	rotate:function(x,y)=
	translate:function(x,y)=
	{
		//checks along the ships path and then teleports the ship
	},
	clearImage;function()//should only be used before addImage
	{
		for
	},
	teleport:function(relativeX,relativeY)=
	{
		this.mapX+=relativeX;
		this.mapY+=relativeY;
		for(var t=0;t<rooms.length
	},
}
{
}