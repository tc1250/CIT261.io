//creates listeners 
function startup() {
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

    document.getElementById('create').addEventListener('click', function () {
        createLoginDiv();
        document.getElementById('id01').setAttribute('style','display:block');
    });
}

//event listener to fire the startup() funciton on load
window.addEventListener('DOMContentLoaded', startup, false);

function createLoginDiv() {
    //this is all code adapted from a w3 schools example of a modal div
    //https://www.w3schools.com/howto/howto_css_login_form.asp
    //I've converted it all so it uses javaScript to create and append the elements to the DOM

    var appendTo = document.getElementById("contentArea");

    var mainDiv = document.createElement('DIV');
    mainDiv.setAttribute('id', 'id01');
    mainDiv.setAttribute('class', 'modal');

    var closeSpan = document.createElement('SPAN');
    closeSpan.setAttribute('onclick', "document.getElementById('id01').style.display='none'");
    closeSpan.setAttribute('class', 'close');
    closeSpan.setAttribute('title', 'Close Modal');
    //var spanText = document.createTextNode("&times;");
    //closeSpan.appendChild(spanText);

    var loginForm = document.createElement('FORM');
    loginForm.setAttribute('class', "modal-content animate");

    var imgDiv = document.createElement('DIV');
    imgDiv.setAttribute('class', "imgcontainer");

    var avatarImg = document.createElement('IMG');
    avatarImg.setAttribute('src', "img_avatar2.jpg");
    avatarImg.setAttribute('alt', "Avatar");
    avatarImg.setAttribute('class', "avatar");
    imgDiv.appendChild(avatarImg);

    var exampleContainer = document.createElement('DIV');
    exampleContainer.setAttribute('class', 'exampleContainer');

    var unameLabel = document.createElement('LABEL');
    unameLabel.setAttribute('for', 'uname');
    unameLabel.setAttribute('style','font-weight:bold');
    var unameLabelText = document.createTextNode('Username');
    unameLabel.appendChild(unameLabelText);

    var unameInput = document.createElement('INPUT');
    unameInput.setAttribute('type', 'text');
    unameInput.setAttribute('placeholder', 'Enter Username');
    unameInput.setAttribute('name', 'psw');
    unameInput.setAttribute('required', 'true');

    var pswLabel = document.createElement('LABEL');
    pswLabel.setAttribute('for', 'psw');
    pswLabel.setAttribute('style','font-weight:bold');
    var pswLabelText = document.createTextNode('Password');
    pswLabel.appendChild(pswLabelText);

    var pswInput = document.createElement('INPUT');
    pswInput.setAttribute('type', 'password');
    pswInput.setAttribute('placeholder', 'Enter Password');
    pswInput.setAttribute('name', 'psw');
    pswInput.setAttribute('required', 'true');

    var submitButton = document.createElement('BUTTON');
    submitButton.setAttribute('type', 'submit');
    var submitButtonText = document.createTextNode('Log In');
    submitButton.appendChild(submitButtonText);

    var exampleContainer2 = document.createElement('DIV');
    exampleContainer2.setAttribute('class', 'exampleContainer');
    exampleContainer2.setAttribute('style', "background-color:#f1f1f1");

    var cancelButton = document.createElement('BUTTON');
    cancelButton.setAttribute('type', 'button');
    cancelButton.setAttribute('onclick', "removeChildNodes()");
    cancelButton.setAttribute('class', 'cancelbtn');
    var cancelButtonText = document.createTextNode('Cancel');
    cancelButton.appendChild(cancelButtonText);

    var forgotSpan = document.createElement('SPAN');
    forgotSpan.setAttribute('class', 'psw');
    var forgotSpanLink = document.createElement('A');
    forgotSpanLink.setAttribute('href', '#');
    var forgotSpanLinkText = document.createTextNode('Forgot Password?');
    forgotSpanLink.appendChild(forgotSpanLinkText);
    forgotSpan.appendChild(forgotSpanLink);

    exampleContainer.appendChild(unameLabel);
    exampleContainer.appendChild(unameInput);
    exampleContainer.appendChild(pswLabel);
    exampleContainer.appendChild(pswInput);
    exampleContainer.appendChild(submitButton);

    exampleContainer2.appendChild(cancelButton);
    exampleContainer2.appendChild(forgotSpan);

    loginForm.appendChild(imgDiv);
    loginForm.appendChild(exampleContainer);
    loginForm.appendChild(exampleContainer2);

    mainDiv.appendChild(closeSpan);
    mainDiv.appendChild(loginForm);

    //document.body.appendChild(mainDiv);
    appendTo.appendChild(mainDiv);
}

function removeChildNodes() {
    var contentAreaDelete = document.getElementById('contentArea');
    var toDelete = contentAreaDelete.childNodes;
    for (let node of toDelete){
        parent = node.parentNode;
        parent.removeChild(node);
    }

}