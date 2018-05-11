function loops() {
    var output = document.getElementById("loopOutput");
    var running = true;
    var result = "0";
    var count = 1;
    while (running) {
        result +="\n"+count;
        count++;
        if(count>9){
            running = false;
        }
    }
    output.innerHTML = result;
}

function resetLoops() {
    var output = document.getElementById("loopOutput");
    output.innerHTML = "";
}

function conditional() {
    var isTrue="";
    values = document.getElementsByName("1");
    for(var i = 0; i< values.length; i++){
        if(values[i].checked){
            isTrue = values[i].value;
        }
    }

    if(isTrue=="True"){
        document.getElementById("conditionalOutput").innerHTML="<h1>True</h1>"
    }else if(isTrue=="False") {
        document.getElementById("conditionalOutput").innerHTML="<h1>False</h1>"
    }else{
        document.getElementById("conditionalOutput").innerHTML="<p>Did you select one of the radio buttons?</p>"
    }
}

function resetConditional() {
    document.getElementById("conditionalOutput").innerHTML="";
}

function myFunction() {
    var inputText = document.getElementById("functionInput").value;
    document.getElementById("functionOutput").innerHTML="<p>This is your variable: " + inputText+"</p>"
}

function resetFunction() {
    document.getElementById("functionOutput").innerHTML="";
}

function parameter(){
    var input = document.getElementById("parameterInput").value;
    useAparameter(input);
}

function useAparameter(input){
    document.getElementById("parameterOutput").innerHTML = "<p>This is your variable: " + input +"</p>"
}

function resetParameter() {
    document.getElementById("parameterOutput").innerHTML ="";
}

function array() {
    var myArray = new Array("apple","dog",1,5.4);
    document.getElementById("arrayOutput").innerHTML="";
    for(let value of myArray){
        document.getElementById("arrayOutput").innerHTML+=value+"\n";
    }
}

function resetArray() {
    document.getElementById("arrayOutput").innerHTML="";
}

function associativeArray() {
    var myObj = {"Tyler":30,"Hannah":26,"Samuel":3,"Aaron":1};
    document.getElementById("associativeArrayOutput").innerHTML="";
    
    for(let person in myObj)
    {
        
        document.getElementById("associativeArrayOutput").innerHTML+= person + " = " + myObj[person] + '<br>';
    }
}

function resetAssociativeArray() {
    document.getElementById("associativeArrayOutput").innerHTML="";
}