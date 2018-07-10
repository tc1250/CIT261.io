function startup() {
    if (document.getElementById('results')) {
        Sortable.create(results, {
            handle: '.my-handle',
            animation: 150
        });
    }

};

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);

//AJAX
function xhr() {
    var searchVar = document.getElementById('searchBox').value;

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseObj = JSON.parse(this.responseText);
            var html;
            for (let object of responseObj.items) {
                html += '<li><p><span class="my-handle">☰</span>Item ID: ' + object.itemId + '</p><p> Item Name: ' + object.name + '</p><img src="' + object.thumbnailImage + '" height="100px" width="auto"></li>';
            }
            document.getElementById('results').innerHTML = html;
        }
    };
    xmlhttp.open("GET", 'https://cors-anywhere.herokuapp.com/http://api.walmartlabs.com/v1/search?apiKey=vkyhkt2h8gum2y6bx92yreea&query=' + searchVar + '&sort=relevance', true);
    xmlhttp.send();

}