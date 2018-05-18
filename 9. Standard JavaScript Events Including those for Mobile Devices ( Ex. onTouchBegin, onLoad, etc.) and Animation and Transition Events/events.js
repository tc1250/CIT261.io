//creates listeners for the touch interfaces
function startup() {
    var box = document.getElementById("touchme");
    var status = document.getElementById("status");
    var btn = document.getElementById("reset");

    box.addEventListener('touchstart',function(e){
        status.innerHTML = '<p>Started Touch</p>';
        e.preventDefault();
    });

    box.addEventListener('touchmove',function(e){
        status.innerHTML = '<p>Moving Now!</p>';
        e.preventDefault();
    });

    box.addEventListener('touchend',function(e){
        status.innerHTML = '<p>Ended Touch</p>';
        e.preventDefault();
    });

    box.addEventListener('mouseout',function(){
        status.innerHTML = '<p>Moved away from imput div!</p>';
    })

    box.addEventListener('mouseenter',function(){
        status.innerHTML = '<p>Hovered over input div!</p>';
    })

    btn.addEventListener('click',function(){
        status.innerHTML = "";
    })
}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);

