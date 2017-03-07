var skyscannerManager = function(){
  this.subtree = true;
  this.refresh = "day-list";
};
skyscannerManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("card-main");
  console.log("raw list");
  console.log(rawList);
  var processedList = [];
  //console.log(rawList);
  for(var x = 0, i = rawList.length; x < i; x++){
    processedList.push({
      depart: rawList[x].childNodes[1].childNodes[0].childNodes[0].childNodes[1].innerHTML,
      arrive: rawList[x].childNodes[1].childNodes[2].childNodes[0].childNodes[1].innerHTML,
      stop: rawList[x].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[0] ?
            rawList[x].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[0].innerHTML : "",
      aircraft: "A380", //hardcoded for now
    });
  }
  console.log("--- initial list ---");
  console.log(processedList);
  return processedList;
};

skyscannerManager.prototype.getCoordinates = function(processedList){
  processedList = core.getCoordinates(processedList);
  console.log("--- got coordinates ---");
  console.log(processedList);
  return processedList;
};

skyscannerManager.prototype.getDistances = function(processedList){
  for(var x = 0, i = processedList.length; x < i; x++){
    console.log(processedList[x]);
    if(processedList[x].stopCoordinates){
      processedList[x].distance = core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].stopCoordinates.lat, processedList[x].stopCoordinates.lon) +
                                  core.getDistance(processedList[x].stopCoordinates.lat, processedList[x].stopCoordinates.lon,
                                                   processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
    }
    else{
      processedList[x].distance = core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
    }
  }
  console.log("---got distances---");
  console.log(processedList);
  return processedList;
};

skyscannerManager.prototype.getEmission = function(processedList){
  processedList = core.getEmission(processedList);
  console.log("---got fuel consumption---");
  console.log(processedList);
  return processedList;
};

skyscannerManager.prototype.insertInDom = function(processedList){
  insertIn = document.getElementsByClassName("card-main");
  for(var x = 0, i = insertIn.length; x < i; x++){
    if(insertIn[x].childNodes[1].childNodes.length <= 4 ||
       insertIn[x].childNodes[1].childNodes[4].className == "leg-operator" &&
       insertIn[x].childNodes[1].childNodes.length <= 5){
         insertIn[x].childNodes[1].appendChild(core.createHTMLElement(processedList[x].co2Emission));
    }
    //console.log(insertIn[x].childNodes[1].childNodes[1]);
  }
};

skyscannerManager.prototype.update = function(){
  var processedList = this.getList();
  processedList = this.getCoordinates(processedList);
  processedList = this.getDistances(processedList);
  processedList = this.getEmission(processedList);
  this.insertInDom(processedList);
};
var FlightManager = skyscannerManager;
