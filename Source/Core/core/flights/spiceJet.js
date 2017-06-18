var deltaManager = function(){
  this.subtree = true;
};
deltaManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("flightInfo");
  console.log("raw list");
  //console.log(rawList);
  var processedList = [];
  list = [];
  for(var x = 0, i = rawList.length; x < i; x+=2){
    list.push(rawList[x].getElementsByTagName("p"));
  }
  console.log(list);
  for(x = 0, i = list.length; x < i; x++){
    var depart, arrive, stopsProcessed = [], stops = [], airplanes = [];
    for(var y = 1, j = list[x].length; y < j; y+=5){
      var destinations = list[x][y].innerHTML.split("\n");
      airplanes.push(list[x][y+1].innerHTML.split(" ")[4]);
      if(y == 1){
        depart = destinations[0].substring(0, 3);
        stops.push(destinations[2].substring(10, 13));
      }
      if(y == list[x].length - 3){
        arrive = destinations[2].substring(10, 13);
        stops.push(destinations[0].substring(0, 3));
      }
      if(y != 1 && y != list[x].length - 3){
        stops.push(destinations[0].substring(0, 3));
        stops.push(destinations[2].substring(10, 13));
      }
    }
    if(stops[0] == arrive){
      stopsProcessed = [];
    }
    else{
      for(y = 0, j = stops.length; y < j; y+=2){
        stopsProcessed.push(stops[y]);
      }
    }
    console.log("-------final scraped values--------");
    console.log(depart);
    console.log(stopsProcessed);
    console.log(arrive);
    processedList.push({
      depart: depart,
      arrive: arrive,
      stops: stopsProcessed,
      aircraft: "A380", //hardcoded for now
      airplanes: airplanes
    });
  }
  //console.log(list);
  console.log("--- initial list ---");
  console.log(processedList);
  return processedList;
};

deltaManager.prototype.getCoordinates = function(processedList){
  processedList = core.getCoordinates(processedList);
  console.log("--- got coordinates ---");
  console.log(processedList);
  return processedList;
};

deltaManager.prototype.getDistances = function(processedList){
    for(var x = 0, i = processedList.length; x < i; x++){
        processedList[x].distance = 0;
    console.log(processedList[x]);
      if(processedList[x].stopCoordinatesNew){
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

deltaManager.prototype.getEmission = function(processedList){
  processedList = core.getEmission(processedList);
  console.log("---got fuel consumption---");
  console.log(processedList);
  return processedList;
};

deltaManager.prototype.insertInDom = function(processedList){
  insertIn = document.getElementsByClassName("flight-icon-symbol bold");
  for(var x = 0, i = insertIn.length; x < i; x++){
    if(insertIn[x].getElementsByClassName("carbon").length === 0){
         insertIn[x].appendChild(core.createHTMLElement(processedList[x].co2Emission));
    }
    //console.log(insertIn[x].childNodes[1].childNodes[1]);
  }
};

deltaManager.prototype.update = function(){
  var processedList = this.getList();
  if(core.airplanesData && core.airportsData){
    processedList = this.getCoordinates(processedList);
    processedList = this.getDistances(processedList);
    processedList = this.getEmission(processedList);
    this.insertInDom(processedList);
  }
};
var FlightManager = deltaManager;
