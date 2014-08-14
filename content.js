/*
* Versao em BETA teste
* desenvolvido por Yuri Araujo
*/

var ProjectNetwork = {
    Socket : null,
	
    /*
    * Inicia todo o funcionamento
    */
    Iniciar: function () {
        ProjectNetwork.AdicionarOuvinte()

        console.log("Testando")

        //ProjectNetwork.VerificarAtualizacao();
		 if (window.location.href.indexOf("youtube.com") > -1) {
			 ProjectNetwork.InserirStyleSheet();
			ProjectNetwork.RemoverAdsDeVideo();
			ProjectNetwork.VerificaExistenciaDeAnuncio();
			ProjectNetwork.AutoReplay.Iniciar();
			ProjectNetwork.VerificarFlash()

			with(ProjectNetwork.Eventos) {
			    window.onbeforeunload = OnBeforeUnload;
			    document.querySelector(".html5-main-video").onplaying = OnVideoPlaying;
			}

			setTimeout(function () {
				ProjectNetwork.AutoReplay.Toggle(true);
			}, 1000)
		}

    },

    Eventos : {
        OnBeforeUnload : function(e) {
            ProjectNetwork.AutoReplay.Fechar()
        },
        OnVideoPlaying: function (e) {
            ProjectNetwork.Socket.postMessage({
                callback: "AbrirAlerta",
                from: "Tocando",
                title: "Youtube™ Tools BETA DEVELOPER",
                body: "Video iniciado",
                id: "IniciandoVideo"
            });
        }
    },

    /*
    * Verifica se o vídeo é em flash ou HTML5
    */
    VerificarFlash : function() {
        var flash = document.querySelector("embed[type='application/x-shockwave-flash'][name='movie_player']")

        if (flash != null) {
            ProjectNetwork.Socket.postMessage({
                callback: "AbrirAlerta",
                from: "VerificaFlash",
                title: "Youtube™ Tools",
                body: "Infelizmente o video atual é um flash, o YouTube Tools não conseguirá exercer nenhuma ação!",
                id: Date.now()
            });

            return true;
        }

        return false;
    },

    /*
    * Adiciona ouvinte para executar acoes delegada da ENGINE
    */
    AdicionarOuvinte: function () {
        ProjectNetwork.Socket = chrome.runtime.connect({ name: "knockknock" });
        ProjectNetwork.Socket.postMessage({ status: 200, mensagem: "Conectado com sucesso" });

        ProjectNetwork.Socket.onMessage.addListener(function (msg) {
            console.log(msg)
            if (msg.callback == undefined) return;

            switch (msg.callback) {
                case "AutoReplay":
                    ProjectNetwork.AutoReplay.Toggle();
                    break;
                default:
            }
        });
    },

    /*
    * Insere o CSS da extension
    */
    InserirStyleSheet: function () {
        var link = document.createElement('link');
        link.href = chrome.extension.getURL('main.css');
        link.id = 'cssPN';
        link.type = 'text/css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    },

    /*
    * Metodo necessario enquanto estiver na versao fora do Chrome Web Store
    */
    VerificarAtualizacao: function () {
        ProjectNetwork.Socket.postMessage({
            callback: "VerificarAtualizacao",
            from: "executarClick"
        });
    },

    /*
    * Metodo necessario enquanto nao tiver CSS
    */
    RemoverAdsDeVideo: function () {
        var ads = document.querySelector(".ad-container");
        if (ads != null) {
            ads.style.opacity = 0
        } else {
            setTimeout(function () {
                ProjectNetwork.RemoverAdsDeVideo()
            }, 1000)
        }
    },

    /*
    * Remove os videos de anuncio e avanca para o video do usuario
    */
    VerificaExistenciaDeAnuncio: function () {
        try {
            if (window.location.href.indexOf("youtube.com") > -1) {
                if (document.querySelector(".videoAdUi") != null) {
                    if (document.querySelector(".videoAdUiSkipButton") == null) {
                        setTimeout(function () {
                            ProjectNetwork.VerificaExistenciaDeAnuncio();
                        }, 100)

                        return;
                    } else {

                        ProjectNetwork.RemoverVideoAnuncio();
                    }

                } else {
                    if (document.querySelector(".videoAdUiSkipButton") == null) {
                        setTimeout(function () { ProjectNetwork.VerificaExistenciaDeAnuncio() }, 1000);
                        return;
                    } else {

                        ProjectNetwork.RemoverVideoAnuncio();
                        if (document.querySelector(".videoAdUi") == null) {
                            setTimeout(function () {
                                ProjectNetwork.VerificaExistenciaDeAnuncio();
                            }, 1000)

                            return;
                        }
                    }

                }

            }
        } catch (erro) {
            console.log(erro)
        }
    },

    /*
    * Remove os videos de anuncio e avanca para o video do usuario
    */
    RemoverVideoAnuncio: function () {
        var video = document.querySelector(".html5-main-video");

        if (video.volumeEditavel == null) {
            video.volumeEditavel = video.volume;
            video.volume = 0;
        }

        if (video.readyState != 4 && document.querySelector(".videoAdUi") != null) {
            document.querySelector(".videoAdUi").style.opacity = "0"
            video.style.opacity = 0
            setTimeout(function () {
                ProjectNetwork.RemoverVideoAnuncio();
            }, 100)

            return
        }

        if (video.editado != true) {
            video.currentTime = 10;
        }

        video.editado = true;

        
        var btn = document.querySelector(".videoAdUiSkipButton")
        ProjectNetwork.ExecutarClick(btn)

        if (document.querySelector(".videoAdUi") != null) {
            setTimeout(function () {
                console.log("%cbuscando...", "color:blue")
                ProjectNetwork.RemoverVideoAnuncio()

            }, 100);
        } else {
            video.style.opacity = 1
            video.volume = video.volumeEditavel;
            console.log("%cremovido", "color:green");

            ProjectNetwork.Socket.postMessage({
                callback: "AbrirAlerta",
                from: "executarClick",
                title: "Youtube™ Tools",
                body: "Ads do youtube acabou de ser removido",
                id: Date.now()
            });

            console.log("%cExibindo mensagem...", "color:green");
            
        }
    },

    /*
    * Remove os videos de anuncio e avanca para o video do usuario
    */
    ExecutarClick: function(elemento) {
        if (typeof elemento == "object" && elemento != null) {
            var ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 2, null);
            elemento.dispatchEvent(ev);
        }
        else if (typeof elemento == "string") {
            var ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 2, null);
            var btn = document.querySelector(elemento)

            if(btn != null)
                btn.dispatchEvent(ev);
        }
    },

    AutoReplay : {
        
        /*
        * Cria o dialogo de ferramentas
        */
        Iniciar: function () {
            var self = this;

            var parent = document.createElement("div");
            parent.id = "parent";
            parent.classList.add("projectnetwork");
            parent.classList.add("tema-escuto");
            document.body.appendChild(parent)

            parent.addEventListener("contextmenu", function (e) {
                e.stopPropagation()
                e.preventDefault()
                e.preventDefault
            }, false)

            var div = document.createElement("div");
            div.id = "dialogo-mensagem";
            div.classList.add("projectnetwork");
            div.classList.add("tema-escuto");
            parent.appendChild(div)

            var menu = document.createElement("ul");
            menu.id = "menu-ferramentas";
            menu.classList.add("projectnetwork");
            div.appendChild(menu)
            menu.innerHTML = self._ObterHtmlMenu();

            var conteudo1 = document.createElement("div");
            conteudo1.id = "conteudo1-ferramentas";
            conteudo1.classList.add("projectnetwork");
            conteudo1.classList.add("conteudo-ferramentas");
            div.appendChild(conteudo1)
            conteudo1.innerHTML = self._ObterHtmlReplay();

            conteudo1.querySelector("#projectnetwork-replay-button").addEventListener("click", function() {
                try {
                    var inicio = document.querySelector("#projectnetwork-ini-video").value;
                    var fim = document.querySelector("#projectnetwork-fim-video").value;

                    if (inicio.indexOf(":") != -1) {
                        var valoresInit = inicio.split(":");
                        var minutos = parseInt(valoresInit[0]) * 60;
                        var segundos = parseInt(valoresInit[1]);

                        inicio = minutos + segundos
                    }

                    if (fim.indexOf(":") != -1) {

                        var valoresInit = fim.split(":");
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

                    if (this.className.indexOf("ativo") == -1) {

                        var video = document.querySelector(".html5-main-video");
                        var fimVideo = "00:00";

                        if (video != null && !isNaN(video.duration * 1)) {
                            fimVideo = video.duration * 1000;
                            var data = new Date(Date.parse("1/1/2000 0:0") + fimVideo);
                            var hora = data.getHours() < 10 ? "0" + data.getHours() : data.getHours()
                            var minutos = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes()
                            var seg = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds()

                            if (data.getHours() > 0)
                                fimVideo = hora + ":" + minutos + ":" + seg
                            else 
                                fimVideo = minutos + ":" + seg

                            document.querySelector("#projectnetwork-fim-video").setAttribute("placeholder", fimVideo)
                        }

                        document.querySelector("#projectnetwork-ini-video").disabled = true;
                        document.querySelector("#projectnetwork-fim-video").disabled = true;
                        window.intervaloReplay = setInterval(function() {
                            if (document.querySelector(".ytp-button-replay") != null || document.querySelector(".html5-main-video").currentTime >= fim) {
                                document.querySelector(".html5-main-video").currentTime = inicio;
                            }
                        }, 1000)

                        this.classList.add("ativo")

                    } else {
                        clearInterval(window.intervaloReplay)
                        document.querySelector("#projectnetwork-ini-video").disabled = false;
                        document.querySelector("#projectnetwork-fim-video").disabled = false;
                        this.classList.remove("ativo")

                        document.querySelector("#projectnetwork-fim-video").setAttribute("placeholder", "00:00")
                    }
                } catch (erro) {
                    chrome.runtime.sendMessage({
                        callBack: "AbrirAlerta",
                        from: "autoReplay",
                        title: "Youtube™ Tools",
                        body: erro.message
                    });
                }
            },false);
            menu.querySelector("li.fechar").addEventListener("click", function() {
                ProjectNetwork.AutoReplay.Toggle();
            }, false)

            var conteudo2 = document.createElement("div");
            conteudo2.id = "conteudo2-ferramentas";
            conteudo2.style.display = "none";
            conteudo2.classList.add("projectnetwork");
            div.appendChild(conteudo2)

            var rodape = document.createElement("div");
            rodape.id = "rodape-ferramentas";
            rodape.classList.add("projectnetwork");
            div.appendChild(rodape)

        },

        /*
        * Constroi html do menu e retorna como string
        */
        _ObterHtmlMenu : function() {
            var html = "<li class='ativo'>REPLAY</li>";
            html += "<li>VERSÃO</li>";
            html += "<li>SOBRE</li>";
            html += "<li class='espaco-vazio' style='width: 135px;'><span>a</span></li>";
            html += "<li class='fechar' style='border-left-width:1px'>X</li>";
            return html
        },

        /*
        * Constroi html do conteudo 'Replay' e retorna como string
        */
        _ObterHtmlReplay: function () {

            

            var html = "<div class='col-3'>";
            html += "<span class='projectnetwork-input-label'> Inicio do vídeo </span>";
            html += "</div>";
            html += "<div class='col-7'>";
            html += "<input placeholder='00:00' id='projectnetwork-ini-video' class='projectnetwork-input-val' />";
            html += "</div>";
            html += "<div class='col-3'>";
            html += "<span class='projectnetwork-input-label'> Final do vídeo </span>";
            html += "</div>";
            html += "<div class='col-7'>";
            html += "<input placeholder='00:00' id='projectnetwork-fim-video' class='projectnetwork-input-val' />";
            html += "</div>";
            html += "<div class='col-3'>";
            html += '<span class="projectnetwork-input-label"></span>';
            html += "</div>";
            html += "<div class='col-7'>";
            html += "<button id='projectnetwork-replay-button' class='projectnetwork-button' style='margin-top:20px' > Ativar </button>";
            html += "</div>";
           
            return html
        },

        /*
        * Abre o dialogo de ferramentas
        */
        Toggle: function (loadPage) {
            
            if (window.location.href.indexOf("youtube.com") > -1 && window.location.href.indexOf("/watch") > -1) {
                if (!ProjectNetwork.VerificarFlash()) {
                    var elemento = document.querySelector("#parent.projectnetwork");
                    var elemento2 = document.querySelector("#dialogo-mensagem.projectnetwork");
                    if (elemento.className.indexOf("aberto") == -1) {
                        elemento.classList.add("animacao")
                        elemento2.classList.add("animacao")

                        setTimeout(function() {
                            elemento.classList.add("aberto")
                            elemento2.classList.add("aberto")
                        }, 100)
                    } else {
                        ProjectNetwork.AutoReplay.Fechar()
                    }
                }
            } else if(loadPage != true){
                
                ProjectNetwork.Socket.postMessage({
                    callback: "AbrirAlerta",
                    from: "autoReplay",
                    title: "Youtube™ Tools",
                    body: "Não é possível abrír o painel para essa página"
                });

            }
        },


        Fechar: function () {
            var elemento = document.querySelector("#parent.projectnetwork");
            var elemento2 = document.querySelector("#dialogo-mensagem.projectnetwork");

            elemento.classList.remove("aberto")
            elemento2.classList.remove("aberto")
            setTimeout(function () {
                elemento.classList.add("animacao")
                elemento2.classList.add("animacao")
            }, 500)
        }

    }

}

ProjectNetwork.Iniciar();