//creates listeners 
function startup() {
    var target = document.getElementsByTagName('figure');
   
    for (let object of target){
        object.addEventListener('mouseover',function(){
            this.className += " focus";
        });
        object.addEventListener('mouseout', function(){
            this.className = this.className.replace(" focus","");
        });
        object.addEventListener('mousedown',function(){
            this.className += " click";
        });
        object.addEventListener('mouseup', function(){
            this.className = this.className.replace(" click","");
        });
    }
}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);