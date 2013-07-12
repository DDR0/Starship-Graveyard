var base=
{
	hexHeight:44,//still not final
	hexWidth:50,//still not final
	hexRatio:(hexHeight/hexWidth/2),
	battleHeight:20,
	battleWidth:20,
	topEnd:(hexHeight/4),
	bottomEnd:(topEnd*3),
	hexify:function(pixelX,pixelY)
	{// I created this function to tell which hex the player has clicked on
		var map=
		{
			x:pixelX/(hexWidth*3/4),
			y:pixelY/hexHeight
		}
		if(pixelX%(map.x)<(hexWidth/4))
		{
			if(map.x%2==0)
			{
				if((pixelY%hexHeight)<hexHeight/2)
				{
					if(((pixelX%hexHeight)*ratio+(pixelY%hexWidth))<topEnd)
					{
						map.x-=1;
					}
				}
				else
				{
					if(((pixelX%hexHeight)*ratio-(pixelY%hexWidth))<topEnd)
					{
						map.x-=1;
					}
				}
			}
			else
			{
				if((pixelY%hexHeight)<hexHeight/2)
				{
					if(((pixelX%hexHeight)*ratio-(pixelY%hexWidth))<topEnd)
					{
						map.x-=1;
					}
				}
				else
				{
					if(((pixelX%hexHeight)*ratio+(pixelY%hexWidth))<topEnd)
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
				if((pixelY%hexHeight)<hexHeight/2)
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
	hexifyImage: function(oldImage)
	{
		//okay so I don't know what exactly we are going to use when it comes to canvas so for now i will use ctx2 and ctx3 this function may not even be in base
		var imagesWidth=1+(ctx2.width-ctx2.width%hexWidth)/hexWidth;
		var imagesHeight=1+(ctx2.height-ctx2.height%hexHeight)/hexHeght;
		var newImages=array(imagesWdith);
		var left;
		var top;
		var newImageX;
		var newImageY;
		var empty;
		for(arrays in newImages)
		{
			arrays=array(imagesHeight);
		}
		ctx2.drawImage(oldImage);
		var pixels=ctx2.getImageData(0,0,ctx2.width,ctx2.height);
		var newPixels=ctx3.getImageData(0,0,ctx3.width,ctx3.height);
		for(var d=0;d<images.length;d++)
		{
			left=d*hexWidth*3/4
			newImageX=left
			for(var e=0;e<images[d].length;e++)
			{
				top=hexHeight*e;
				if(e%2===1)
				{
					top+=(hexHeight/2)
				}
				newImageY=top;
				for(var index=0;index<newPixels.length;index+=4)
				{
					if(newImageX>left+hexWidth)
					{
						newImageX++;
					}
					else
					{
						newImageX-=hexWidth;
						newImageY++;
					}
					if((newImageX+left>=pixels.width)||(newImageY+top>=pixels.height))
					{
						//we dont want to get pixels form outside the image
						newPixels[index+3]=0;
					}
					else if((newImageX*ratio+newImageY>topEnd)&&(newImageX*ratio+newImageY<bottomEnd)&&(newImageX*ratio-newImageY<-topEnd)&&(newImageX*ratio-newImageY>bottomEnd))//talk to Jarvis if this doesn’t quite work
					{
						//only adds pixels into the hex area
						for(var g=0;g<4;g++)
						{
							newPixels[index+g]=pixels[newImageX+newImageY*ctx2.width];
						}
					}
					else
					{
						newPixels[index+3]=0;
					}
					if(newpixels[index+3]!=0)
					{
						//this sees if the hex is completely transparent, transparent hexes aren't added to the image array
						empty=false;
					}
				}
				ctx3.putImageData(newPixels);//may not work depending on how the pointers work
				if(!empty)
				{
					newImages[d][e]=new Image();
					newImages[d][e].src=ctx3.getDataURL();
				}
			}
		}
		return newImages;
	}
}




