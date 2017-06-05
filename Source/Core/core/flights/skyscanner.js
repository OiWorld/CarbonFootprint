var skyscannerManager = function(){
  this.subtree = true;
  this.refresh = "day-list";
};
skyscannerManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("card-main");
  console.log("raw list");
  console.log(rawList);
    // var stops = rawList.getElementsByClassName("leg-stops-station");
    // console.log("---stops---");
    // console.log(stops);
    var processedList = [];
  //console.log(rawList);
    for(var x = 0, i = rawList.length; x < i; x++){
        stops = (rawList[x].getElementsByClassName('leg-stops-station')[0].innerText.length)? rawList[x].getElementsByClassName('leg-stops-station')[0].innerText.split(",").join("").split(" "): [];
    processedList.push({
      depart: rawList[x].childNodes[1].childNodes[0].childNodes[0].childNodes[1].innerHTML,
      arrive: rawList[x].childNodes[1].childNodes[2].childNodes[0].childNodes[1].innerHTML,
      stops:stops,
      aircraft: "A380" //hardcoded for now
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
    processedList = core.getTotalDistance(processedList);
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
  if(core.airplanesData && core.airportsData){
    processedList = this.getCoordinates(processedList);
    processedList = this.getDistances(processedList);
    processedList = this.getEmission(processedList);
    this.insertInDom(processedList);
  }
};
var FlightManager = skyscannerManager;
