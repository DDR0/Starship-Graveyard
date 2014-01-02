var actions=
{
	totalButtons:5,
	scroll:0,
	blank:'--------------------',
	buttons:[],
	actionlist:[],
	prepare:function()
	{
		for(var ac=0;ac<this.totalButtons;ac++)
		{
			this.buttons.push(document.getElementById('button'+ac));
			this.buttons[ac].innerHTML=this.blank;
			this.buttons[ac].width=200;
			this.buttons[ac].height=20;//don't know if these are the right variables.
		}
	},
	setActions:function(array)
	{
		this.actionList=array;
		this.scroll=0;
		this.updateButtons();
	},
	updateButtons:function()
	{
		if(this.actionList.length<this.totalButtons)
			for(var ad=0;ad<this.actionList.length;ad++)
			{
				this.buttons[ad].innerHTML=this.actionList[ad].name;
				this.buttons[ad].onclick=this.actionList[ad].action;
			}
		else
		{
			if(this.scroll==0)
			{
				this.buttons[0].innerHTML=this.actionList[0].name;
				this.buttons[0].onclick(this.actionList[0].action);
			}
			else
			{
				this.buttons[0].innerHTML="^";
				this.buttons[0].onclick(scrollUp());
			}
			for(var ae=1;ae<(this.totalButtons-1);ae++)
			{
				this.buttons[ae].innerHTML=this.actonList[ae].name;
				this.buttons[ae].onclick(this.actionList[ae+scroll].action);
			}
			if(this.scroll==(this.actionList.length-1))
			{
				this.buttons[this.totalButtons-1].innerHTML=this.actionList[this.actionList.length-1].name;
				this.buttons[this.totalButtons-1].onload(this.actionList[this.totalButtons-1+scroll].action);
			}
			else
			{
				this.buttons[this.totalButtons-1].innerHTML="v";
				this.buttons[this.totalButtons-1].onload(this.scrollDown());
			}
		}
	},
	scrollUp:function()
	{
		this.scroll--;
		this.updateButtons();
	},
	scrollDown:function()
	{
		this.scroll++;
		this.updateButtons();
	},
};
var plan={
	//check for end turns
	crewAssists:[],//things that alter the crews abilities this may have an effect on other assists
	otherAssists:[],//all other effects and utilities includes idles and alwayses
	fastWeapons:{},//weapons that hit the target immediately after being fired like lasers may include fighting in comps
	movement:[],//the actions that move the ship or crew
	slowWeapons:[],//all other weapons most ship weapons are slow but must crew weapons are fast
	//storage
	//check for begin turns
}
var endturn=function()
{
	console.log('end turn called');
	//may want to fix this but fer now I want to control the order
	for(var an=0;an<plan.crewAssists.length;an++)
	{
		plan.crewAssits[an].comp.findFunction(plan.crewAssists.name)(plan.crewAssists.args);
	}
	for(var an=0;an<plan.otherAssists.length;an++)
	{
		plan.otherAssits[an].comp.findFunction(plan.otherAssists.name)(plan.otherAssists.args);
	}
	for(var an=0;an<plan.fastWeapons.length;an++)
	{
		plan.fastWeapons[an].comp.findFunction(plan.fastWeapons.name)(plan.fastWeapons.args);
	}
	for(var an=0;an<plan.movement.length;an++)
	{
		var func=plan.movement[an].comp.findFunction(plan.movement[an].name);
		func(plan.movement[an].args);
	}
	for(var an=0;an<plan.slowWeapons.length;an++)
	{
		plan.slowWeapons[an].comp.findFunction(plan.slowWeapons.name)(plan.slowWeapons.args);
	}
	mainShip.finalizeStorage();
}
endTurnButton=document.getElementById('endTurnButton');
endTurnButton.innerHTML='End Turn';
endTurnButton.onclick=endturn;
endTurnButton.width=200;
endTurnButton.height=20;//don't know if these are the right variables.
actions.prepare();
base.actionsPointer=actions;