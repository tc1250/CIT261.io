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
    byId('search').addEventListener('input', function () {
        startAt = 1;
    });

    //clear input when the button is pressed
    byId('clearResults').addEventListener('click', function () {
        byId('advanced-2').innerHTML = "";
        byId('searchBox').value = "";
        byId('search').removeChild(byId('forward'));
        byId('search').removeChild(byId('back'));
        byId('count').innerHTML = "";
    });

    //run the search when the enter key is pressed, I hated clicking search every time, so this sped things up
    byId('searchBox').addEventListener('keyup', function (e) {
        if (e.keyCode == 13) {
            byId('searchButton').click();
        }
    });

    //handler that displays modal for adding a custom item
    byId('customButton').addEventListener('click', function () {
        byId('createItem').style.display = 'block';
    });

    //hide the custom item modal
    byId("closeModal").addEventListener('click', function () {
        byId('createItem').style.display = 'none';
    });

    //hide the custom item modal
    byId("closeSearch").addEventListener('click', function () {
        byId('search').style.display = 'none';
    });

    //uses bubbling, was having trouble with the cloned div buttons not having listeners attached because they were being created after I ran the function to add listeners. Attaching the click event to the parent and then running the commands based on the class works every time, because it doesn't matter when the divs are created or cloned, as long as they are in the list, they will function :)
    byId('advanced-1').addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.classList.contains('purchasedButton')) {
            e.target.parentElement.classList.toggle("purchased");
            saveShoppingList();
        }

        if (e.target.classList.contains('deleteButton')) {
            e.target.parentElement.parentElement.removeChild(e.target.parentElement);
            saveShoppingList();
        }
    });

    byId('addItem').addEventListener('click', function () {
        addNewItem();
    });

    // select the target node
    var target = document.querySelector('#advanced-1');

    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            updateTotal();
            saveShoppingList();
        });
    });

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true }

    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    //check localstorage
    if(localStorage.getItem('shoppingList')){
        retrieveShoppingList();
    }
};

//event listener to fire the startup() function on load
window.addEventListener('DOMContentLoaded', startup, false);

//global variables for the AJAX
var startAt = 1;
var numResponseItems = 0;

//AJAX
function getProduct() {
    var searchVar = byId('searchBox').value;
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
            byId('advanced-2').innerHTML = html;
            //calculating what items we are displaying and creating the forward and back buttons
            byId('count').innerHTML = startAt + '-' + (startAt + 4) + ' of ' + numResponseItems + ' items';
            if (!byId('back')) {
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

                var parent = byId('advanced-2').parentNode;
                var sibling = byId('advanced-2');

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

            byId('advanced-2').innerHTML = html;
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
    var itemName = byId('itemName').value;
    var itemId = byId('itemId').value;
    var itemPrice = byId('itemPrice').value;
    var itemPicture = byId('itemPicture').value;
    var itemDescription = byId('itemDescription').value;
    var itemLink = byId('itemLink').value;



    var html = buildListItem(itemId, itemName, itemPrice, itemPicture, itemDescription, itemLink);

    //document.getElementById('advanced-1').innerHTML = html;
    var child = document.createElement('li');
    child.setAttribute('class', 'grid tooltip');
    byId('advanced-1').appendChild(child).innerHTML = html;

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

//keeping the total up-to-date when items are added/removed from the shopping list
function updateTotal() {
    var total = 0;
    var priceArray = byId('advanced-1');
    var query = priceArray.querySelectorAll('.itemPrice');
    for (let price of query) {
        var num = parseFloat(price.innerHTML);
        total = total + num;
    }
    var totalDiv = byId('total')
    totalDiv.innerHTML = "Total: $" + total;
    totalDiv.style.display = 'block';

}

//adding the shopping list to localstorage
function saveShoppingList(){
    var list = byId('advanced-1').innerHTML;
    localStorage.setItem('shoppingList', list);
}
//retrieving the shopping list from localstorage
function retrieveShoppingList(){
    var list = byId('advanced-1');
    list.innerHTML = localStorage.getItem('shoppingList');
}