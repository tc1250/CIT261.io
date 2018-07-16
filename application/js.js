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
            //handle: '.my-handle',
            group: groupOpts,
            animation: 150,
            fallbackTolerance: 100
        });
    });

    //when new input is detected, set the startAt parameter back to 1 so we start the search list from the beginning
    byId('search').addEventListener('input', function () {
        startAt = 1;
    });

    byId('searchBox').addEventListener('input', function () {
        byId('searchBox').classList.remove('invalid');
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
            e.target.parentElement.parentElement.classList.toggle("purchased");
            saveShoppingList();
            updateButtonText(e);
        }

        if (e.target.classList.contains('deleteButton')) {
            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
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
    if (localStorage.getItem('shoppingList')) {
        retrieveShoppingList();
    }

    var tooltips = document.getElementsByClassName('tooltip');
    for (let element of tooltips) {
        element.addEventListener('hover', function (e) {
            e.target.querySelector('tooltiptext').style.visibility = 'visible';
        });
    }

    //reset any fields that were marked invalid during validation
    byId('itemName').addEventListener('input', function (e) {
        byId('itemName').classList.remove('invalid');
    });

    byId('itemId').addEventListener('input', function (e) {
        byId('itemId').classList.remove('invalid');
    });

    byId('itemPrice').addEventListener('input', function (e) {
        byId('itemPrice').classList.remove('invalid');
    });

    byId('itemPicture').addEventListener('input', function (e) {
        byId('itemPicture').classList.remove('invalid');
    });

    byId('itemDescription').addEventListener('input', function (e) {
        byId('itemDescription').classList.remove('invalid');
    });

    byId('itemLink').addEventListener('input', function (e) {
        byId('itemLink').classList.remove('invalid');
    });

};

//event listener to fire the startup() function on load
window.addEventListener('DOMContentLoaded', startup, false);

//global variables for the AJAX
var startAt = 1;
var numResponseItems = 0;

//AJAX
function getProduct() {
    var searchVar = byId('searchBox').value;
    //validate that searchbox is not empty
    if (searchVar == null || searchVar == "") {
        byId('searchBox').classList.add('invalid');
        return false;
    }
    byId('searchBox').classList.remove('invalid');
    var responseObj;
    var html = '<div class="row"><div class="col-3 center"><p>Item ID</p></div><div class="col-2 center"><p>Item Name</p></div><div class="col-3 center"><p>Item Price</p></div><div class="col-3 center"><p>Image</p></div></div><div class=row><div class="col-1"><hr></div></div>';
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
        } else {
            byId('advanced-2').innerHTML = "<div class='loader'></div>"
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

    if (itemName == null || itemName == "") {
        byId('itemName').classList.toggle('invalid');

        return false;
    }

    if (itemPrice == null || itemPrice == "") {
        byId('itemPrice').classList.add('invalid');
        return false;
    }

    if(isNaN(itemPrice)){
        byId('itemPrice').classList.add('invalid');
        return false;
    }

    if (itemPicture == null || itemPicture == "") {
        itemPicture = "Images/no_image.png";
    }

    if (itemDescription == null || itemDescription == "") {
        itemDescription = "No description entered for this item.";
    }

    if (itemLink == null || itemLink == "") {
        itemLink = "<a href='.'>No link was added</a>";
    }else{
        itemLink = "<a href="+itemLink+">Link to Item</a>"
    }

    if (itemId == null || itemId == "") {
        itemId = "000000";
    }
    var html = buildListItem(itemId, itemName, itemPrice, itemPicture, itemDescription, itemLink);

    //document.getElementById('advanced-1').innerHTML = html;
    var child = document.createElement('li');
    child.setAttribute('class', 'tooltip row');
    byId('advanced-1').appendChild(child).innerHTML = html;

    byId('itemName').innerHTML = "";
    byId('itemId').innerHTML = "";
    byId('itemPrice').innerHTML = "";
    byId('itemPicture').innerHTML = "";
    byId('itemDescription').innerHTML = "";
    byId('itemLink').innerHTML = "";

    byId("closeModal").click();
}

//builds the <li> items for the lists. 
function buildListItem(itemId, name, salePrice, thumbnailImage, itemDescription, itemLink) {
    var listItem;
    if ((typeof itemLink !== "undefined")) {
        listItem = '<div class="col-3"><p><span class="my-handle">☰</span>' + itemId + '</p></div><div class="col-2"><p>' + name + '</p></div><div class="col-3 center"><p>$<span  class="itemPrice">' + salePrice + '</span></p></div><div class="col-3 center"><img style="max-height:50px;" src="' + thumbnailImage + '"></div><div class="col-1">' + itemLink + '</div><div class="col-1"><button class="deleteButton">Delete</button><button class="purchasedButton">Mark as Purchased</button></div><span class="tooltiptext">' + itemDescription + '</span>';
    } else {
        listItem = '<li class="tooltip row"><div class="col-3"><p><span class="my-handle">☰</span>' + itemId + '</p></div><div class="col-2"><p>' + name + '</p></div><div class="col-3 center"><p>$<span  class="itemPrice">' + salePrice + '</span></p></div><div class="col-3 center"><img style="max-height:50px;" src="' + thumbnailImage + '"></div><div class="col-1"><button class="deleteButton">Delete</button><button class="purchasedButton">Mark as Purchased</button></div><span class="tooltiptext">' + itemDescription + '</span></li>';
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
    totalDiv.innerHTML = "Total: $" + total.toFixed(2);
    totalDiv.style.display = 'block';

}

//adding the shopping list to localstorage
function saveShoppingList() {
    var list = byId('advanced-1').innerHTML;
    localStorage.setItem('shoppingList', list);
}
//retrieving the shopping list from localstorage
function retrieveShoppingList() {
    var list = byId('advanced-1');
    list.innerHTML = localStorage.getItem('shoppingList');
}

//update purchased button text
function updateButtonText(e) {
    var button = e.target;
    if (button.parentElement.parentElement.classList.contains('purchased')) {
        button.innerHTML = "Undo";
    } else {
        button.innerHTML = "Mark as Purchased";
    }
}