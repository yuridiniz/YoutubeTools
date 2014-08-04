

remover = function(buscando) {
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

executarClick = function () {
    var video = document.querySelector(".html5-main-video");

    if (video.editado != true) {
        video.volumeEditavel = video.volume;
        video.volume = 0;
        video.currentTime = 10;
    }

    video.editado = true;

    if (video.readyState != 4 && document.querySelector(".videoAdUi") != null) {
        document.querySelector(".videoAdUi").style.opacity = "0"
        video.style.opacity = 0
        setTimeout(function() {
            executarClick();
        },100)

        return
    }

    if (video.editado != true) {
        video.volumeEditavel = video.volume;
        video.volume = 0;
        video.currentTime = 10;
    }



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
        console.log("%cremovido", "color:green")
        video.style.opacity = 1
        video.volume = video.volumeEditavel;
        chrome.runtime.sendMessage({
            from: "executarClick",
            title: "Ads removido",
            body: "Ads do youtube acabou de ser removido"
        });
    }
}

remover()