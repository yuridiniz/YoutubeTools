
var verificarAtualizacao = function(){
	chrome.runtime.sendMessage({
		callBack: "VerificarAtualizacao",
		from: "executarClick",
		title: "Ads removido",
		body: "Ads do youtube acabou de ser removido"
	});
}

var remover = function(buscando) {
    try {
        if (window.location.href.indexOf("youtube.com") > -1) {
            if (document.querySelector(".videoAdUi") != null) {
                if (document.querySelector(".videoAdUiSkipButton") == null) {
                    setTimeout(function() {
                        remover();
                    }, 100)

                    return;
                } else {

                    executarClick();
                }


            } else {
                if (document.querySelector(".videoAdUiSkipButton") == null) {
                    setTimeout(function() { remover() }, 2000);
                    return;
                } else {
                    
                executarClick();

                    if (document.querySelector(".videoAdUi") == null) {
                        setTimeout(function() {
                            remover();
                        }, 1000)

                        return;
                    }
                }

            }

        }
    } catch (erro) {
        console.log(erro)
    }
}

var executarClick = function () {
    var video = document.querySelector(".html5-main-video");

    if (video.volumeEditavel == null) {
        video.volumeEditavel = video.volume;
        video.volume = 0;
    }



    if (video.readyState != 4 && document.querySelector(".videoAdUi") != null) {
        document.querySelector(".videoAdUi").style.opacity = "0"
        video.style.opacity = 0
        setTimeout(function() {
            executarClick();
        },100)

        return
    }

    if (video.editado != true) {
        video.currentTime = 10;
    }

    video.editado = true;

    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 2, null);
    var btn = document.querySelector(".videoAdUiSkipButton")

    if (btn != null)
        btn.dispatchEvent(ev);

    if (document.querySelector(".videoAdUi") != null) {
        setTimeout(function () {
            console.log("%cbuscando...", "color:blue")
            executarClick()
            
        }, 100);
    } else {
        video.style.opacity = 1
        video.volume = video.volumeEditavel;
		console.log("%cremovido", "color:green");
		
        chrome.runtime.sendMessage({
			callBack: "AbrirAlerta",
            from: "executarClick",
            title: "Ads removido",
            body: "Ads do youtube acabou de ser removido"
        });
    }
}

/*
* Cria controles no HTML para realizar o autoreplay
*/
var autoReplay = function () {

    var painelControle = document.querySelector(".html5-player-chrome")
    var painelModais = document.querySelector(".html5-video-controls");

    var divControle = document.createElement("div");
    divControle.setAttribute("class", "ytp-button ytp-button-watch-later");
    divControle.setAttribute("role", "button");
    divControle.setAttribute("aria-label", "YouTube Tools");
    divControle.setAttribute("id", "OpenWindowController");
    painelControle.appendChild(divControle)


    var divOpcoes = document.createElement("div");
    divOpcoes.setAttribute("class", "ytp-menu-html5-stop-propagation classeTeste");
    divOpcoes.setAttribute("style", "height: 100px;background: rgba(0,0,0,0.5);border: 1px solid #00A0EA;top: 0;display: block;");

    painelModais.insertBefore(divOpcoes, painelModais.childNodes[0]);


    var div = document.createElement("div");
    div.style.position = "fixed";
    div.style.zIndex = "10000";
    div.style.bottom = "0px";
    div.style.right = "0px";
    div.style.width = "320px"
    div.style.height = "28px";
    div.style.padding = "8px"
    div.style.backgroundColor = "#FFF"
    div.style.border = "1px solid #CCC"
    div.id = "controle-tools"

    document.body.appendChild(div)

    var textInicio = document.createElement("input");
    textInicio.type = "text"
    textInicio.id = "txtInicio"
    textInicio.style.width = "100px";
    textInicio.style.padding = "4px";
    textInicio.style.margin = "0px 7px";
    textInicio.setAttribute("placeholder", "Minutos iniciais")

    var txtFim = document.createElement("input");
    txtFim.type = "text"
    txtFim.id = "txtFim"
    txtFim.style.width = "100px";
    txtFim.style.padding = "4px";
    txtFim.style.margin = "0px 7px";
    txtFim.setAttribute("placeholder", "Minutos iniciais")

    var button1 = document.createElement("button");
    button1.innerText = "Replay"
    button1.style.padding = "-2px 2px 2px 5px"
    button1.style.margin = "0px 0px 4px 1px"
    button1.setAttribute("class","yt-uix-button yt-uix-button-size-default yt-uix-button-default")
    div.appendChild(textInicio)
    div.appendChild(txtFim)
    div.appendChild(button1)


    document.querySelector("#OpenWindowController").addEventListener("click", function () {

    }, true);


    document.querySelector("#controle-tools button").addEventListener("click", function () {

        try {
            var inicio = document.querySelector("#controle-tools #txtInicio").value;
            var fim = document.querySelector("#controle-tools #txtFim").value;
            
            if (inicio.indexOf(":") != -1) {
                valoresInit = inicio.split(":");
                var minutos = parseInt(valoresInit[0]) * 60;
                var segundos = parseInt(valoresInit[1]);

                inicio = minutos + segundos
            }

            if (fim.indexOf(":") != -1) {

                valoresInit = fim.split(":");
                var minutos = parseInt(valoresInit[0]) * 60;
                var segundos = parseInt(valoresInit[1]);

                fim = minutos + segundos
            }
            if (inicio == "")
                inicio = 0;

            if (fim == "")
                fim = document.querySelector(".html5-main-video").duration;

            inicio = parseFloat(inicio)
            fim = parseFloat(fim);

            if (isNaN(fim) || isNaN(inicio)) {
                throw new Error("Preencha corretamente os valores, o valor deve conter o formato 02:10 ou em segundos (120.10), caso deixe em branco, o raplay executara o video por completo")
            }

            if (this.className.indexOf("yt-uix-button-toggled") == -1) {
                document.querySelector("#controle-tools #txtInicio").disabled = true;
                document.querySelector("#controle-tools #txtFim").disabled = true;
                window.intervaloReplay = setInterval(function() {
                    if (document.querySelector(".ytp-button-replay") != null || document.querySelector(".html5-main-video").currentTime >= fim) {
                        document.querySelector(".html5-main-video").currentTime = inicio;
                    }
                }, 1000)

                this.classList.add("yt-uix-button-toggled")

            } else {
                clearInterval(window.intervaloReplay)
                document.querySelector("#controle-tools #txtInicio").disabled = false;
                document.querySelector("#controle-tools #txtFim").disabled = false;
                this.classList.remove("yt-uix-button-toggled")
            }
        } catch (erro) {
            chrome.runtime.sendMessage({
                callBack: "AbrirAlerta",
                from: "autoReplay",
                title: "Valores invalidos",
                body: erro.message
            });
        }
    }, true);

}

autoReplay();
remover();
verificarAtualizacao()
