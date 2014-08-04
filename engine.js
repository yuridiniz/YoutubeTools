/*
* Cria um ouvinte de mensagens, recebe as mensagens enviada pelos content_scripts e exibe o rich notification
*
*/
chrome.runtime.onMessage.addListener(function(msg, sender) {

	
    if(msg.from == undefined) return;
    if(msg.body == undefined) return;
    if(msg.title == undefined) return;

    chrome.notifications.create('0',{
		  type:'basic',
		  title:msg.title,
		  iconUrl: 'http://www.rfimasters.com/wp-content/uploads/2013/09/warning_notification-1331px-300x289.png',
		  message: msg.body,
		  expandedMessage:'Não esqueça de efetuar uma colaboração :p',
		  priority:1,
		  isClickable:true
		},function(id){
			console.error(chrome.runtime.lastError)
		});
});

chrome.runtime.onUpdateAvailable

chrome.runtime.onUpdateAvailable.addListener(function(e,v)
{
console.log(e)
console.log(v)
});

var x = chrome.runtime.requestUpdateCheck(function(e)
{
console.log(e)
});

console.log(x)

console.log(chrome.runtime)