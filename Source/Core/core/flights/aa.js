var aaManager = function(footprintCore, settingsProvider){
  this.core = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.list = [];
  this.childList = false;
  this.validator = new FlightsValidator("americanAirlines");
};
aaManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("bound-table-flightline");
  console.log("raw list");
  console.log(rawList);
  var processedList = [];
  for(var x = 0, i = rawList.length; x < i; x++){
    var stops = [];
    processedList.push({
      depart: this.validator.getByClass("citycode-from", rawList[x])[0].innerHTML.trim().substring(1, 4),
      arrive: this.validator.getByClass("citycode-to", rawList[x])[0].innerHTML.trim().substring(1, 4),
      stops: stops,
      aircraft: "A380", //hardcoded for now,
      updated: false,
      aircraftStore: []
    });
    if(rawList[x].getElementsByClassName("segment timeline-segment").length){
      processedList[processedList.length - 1].updated = true;
      for(var y = 0, j = this.validator.getByClass("timeline-airline", rawList[x]).length; y < j; y++){
        processedList[processedList.length - 1].aircraftStore.push(
          this.validator.getByClass("equipment", j[y])[0].innerText.trim());
      }
      for(y = 1, j = this.validator.getByClass("timeline-locationcode", rawList[x]).length - 1; y < j; y += 2){
        processedList[processedList.length - 1].stops.push(
          this.validator.getByClass("timeline-locationcode", rawList[x])[y].innerText.trim());
      }
    }
  }
  if(this.list.length === 0){
    this.list = processedList;
  }
  for(x = 0, i = processedList.length; x < i; x++){
    if(processedList[x].updated){
      this.list[x] = processedList[x];
    }
  }
  console.log("--- initial list ---");
  console.log(processedList);
  this.validator.verifyList(processedList);
  return this.list;
};

aaManager.prototype.getCoordinates = function(processedList){
  processedList = this.core.getCoordinates(processedList);
  console.log("--- got coordinates ---");
  console.log(processedList);
  return processedList;
};

aaManager.prototype.getDistances = function(processedList){
    for(var x = 0, i = processedList.length; x < i; x++){
        processedList[x].distance = 0;
    console.log(processedList[x]);
      if(processedList[x].stopCoordinatesNew.length){
          noOfStops = processedList[x].stopCoordinatesNew.length;
          console.log(noOfStops);
      processedList[x].distance += this.core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].stopCoordinatesNew[0].lat, processedList[x].stopCoordinatesNew[0].lon) +
              this.core.getDistance(processedList[x].stopCoordinatesNew[noOfStops-1].lat, processedList[x].stopCoordinatesNew[noOfStops-1].lon,
                               processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
          for(var y = 0; y < noOfStops-1 ; y++){
              console.log("Totally working fine");
              processedList[x].distance += this.core.getDistance(processedList[x].stopCoordinatesNew[y].lat,processedList[x].stopCoordinatesNew[y].lon,processedList[x].stopCoordinatesNew[y+1].lat,processedList[x].stopCoordinatesNew[y+1].lon);
          }
    }
    else{
      processedList[x].distance += this.core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
    }
  }
  console.log("---got distances---");
  console.log(processedList);
  return processedList;
};
//flight-details-container-rowtitle-header
//flight-details-group
//aircraft col-xs-24
//row
//bound-table-flightline-header
//flight-details availability-flight-details flight-details-without-button availability-flight-details-without-button row
aaManager.prototype.getEmission = function(processedList){
  processedList = this.core.getEmission(processedList);
  console.log("---got fuel consumption---");
  console.log(processedList);
  return processedList;
};

aaManager.prototype.insertInDom = function(processedList){
  if(processedList.length > 0){
    insertIn = this.validator.getByClass("bound-table-flightline-header");
    for(var x = 0, i = insertIn.length; x < i; x++){
      if(insertIn[x].getElementsByClassName("carbon").length === 0){
        insertIn[x].appendChild(this.core.createMark(processedList[x].co2Emission));
      }
      else{
        insertIn[x].removeChild(insertIn[x].childNodes[insertIn[x].childNodes.length - 1]);
        insertIn[x].appendChild(this.core.createMark(processedList[x].co2Emission));
      }
    }
  }
};

var WebsiteManager = aaManager;
