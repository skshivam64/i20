const { ipcRenderer } = require('electron');


var remainingTime; 
var focusMode;
var actionBtns;

const focusTime = 20*60; // 20 mins
const relaxTime = 20; // 20 seconds

var pause;

var message;
var btns;

function setRemainingTime(val){
    remainingTime = val;
}

function init(){
    message = document.getElementById("instruction-container");
    btns = document.getElementById("btns-container");
    actionBtns = document.getElementsByClassName("act-btn");
    actionBtns[0].addEventListener("click", () => {
        pause = !pause;
        if(pause){
            actionBtns[0].innerHTML = "Resume";
            actionBtns[0].classList.add("success");
            actionBtns[0].classList.remove('danger');
        }
        else{
            actionBtns[0].innerHTML = "Pause";
            actionBtns[0].classList.remove('success');
            actionBtns[0].classList.add('danger');
        }
    });
    actionBtns[1].addEventListener("click", () => {
        remainingTime = focusTime;
        focusMode = true;
        pause = false;
        actionBtns[0].innerHTML = "Pause";
        actionBtns[0].classList.remove('success');
        actionBtns[0].classList.add('danger');
    });
    focusMode = true;
    pause = false;
    countdown(focusTime);
}

function countdown(val) { 
    setRemainingTime(val);
    setInterval(() => {
        if(!pause){
            remainingTime -= 1;
            updateUI();
        }
    }, 1000); 
} 

function getMinutes() { 
    var mins = Math.floor(remainingTime / 60); 
    return mins; 
} 

function getSeconds() { 
    return remainingTime % 60;
} 

function getFormattedTime(){
    const mins = getMinutes();
    const seconds = getSeconds();
    var ret = "";
    if(mins < 10) ret += '0';
    ret += mins + ":";
    if(seconds < 10) ret += '0';
    ret += seconds;
    return ret;
}

function updateUI(){
    var counter = document.getElementById('counter');
    if(remainingTime <= 0){
        focusMode = !focusMode;
        remainingTime = focusMode*focusTime + (!focusMode)*relaxTime;
        if(!focusMode) {
            ipcRenderer.send("focus");
            counter.innerHTML = "Look away.";
        }
        else{
            setTimeout(() => {
                ipcRenderer.send("minimize");
            }, 2000);
        }
    }
    if(focusMode){
        counter.innerHTML = getFormattedTime();
    }
}
