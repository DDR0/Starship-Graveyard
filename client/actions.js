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
				this.buttons[ad].onclick(this.actionList[ad].action);
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
	otherAssists:[],//all other effects and utilities
	fastWeapons:{},//weapons that hit the target immediately after being fired like lasers may include fighting in comps
	movement:[],//the actions that move the ship or crew
	slowWeapons:[],//all other weapons most ship weapons are slow but must crew weapons are fast
	//storage
	//check for begin turns
}
actions.prepare();