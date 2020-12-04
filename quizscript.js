// Ikonographie Trainer :-)

"use strict";

var randomized = false;
var repeatpics = true;

var artworks;
var artworkshistory;
const MAXHISTORY = 30;

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
    artworkshistory = [];

    
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

    showNextArtwork();    
 
}   

function onNext() {

    if(artworkshistory.length == MAXHISTORY)
        artworkshistory.shift();
    artworkshistory.push(artworks);
    
    // console.log("Vor rollforward: " + artworks);
    artworks = rollforward(artworks);
    // console.log("Nach rollforward: " + artworks);
    
    if(repeatpics == false) {
        artworks.pop();
    }

    showNextArtwork();
    
}

function onNextNotKnown() {

    if(artworkshistory.length == MAXHISTORY)
        artworkshistory.shift();
    artworkshistory.push(artworks);
    
    artworks = rollforward(artworks);

    showNextArtwork();
}

function rollforward(arr) {
    if(arr.length > 0)
        return Array().concat(arr.slice(1, arr.length), arr[0]);
    else
        return Array(0);
}


function rollback(arr) {
    if(arr.length > 0)
        return Array().concat(arr[arr.length-1], arr.slice(0, arr.length-1));
    else
        return Array(0);
}


function onPrevious() {
    
    if(artworkshistory.length > 0) {
        artworks = artworkshistory.pop();
        showNextArtwork();
    }
    
    // console.log("Vor rollback: " + artworks);
    //artworks = rollback(artworks);
    // console.log("Nach rollback: " + artworks);

    //showNextArtwork();
}


function onQuit() {
    window.location.href = "index.html";
}


function showNextArtwork() {
    
    if(artworks.length == 0) {
        alert("Gratulation, du bist fertig! Yuppie!!!");
        // console.log("You are done!");
    } else {
        
        displayPicAndText("pics/" + artworks[0] + ".png", "pics/" + artworks[0] + ".txt");
        
        document.getElementById("mydetails").removeAttribute("open");
        
        // preload next image
        if (artworks.length >= 2) {
            document.getElementById("preloadbild").setAttribute("src", "pics/" + artworks[1] + ".png");
        }
    
    }

    document.getElementById("anzahl").innerHTML = "Bilder: " + artworks.length;
    
    /*if(nextIndex == artworks.length && repeatpics == true) {
        if(randomized)
            artworks = randomizeArray(artworks);
        nextIndex = 0;
    }*/
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
