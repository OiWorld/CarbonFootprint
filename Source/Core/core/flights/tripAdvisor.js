var tripAdvisorManager = function(footprintCore, settingsProvider){
  this.core = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.childList = false;
  this.validator = new FlightsValidator("tripAdvisor");
};

tripAdvisorManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("outerItineraryWrapper");
  console.log("raw list");
  console.log(rawList);
  var processedList = [];
  for(var x = 0, i = rawList.length; x < i; x++){
    flights = this.validator.getByClass("segmentDescriptionWithDiagram", rawList[x]);
    rawStops = rawList[x].getElementsByClassName("segmentDetail");
    console.log("----raw stops----");
    console.log(rawStops);
    for(var y = 0, j = flights.length; y < j; y++){
      processedList.push({
        depart: this.validator.getByClass("departureDescription", flights[y])[0].innerText.split(" ")[0],
        arrive: this.validator.getByClass("arrivalDescription", flights[y])[0].innerText.split(" ")[0],
        stops: [],
        aircraft: "A380", //hardcoded for now
        updated: false
      });
      if(rawStops.length){
        var legs = this.validator.getByClass("legDescription", rawStops[y]);
        var aircrafts = [], stops = [];
        for(z = 0, k = legs.length; z < k; z++){
          var info = this.validator.getChildNode([2, 0], legs[z]);
          aircrafts.push(info.innerText);
          stops.push(this.validator.getByClass("endpointAirport", info)[0].innerText.split(" ")[0]);
        }
        stops.pop();
        processedList[processedList.length - 1].stops = stops;
        processedList[processedList.length - 1].aircrafts = aircrafts;
      }
    }
  }
  console.log("--- initial list ---");
  console.log(processedList);
  return processedList;
};

tripAdvisorManager.prototype.getCoordinates = function(processedList){
  processedList = this.core.getCoordinates(processedList);
  console.log("--- got coordinates ---");
  console.log(processedList);
  return processedList;
};

tripAdvisorManager.prototype.getDistances = function(processedList){
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

tripAdvisorManager.prototype.getEmission = function(processedList){
  processedList = this.core.getEmission(processedList);
  console.log("---got fuel consumption---");
  console.log(processedList);
  return processedList;
};

tripAdvisorManager.prototype.insertInDom = function(processedList){
  insertIn = [];
  if(processedList.length > 0){
    insertIn = document.getElementsByClassName("mainFlightInfo");
  }
  if(processedList.length == insertIn.length){
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
  else{
    var y = 0;
    for(var x = 0, i = insertIn.length; x < i; x++){
      if(insertIn[x].getElementsByClassName("carbon").length === 0){
        insertIn[x].appendChild(this.core.createMark(processedList[y].co2Emission, processedList[y+1].co2Emission));
        y += 2;
      }
      else{
        insertIn[x].removeChild(insertIn[x].childNodes[insertIn[x].childNodes.length - 1]);
        insertIn[x].appendChild(this.core.createMark(processedList[y].co2Emission, processedList[y+1].co2Emission));
        y += 2;
      }
    }
  }
};

var WebsiteManager = tripAdvisorManager;
