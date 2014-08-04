
function remover()
{
try
{

if(window.location.href.indexOf("youtube.com") > -1)
	if(document.querySelector(".videoAdUiSkipButton") == null)
	{
		setTimeout(function() {remover()},300);
		return 
	}
	
	document.querySelector(".html5-main-video").currentTime = 10

	setTimeout(function()
	{

	ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window,0,0,0,0,0,false,false,false,false,2,null);
    document.querySelector(".videoAdUiSkipButton").dispatchEvent(ev);
	
	setTimeout(function() {remover()},3000);
	
	
	},20)
	
	
}catch(e)
{
setTimeout(function()
{
remover()
},1000);
}
}

remover()