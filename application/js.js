//creates listeners 
function startup() {
    //setting up the XMLHTTPRequest
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseObj = JSON.parse(this.responseText);
            document.getElementById('response').innerHTML = JSON.stringify(responseObj, null, 2);
        }
    };
    
    xmlhttp.open("GET", 'https://cors-anywhere.herokuapp.com/http://api.walmartlabs.com/v1/search?apiKey=vkyhkt2h8gum2y6bx92yreea&query=ipod', true);
    //xmlhttp.setRequestHeader('Access-Control-Allow-Origin','*');
    //xmlhttp.setRequestHeader('X-Originating-IP', '73.65.199.32');
    //xmlhttp.withCredentials = 'true';
    xmlhttp.send();

}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);

