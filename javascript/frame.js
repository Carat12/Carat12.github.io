function menuHover(elem){
    elem.style.backgroundColor = "rgb(136,23,152)";
}
function menuOut(elem){
    elem.style.backgroundColor = "rgba(255,255,255,0)";
}
function menuClick(id){
    location.href = id + ".html";
}
function play(audio,album,src){
    var elem = document.getElementById(audio);
    var al = document.getElementById(album);
    if(elem.paused){
        elem.play();
        al.src = src + ".gif";
    }else{
        elem.pause();
        al.src = src + ".jpg";
    }
}
