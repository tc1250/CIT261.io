//creates listeners 
function startup() {
    //setting up the listeners to highlight the code figures
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
    //setting up the XMLHTTPRequest
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseObj = JSON.parse(this.responseText);
            for (let obj in responseObj){
                document.getElementById('demo').innerHTML += 'Name: ' + responseObj[obj].name + ' | ID: ' + responseObj[obj].id+ '<br/>';
            }
            document.getElementById('response').innerHTML = JSON.stringify(responseObj,null,2);
        }
    };
    xmlhttp.open("GET", 'https://jsonplaceholder.typicode.com/users', true);
    xmlhttp.send();
}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);