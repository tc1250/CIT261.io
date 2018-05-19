function Person(){
    this.name = 'Tyler';
    this.occupation = 'Systems Administrator';
}
Person.prototype.greeting = function(){
    document.getElementById('objectOutput').innerHTML = '<p>Hi I\'m '+ this.name +' and I\'m a '+ this.occupation +'</p>';
}

function Student(){
    Person.call(this);
}
Student.prototype = Object.create(Person.prototype);


function startup() {
    var clickBox = document.getElementById("outputClick");
    var output = document.getElementById('objectOutput');
    clickBox.addEventListener('click',function(){
        var tyler = new Student();
        tyler.greeting();
    })
}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);

function reset() {
    document.getElementById('objectOutput').innerHTML = "";
}