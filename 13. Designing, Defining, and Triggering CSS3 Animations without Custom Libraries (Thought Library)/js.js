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

    var button = document.getElementsByClassName('js-menu-button');
    for (let object of button) {
        children = object.childNodes;
        for (let child of children)
                child.addEventListener('click', function () {
                child.classList.toggle('is-active');
            });
    }

}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);

function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
    document.getElementById("main").style.marginLeft = "300px";
    var buttons = document.getElementsByClassName('actual-button');
    for(let element of buttons){
        element.setAttribute("onClick","closeNav()");
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    var buttons = document.getElementsByClassName('actual-button');
    for(let element of buttons){
        element.setAttribute("onClick","openNav()");
    }
}