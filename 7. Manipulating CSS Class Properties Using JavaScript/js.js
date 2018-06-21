//creates listeners 
function startup() {
    /*var target = document.getElementsByClassName('card');
   
    for (let object of target){
        object.addEventListener('mouseover',function(){
            this.classList.add("focus");
        });
        object.addEventListener('mouseout', function(){
            this.classList.remove("focus");
        });
        object.addEventListener('mousedown',function(){
            this.classList.add("click");
        });
        object.addEventListener('mouseup', function(){
            this.classList.remove("click");
        });
    }*/

    var accordianElements = document.getElementsByClassName('accordion');

    for(let element of accordianElements){
        element.addEventListener('mouseover',function(){
            this.classList.add('active');
            var panel = this.nextElementSibling;
            panel.style.maxHeight = panel.scrollHeight + "px";
 
        });
        element.addEventListener('mouseout',function(){
            this.classList.remove('active');
            var panel = this.nextElementSibling;
            panel.style.maxHeight = null;
        });
    }
}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);

//find the elements of the accordian and toggle css class on mouseover
