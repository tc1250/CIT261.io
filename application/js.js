var byId = function (id) { return document.getElementById(id) };

function startup() {
    //make the lists draggable
    [{
        //the actual list, can pull out of and insert into
        name: 'advanced',
        pull: true,
        put: true
    },
    {
        //the search list, can pull out copies but not insert back into
        name: 'advanced',
        pull: 'clone',
        put: false,
    }].forEach(function (groupOpts, i) {
        Sortable.create(byId('advanced-' + (i + 1)), {
            sort: (i != 1),
            handle: '.my-handle',
            group: groupOpts,
            animation: 150
        });
    });

    //when new input is detected, set the startAt parameter back to 1 so we start the search list from the beginning
    document.getElementById('search').addEventListener('input', function () {
        startAt = 1;
    });

    //clear input when the button is pressed
    document.getElementById('clearResults').addEventListener('click', function () {
        document.getElementById('advanced-2').innerHTML = "";
        document.getElementById('searchBox').value = "";
        document.getElementById('search').removeChild(document.getElementById('forward'));
        document.getElementById('search').removeChild(document.getElementById('back'));
        document.getElementById('count').innerHTML = "";
    });

    //run the search when the enter key is pressed, I hated clicking search every time, so this sped things up
    document.getElementById('searchBox').addEventListener('keyup', function (e) {
        if (e.keyCode == 13) {
            document.getElementById('searchButton').click();
        }
    });

    //handler that displays modal for adding a custom item
    document.getElementById('customButton').addEventListener('click', function () {
        document.getElementById('createItem').style.display = 'block';
    });

    //hide the custom item modal
    document.getElementsByClassName("close")[0].addEventListener('click', function () {
        document.getElementById('createItem').style.display = 'none';
    });

    //uses bubbling, was having trouble with the cloned div buttons not having listeners attached because they were being created after I ran the function to add listeners. Attaching the click event to the parent and then running the commands based on the class works every time, because it doesn't matter when the divs are created or cloned, as long as they are in the list, they will function :)
    document.getElementById('advanced-1').addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.classList.contains('purchasedButton')) {
            e.target.parentElement.classList.toggle("purchased");
        }

        if (e.target.classList.contains('deleteButton')) {
            e.target.parentElement.parentElement.removeChild(e.target.parentElement);
        }
    });

    document.getElementById('addItem').addEventListener('click', function () {
        addNewItem();
    });

    // select the target node
    var target = document.querySelector('#advanced-1');

    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            console.log(mutation.type);
            updateTotal();
        });
    });

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true }

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
};

//event listener to fire the startup() function on load
window.addEventListener('DOMContentLoaded', startup, false);

//global variables for the AJAX
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
            //build the items to display, calls a separate function that returns the HTML string
            for (let object of responseObj.items) {
                html += buildListItem(object.itemId, object.name, object.salePrice, object.thumbnailImage, object.shortDescription);
            }
            //add list items to DOM
            document.getElementById('advanced-2').innerHTML = html;
            //calculating what items we are displaying and creating the forward and back buttons
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
    //I was getting CORS errors trying to call the API, so I'm just using a proxy to do the calls now
    xmlhttp.open("GET", 'https://cors-anywhere.herokuapp.com/http://api.walmartlabs.com/v1/search?apiKey=vkyhkt2h8gum2y6bx92yreea&query=' + searchVar + '&numItems=5&start=' + startAt, true);
    xmlhttp.send();

}

//for the Taxonomy page, I was trying to show fresh, in-store items, and was trying to find the categories for them. I can't actually get those items from this API unfortunately, so I changed from a grocery list to a christmas shopping list
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

//called when the forward and back buttons are clicked in the search box
//they use those global variables from above
function forward() {
    if (startAt < numResponseItems) {
        startAt = startAt + 5;
        getProduct();
    }
}

function back() {
    if (startAt > 5) {
        startAt = startAt - 5;
        getProduct();
    }
}

//adding custom items (ie not from the Walmart search)
function addNewItem() {
    var itemName = document.getElementById('itemName').value;
    var itemId = document.getElementById('itemId').value;
    var itemPrice = document.getElementById('itemPrice').value;
    var itemPicture = document.getElementById('itemPicture').value;
    var itemDescription = document.getElementById('itemDescription').value;
    var itemLink = document.getElementById('itemLink').value;



    var html = buildListItem(itemId, itemName, itemPrice, itemPicture, itemDescription, itemLink);

    //document.getElementById('advanced-1').innerHTML = html;
    var child = document.createElement('li');
    child.setAttribute('class', 'grid tooltip');
    document.getElementById('advanced-1').appendChild(child).innerHTML = html;

    itemName.innerHTML = "";
    itemId.innerHTML = "";
    itemPrice.innerHTML = "";
    itemPicture.innerHTML = "";
    itemDescription.innerHTML = "";
    itemLink.innerHTML = "";

    document.getElementsByClassName("close")[0].click();
}

//builds the <li> items for the lists. 
function buildListItem(itemId, name, salePrice, thumbnailImage, itemDescription, itemLink) {
    var listItem;
    if ((typeof itemLink !== "undefined")) {
        listItem = '<p><span class="my-handle">☰</span>Item ID: ' + itemId + '</p><p> Item Name: ' + name + '</p><p> Item Price: <span  class="itemPrice">' + salePrice + '</span></p><p>Item Link: ' + itemLink + '</p><img src="' + thumbnailImage + '" height="100px" width="auto"><button class="deleteButton">Delete</button><button class="purchasedButton">Purchased</button><span class="tooltiptext">' + itemDescription + '</span>';
    } else {
        listItem = '<li class="grid tooltip"><p><span class="my-handle">☰</span>Item ID: ' + itemId + '</p><p> Item Name: ' + name + '</p><p> Item Price: <span  class="itemPrice">' + salePrice + '</span></p><img src="' + thumbnailImage + '" height="100px" width="auto"><button class="deleteButton">Delete</button><button class="purchasedButton">Purchased</button><span class="tooltiptext">' + itemDescription + '</span></li>';
    }


    return listItem;
}

function updateTotal() {
    var total = 0;
    var priceArray = document.getElementById('advanced-1');
    var query = priceArray.querySelectorAll('.itemPrice');
    for(let price of query){
        var num = parseFloat(price.innerHTML);
        total = total + num;
        console.log(num);
    }


    document.getElementById('total').innerHTML = total;
}