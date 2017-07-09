
/*
 * Enable and disable websites for the current service
 * Work Flow : --> send message from this file to background.js
 * --> Message would be simple {"status":true/false}
 * --> Changing the local storage accordingly
 * --> Now in the init file check the status flag from the storage
 * -->    before running the update function
 */

/**
 * sending message to the background script
 */


var trialData = ["gitlab.com","www.google.co.in/flights"];

var inform = function(){
    this.flag=true;
};

inform.prototype.permission = function(){
    var y = this,
        question = location.href;
    chrome.storage.sync.get(['value'],function(correctAnswer){
        console.log(correctAnswer['value']);
        for(var x=0;x<correctAnswer['value'].length;x++){
            console.log(question.indexOf(correctAnswer['value'][x]));
            if(question.indexOf(correctAnswer['value'][x])>=0){
                y.flag = false;
            }
        }
    });
    return y.flag;
};

inform.prototype.addData = function(){
    chrome.storage.sync.set({'value':trialData},function(err){
        console.log(err);
    });
};
