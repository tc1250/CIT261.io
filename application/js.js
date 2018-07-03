//creates listeners 
function startup() {
    var target = document.getElementsByTagName('figure');

    for (let object of target) {
        object.addEventListener('mouseover', function () {
            this.className += " focus";
        });
        object.addEventListener('mouseout', function () {
            this.className = this.className.replace(" focus", "");
        });
        object.addEventListener('mousedown', function () {
            this.className += " click";
        });
        object.addEventListener('mouseup', function () {
            this.className = this.className.replace(" click", "");
        });
    }

    var video = document.getElementById("myVideo");
    var btn = document.getElementById("myBtn");

    btn.addEventListener('click', function () {
        if (video.paused) {
            video.play();
            btn.innerHTML = "Pause";
        } else {
            video.pause();
            btn.innerHTML = "Play";
        }
    });
    canvas();
}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);

//canvas stuff
function canvas() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 12.5, 800, 75);
    ctx.font = "16px Arial";
    ctx.fillStyle='#f1f1f1';
    ctx.textAlign = "center";
    ctx.fillText("Created by Tyler Christensen 2018", 400, 56);
}