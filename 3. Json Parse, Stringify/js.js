//creates listeners 
function startup() {
    var destination = document.getElementById('jsonexample');
    var target = document.getElementsByTagName('figure');
    var requestURL = 'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var response = request.response;
        destination.innerHTML = JSON.stringify(response,null,2);
    };
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
    document.addEventListener('keydown',function(e){
        for(let object of target){
            object.className += " keypress";
        } 
    });
    document.addEventListener('keyup', function(e){
        for(let object of target){
            object.className = "";
        }
    });

}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);