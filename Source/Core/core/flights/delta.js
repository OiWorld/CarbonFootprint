var deltaManager = function(footprintCore, settingsProvider){
  this.core = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.validator = new FlightsValidator("delta");
};
deltaManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("flightPathProgress");
  console.log("raw list");
  console.log(rawList);
  var processedList = [];
  for(var x = 0, i = rawList.length; x < i; x++){
    var stops = [];
    rawStops = rawList[x].getElementsByClassName("originCityVia2Stops").length > 0 ? this.validator.getByClass("originCityVia2Stops"): [];
    for(var y = 0, j = rawStops.length; y < j; y++){
      stops.push(rawStops[y].innerText.split(" ")[0]);
    }
    processedList.push({
      depart: this.validator.getByClass("originCity", rawList[x])[0].innerText,
      arrive: this.validator.getByClass("destinationCity", rawList[x])[0].innerText,
      stops: stops,
      aircraft: "A380" //hardcoded for now
    });
  }
  console.log("--- initial list ---");
  console.log(processedList);
  this.validator.verifyList(processedList);
  return processedList;
};

deltaManager.prototype.insertInDom = function(processedList){
  if(processedList.length > 0){
    insertIn = this.validator.getByClass("aminitiesDetailWrapper");
    for(var x = 0, i = insertIn.length; x < i; x++){
      if(insertIn[x].getElementsByClassName("carbon").length === 0){
           insertIn[x].appendChild(this.core.createMark(processedList[x].co2Emission));
      }
      //console.log(insertIn[x].childNodes[1].childNodes[1]);
    }
  }
};

var WebsiteManager = deltaManager;
