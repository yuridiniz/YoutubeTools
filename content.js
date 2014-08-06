﻿/*
* Versao em BETA teste
* desenvolvido por Yuri Araujo
*/

"use strict"
var ProjectNetwork = {

    /*
    * Inicia todo o funcionamento
    */
    Iniciar : function() {
        ProjectNetwork.InserirStyleSheet();
        ProjectNetwork.VerificarAtualizacao();
        ProjectNetwork.RemoverAdsDeVideo();
        ProjectNetwork.VerificaExistenciaDeAnuncio();
        ProjectNetwork.AutoReplay.Iniciar();
        ProjectNetwork.AdicionarOuvinte()
    },

    /*
    * Adiciona ouvinte para executar acoes delegada da ENGINE
    */
    AdicionarOuvinte : function() {
        chrome.runtime.onMessage.addListener(function (msg, sender) {
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

        chrome.runtime.sendMessage({
            callBack: "VerificarAtualizacao",
            from: "executarClick",
            title: "Ads removido",
            body: "Ads do youtube acabou de ser removido"
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

                        executarClick();
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

            chrome.runtime.sendMessage({
                callBack: "AbrirAlerta",
                from: "executarClick",
                title: "Ads removido",
                body: "Ads do youtube acabou de ser removido",
                id: Date.now()
            });
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

            var botao = conteudo1.querySelector("#projectnetwork-replay-button");

            botao.addEventListener("click", function() {
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
                    }
                } catch (erro) {
                    chrome.runtime.sendMessage({
                        callBack: "AbrirAlerta",
                        from: "autoReplay",
                        title: "Valores invalidos",
                        body: erro.message
                    });
                }
            },false);


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
            var html = "<li>REPLAY</li>";
            html += "<li>VERSAO</li>";
            html += "<li>SOBRE</li>";
            return html
        },

        /*
        * Constroi html do conteudo 'Replay' e retorna como string
        */
        _ObterHtmlReplay : function() {
            var html = "<div class='col-3'>";
            html += "<span class='projectnetwork-input-label'> Inicio do video </span>";
            html += "</div>";
            html += "<div class='col-7'>";
            html += "<input id='projectnetwork-ini-video' class='projectnetwork-input-val' />";
            html += "</div>";
            html += "<div class='col-3'>";
            html += "<span class='projectnetwork-input-label'> Final do video </span>";
            html += "</div>";
            html += "<div class='col-7'>";
            html += "<input id='projectnetwork-fim-video' class='projectnetwork-input-val' />";
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
        Toggle: function () {
            if (window.location.href.indexOf("youtube.com") > -1 && window.location.href.indexOf("/watch") > -1) {
                var elemento = document.querySelector("#parent.projectnetwork");
                var elemento2 = document.querySelector("#dialogo-mensagem.projectnetwork");
                if (elemento.className.indexOf("aberto") == -1) {
                    elemento.classList.add("animacao")
                    elemento2.classList.add("animacao")


                    setTimeout(function() {
                        elemento.classList.add("aberto")
                        elemento2.classList.add("aberto")
                    }, 500)
                } else {
                    elemento.classList.remove("aberto")
                    elemento2.classList.remove("aberto")
                    setTimeout(function() {
                        elemento.classList.add("animacao")
                        elemento2.classList.add("animacao")
                    }, 500)
                }
            } else {
                chrome.runtime.sendMessage({
                    callBack: "AbrirAlerta",
                    from: "autoReplay",
                    title: "Video não encontrado",
                    body: "Não e possivel abrir o painel para essa pagina"
                });

            }
        },

    }

}

ProjectNetwork.Iniciar();