// Ikonographie Trainer :-)

"use strict";

var randomized = false;
var repeatpics = true;

var artworks;
var nextIndex;

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // console.log("Successfully read!");
        var myObj = JSON.parse(this.responseText);
        // document.getElementById("beschreibung").innerHTML = myObj;
        
        myParse(myObj);
        
        startQuiz();
        
    } else {
	    // console.log("Sorry cannot read (counter=" + i++ + ") readyState=" + this.readyState + " status=" + this.status);
    }
    
};

xmlhttp.open("GET", "quiz.json", true);
xmlhttp.send(); 

function myParse(allLecturesData) {
    
    // This must be removed!
    var selectedLectures = [];
    artworks = [];

    
    if(findGetParameter("repeat") === "true")
        repeatpics = true;
    else
        repeatpics = false;
        
    
    if(findGetParameter("random") === "true")
        randomized = true;
    else
        randomized = false;
        
    var params = findGetParameter("lec");
    
    if (params != null) {
        var selectedLectures = params.split(";");
    }
    
    // console.log(repeatpics);
    // console.log(randomized);
    // console.log(selectedLectures);
    // console.log(findGetParameter("random") + " " + randomized);
    
    for(var lecture of selectedLectures) {
        // console.log(lecture);
        // console.log(allLecturesData[lecture]);
        if(lecture in allLecturesData)
            artworks = artworks.concat(allLecturesData[lecture]);
    }
    
    for(var art of artworks) {
        // console.log(art);
    }
}

function randomizeArray(arr) {

    var newarr = [];
    var pos;
    
    while(arr.length > 0) {
        pos = Math.floor(Math.random()*arr.length);
        newarr = newarr.concat(arr.splice(pos, 1));
    }
    
    return newarr;
}

function startQuiz() {
    
    // console.log("Nonrandomized: " + artworks);
    if(randomized)
        artworks = randomizeArray(artworks);
    // console.log("Randomized: " + artworks);

    nextIndex = 0;

    showNextArtwork();    
 
}   

function onNext() {
    showNextArtwork();
}

// turnaround with repeatpics does not yet work
function onPrevious() {
    if(nextIndex == 1)
        nextIndex = 0;
        else
            if(nextIndex >= 2)
                nextIndex -= 2;
    
    showNextArtwork();
}

function onQuit() {
    window.location.href = "index.html";
}

function showNextArtwork() {
    
    if(nextIndex == artworks.length) {
        alert("Gratulation, du bist fertig!");
        // console.log("You are done!");
    } else {
        
        displayPicAndText("pics/" + artworks[nextIndex] + ".png", "pics/" + artworks[nextIndex] + ".txt");
        
        document.getElementById("mydetails").removeAttribute("open");
        
        // console.log("Showing " + artworks[nextIndex]);
        
        nextIndex++;
        
        // preload next image
        if (nextIndex<artworks.length) {
            document.getElementById("preloadbild").setAttribute("src", "pics/" + artworks[nextIndex] + ".png");
        }
            
    }

    if(nextIndex == artworks.length && repeatpics == true) {
        if(randomized)
            artworks = randomizeArray(artworks);
        nextIndex = 0;
    }
}


function displayPicAndText(picFilename, txtFilename) {
    // console.log(picFilename + " " + txtFilename);
    
    var txtXmlhttp = new XMLHttpRequest();

    txtXmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log("Successfully read txt!");
            document.getElementById("beschreibung").innerHTML = this.responseText;
            
        } else {
    	    // console.log("Sorry cannot read (counter=" + i++ + ") readyState=" + this.readyState + " status=" + this.status);
        }
        
    };
    
    document.getElementById("bild").setAttribute("src", picFilename);
    
    txtXmlhttp.open("GET", txtFilename, true);
    txtXmlhttp.send();    
}

// from: https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
// only added "window." before "location" to remove a warning and extended to find multiple paramters with same id, separated with ";" in returned string
function findGetParameter(parameterName) {
    var result = "",
        tmp = [];
    var items = window.location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) {
            if (result.length > 0)
                result += ";";
            result += decodeURIComponent(tmp[1]);
        }
    }
    return result;
}
