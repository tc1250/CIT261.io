//creates listeners 
function startup() {
    //setting up listeners to highlight the figures
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
}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);

//setting up localstorage stuff
var htmlElement = document.getElementsByClassName('card');
var pElement = document.querySelectorAll('p');

//forms
var bgColorForm = document.getElementById('bgcolor');
var fontForm = document.getElementById('font');
var nameForm = document.getElementById('name');
var ageForm = document.getElementById('age');
var occupationForm = document.getElementById('occupation');

//check for prior values, fill them in if they are present
if (!localStorage.getItem('bgcolor')) {
    addToStorage();
} else {
    setValues();
}

//add to storage
function addToStorage() {
    localStorage.setItem('bgcolor', document.getElementById('bgcolor').value);
    localStorage.setItem('font', document.getElementById('font').value);

    var name, age, occupation;

    name = document.getElementById('name').value;
    age = document.getElementById('age').value;
    occupation = document.getElementById('occupation').value;

    var storageObject = { 'name': name, 'age': age, 'occupation': occupation };

    localStorage.setItem('storageObject', JSON.stringify(storageObject));

    setValues();
}

function setValues() {
    var currentColor = localStorage.getItem('bgcolor');
    var currentFont = localStorage.getItem('font');
    var storageItems = JSON.parse(localStorage.getItem('storageObject'));

    document.getElementById('bgcolor').value = currentColor;
    document.getElementById('font').value = currentFont;
    document.getElementById('name').value = storageItems['name'];
    document.getElementById('age').value = storageItems['age'];
    document.getElementById('occupation').value = storageItems['occupation'];

    for (let element of htmlElement) {
        element.style.backgroundColor=currentColor;
    }
    for (let p of pElement) {
        p.style.fontFamily = currentFont;
    }

    if ('name' in storageItems && storageItems.name.length > 0) {
        document.getElementById('nameElement').innerHTML = '<br/>Welcome back, ' + storageItems['name'];
    }

    if ('age' in storageItems && storageItems.age.length > 0) {
        document.getElementById('ageElement').innerHTML = '<br/>You are ' + storageItems['age'] + ' years old';
    }

    if ('occupation' in storageItems && storageItems.occupation.length > 0) {
        document.getElementById('occupationElement').innerHTML = '<br/>You work as a ' + storageItems['occupation'];
    }
}

bgColorForm.onchange = addToStorage;
fontForm.onchange = addToStorage;
nameForm.onchange = addToStorage;
ageForm.onchange = addToStorage;
occupationForm.onchange = addToStorage;