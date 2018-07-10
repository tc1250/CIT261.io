var byId = function (id) { return document.getElementById(id) };

function startup() {
    //draggable results
    [{
        name: 'advanced',
        pull: true,
        put: true
    },
    {
        name: 'advanced',
        pull: true,
        put: true,
    }].forEach(function (groupOpts, i) {
        Sortable.create(byId('advanced-' + (i + 1)), {
            sort: (i != 1),
            handle: '.my-handle',
            group: groupOpts,
            animation: 150
        });
    });

    document.getElementById('search').addEventListener('input', function () {
        startAt = 1;
    });

    document.getElementById('clearResults').addEventListener('click', function () {
        document.getElementById('advanced-2').innerHTML = "";
        document.getElementById('searchBox').value = "";
        document.getElementById('search').removeChild(document.getElementById('forward'));
        document.getElementById('search').removeChild(document.getElementById('back'));
        document.getElementById('count').innerHTML = "";
    });

};

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);
var startAt = 1;
var numResponseItems = 0;
//AJAX
function getProduct() {
    var searchVar = document.getElementById('searchBox').value;
    var responseObj;
    var html = "";
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            responseObj = JSON.parse(this.responseText);
            numResponseItems = responseObj.totalResults;
            for (let object of responseObj.items) {
                html += '<li class="grid"><p><span class="my-handle">☰</span>Item ID: ' + object.itemId + '</p><p> Item Name: ' + object.name + '</p><p> Item Price: ' + object.salePrice + '</p><img src="' + object.thumbnailImage + '" height="100px" width="auto"></li>';
            }

            document.getElementById('advanced-2').innerHTML = html;
            document.getElementById('count').innerHTML = startAt + '-' + (startAt + 4) + ' of ' + numResponseItems + ' items';
            if (!document.getElementById('back')) {
                var child1 = document.createElement('button');
                var child2 = document.createElement('button');

                child1.setAttribute('type', 'button');
                child1.setAttribute('onclick', "back()");
                child1.setAttribute('id', 'back');
                var child1Text = document.createTextNode('<');
                child1.appendChild(child1Text);

                child2.setAttribute('type', 'button');
                child2.setAttribute('onclick', "forward()");
                child2.setAttribute('id', 'forward');
                var child2Text = document.createTextNode('>');
                child2.appendChild(child2Text);

                var parent = document.getElementById('advanced-2').parentNode;
                var sibling = document.getElementById('advanced-2');

                parent.insertBefore(child1, sibling);
                parent.insertBefore(child2, sibling);

            }


        }
    };
    xmlhttp.open("GET", 'https://cors-anywhere.herokuapp.com/http://api.walmartlabs.com/v1/search?apiKey=vkyhkt2h8gum2y6bx92yreea&query=' + searchVar + '&numItems=5&start=' + startAt, true);
    xmlhttp.send();

}

function getTaxonomy() {
    var responseObj;
    var html = "";
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            responseObj = JSON.parse(this.responseText);
            html = '<pre>' + JSON.stringify(responseObj, null, 2) + '</pre>';

            document.getElementById('advanced-2').innerHTML = html;
        }
    };
    xmlhttp.open("GET", 'https://cors-anywhere.herokuapp.com/http://api.walmartlabs.com/v1/taxonomy?apiKey=vkyhkt2h8gum2y6bx92yreea', true);
    xmlhttp.send();

}

function forward() {
    if (startAt < numResponseItems) {
        startAt = startAt + 25;
        getProduct();
    }
}



function back() {
    if (startAt > 25) {
        startAt = startAt - 25;
        getProduct();
    }
}

