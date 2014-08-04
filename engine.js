/*
* Cria um ouvinte de mensagens, recebe as mensagens enviada pelos content_scripts e exibe o rich notification
*
*/

chrome.notifications.onButtonClicked.addListener(function(notfiId, btnIndex)
{
	if(btnIndex == 0)
		chrome.tabs.create({ url: chrome.app.getDetails().update_url.toString().replace("update.xml","YoutubeTools.zip") });
});

chrome.runtime.onMessage.addListener(function(msg, sender) {

console.log(msg)
	if(msg.callBack == "AbrirAlerta")
		AbrirAlerta(msg);
		
	if(msg.callBack == "VerificarAtualizacao")
		VerificarAtualizacao();
});



var VerificarAtualizacao = function()
{
	chrome.runtime.requestUpdateCheck(function(status,versao)
	{
		if (status == "update_available") {
		AtualizarYoutubeTools(versao)
	  } else if (status == "no_update") {
		console.log("no update found");
	  } else if (status == "throttled") {
		console.log("Oops, I'm asking too frequently - I need to back off.");
	  }
	});
};

var AtualizarYoutubeTools = function(versao)
{
	AbrirAlerta({
		from : "engine",
		title : "Youtube tools",
		body : "Ha uma versao mais recente disponivel: " + versao.version.toString(),
		btnList : [ { title : "Iniciar download"}]
		});
}

var AbrirAlerta = function(msg) {

    if(msg.from == undefined) return;
    if(msg.body == undefined) return;
    if(msg.title == undefined) return;
	if(msg.btnList == undefined) msg.btnList = [];

    chrome.notifications.create(msg.from,{
		  type:'basic',
		  title:msg.title,
		  iconUrl: 'http://www.rfimasters.com/wp-content/uploads/2013/09/warning_notification-1331px-300x289.png',
		  message: msg.body,
		  expandedMessage:'Não esqueça de efetuar uma colaboração :p',
		  priority:1,
		  isClickable:true,
		  buttons : msg.btnList
		},function(id){
			console.log("callback")
		});
}

