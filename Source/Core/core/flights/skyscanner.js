var skyscannerManager = function(footprintCore, settingsProvider){
  this.core = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.validator = new FlightsValidator("skyscanner");
};
skyscannerManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("card-main");
  console.log("raw list");
  //console.log(rawList);
  var processedList = [];
  for(var x = 0, i = rawList.length; x < i; x++){
    stops = (this.validator.getByClass('leg-stops-station', rawList[x])[0].innerText.length)? this.validator.getByClass('leg-stops-station', rawList[x])[0].innerText.split(",").join("").split(" "): [];
    processedList.push({
      depart: this.validator.getChildNode([1,0,0,1], rawList[x]).innerHTML,
      arrive: this.validator.getChildNode([1,2,0,1], rawList[x]).innerHTML,
      stops:stops,
      aircraft: "A380" //hardcoded for now
    });
  }
  this.validator.verifyList(processedList);
  console.log("--- initial list ---");
  //console.log(processedList);
  return processedList;
};

skyscannerManager.prototype.insertInDom = function(processedList){
  var insertIn = [];
  if(processedList.length){
    insertIn = this.validator.getByClass("card-main");
  }
  //console.log(insertIn);
  for(var x = 0, i = insertIn.length; x < i; x++){
    if(this.validator.getChildNode([1], insertIn[x]).childNodes.length <= 4 ||
       this.validator.getChildNode([1,4], insertIn[x]).className == "leg-operator" &&
       this.validator.getChildNode([1], insertIn[x]).childNodes.length <= 5){
         this.validator.getChildNode([1], insertIn[x]).appendChild(this.core.createMark(processedList[x].co2Emission, 0));
    }
    //console.log(insertIn[x].childNodes[1].childNodes[1]);
  }
};

var WebsiteManager = skyscannerManager;
