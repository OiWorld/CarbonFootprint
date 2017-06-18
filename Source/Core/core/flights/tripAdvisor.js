var tripAdvisorManager = function(){
  this.subtree = true;
  this.refresh = "day-list";
};
//segmentHeading
//outerItineraryWrapper
//segmentDescriptionWithDiagram
tripAdvisorManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("outerItineraryWrapper");
  console.log("raw list");
  console.log(rawList);
  var processedList = [];
//console.log(rawList);
  for(var x = 0, i = rawList.length; x < i; x++){
    flights = rawList[x].getElementsByClassName("segmentDescriptionWithDiagram");
    rawStops = rawList[x].getElementsByClassName("segmentDetail");
    console.log("----raw stops----");
    console.log(rawStops);
    for(var y = 0, j = flights.length; y < j; y++){
      processedList.push({
        depart: flights[y].getElementsByClassName("departureDescription")[0].innerText.split(" ")[0],
        arrive: flights[y].getElementsByClassName("arrivalDescription")[0].innerText.split(" ")[0],
        stops: [],
        aircraft: "A380", //hardcoded for now
        updated: false
      });
      if(rawStops.length){
        var legs = rawStops[y].getElementsByClassName("legDescription");
        var aircrafts = [], stops = [];
        for(z = 0, k = legs.length; z < k; z++){
          var info = legs[z].childNodes[2];
          aircrafts.push(info.childNodes[0].innerText);
          stops.push(info.getElementsByClassName("endpointAirport")[0].innerText.split(" ")[0]);
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
  processedList = core.getCoordinates(processedList);
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
      processedList[x].distance += core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].stopCoordinatesNew[0].lat, processedList[x].stopCoordinatesNew[0].lon) +
              core.getDistance(processedList[x].stopCoordinatesNew[noOfStops-1].lat, processedList[x].stopCoordinatesNew[noOfStops-1].lon,
                               processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
          for(var y = 0; y < noOfStops-1 ; y++){
              console.log("Totally working fine");
              processedList[x].distance += core.getDistance(processedList[x].stopCoordinatesNew[y].lat,processedList[x].stopCoordinatesNew[y].lon,processedList[x].stopCoordinatesNew[y+1].lat,processedList[x].stopCoordinatesNew[y+1].lon);
          }
    }
    else{
      processedList[x].distance += core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
    }
  }
  console.log("---got distances---");
  console.log(processedList);
  return processedList;
};

tripAdvisorManager.prototype.getEmission = function(processedList){
  processedList = core.getEmission(processedList);
  console.log("---got fuel consumption---");
  console.log(processedList);
  return processedList;
};

tripAdvisorManager.prototype.insertInDom = function(processedList){
  insertIn = document.getElementsByClassName("outerItineraryWrapper");
  if(processedList.length == insertIn.length){
    for(var x = 0, i = insertIn.length; x < i; x++){
      if(insertIn[x].getElementsByClassName("carbon").length === 0){
        insertIn[x].appendChild(core.createMark(processedList[x].co2Emission));
      }
      else{
        insertIn[x].removeChild(insertIn[x].childNodes[insertIn[x].childNodes.length - 1]);
        insertIn[x].appendChild(core.createMark(processedList[x].co2Emission));
      }
    }
  }
  else{
    var y = 0;
    for(var x = 0, i = insertIn.length; x < i; x++){
      if(insertIn[x].getElementsByClassName("carbon").length === 0){
        insertIn[x].appendChild(core.createMark(processedList[y].co2Emission, processedList[y+1].co2Emission));
        y += 2;
      }
      else{
        insertIn[x].removeChild(insertIn[x].childNodes[insertIn[x].childNodes.length - 1]);
        insertIn[x].appendChild(core.createMark(processedList[y].co2Emission, processedList[y+1].co2Emission));
        y += 2;
      }
    }
  }
};

tripAdvisorManager.prototype.update = function(){
  var processedList = this.getList();
  if(core.airplanesData && core.airportsData){
    processedList = this.getCoordinates(processedList);
    processedList = this.getDistances(processedList);
    processedList = this.getEmission(processedList);
    this.insertInDom(processedList);
  }
};
var FlightManager = tripAdvisorManager;
