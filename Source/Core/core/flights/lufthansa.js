var lufthansaManager = function(footprintCore, settingsProvider){
  this.core = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.validator = new FlightsValidator("lufthansa");
};
lufthansaManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("cell segments");
  console.log("raw list");
  console.log(rawList);
  var processedList = [];
  for(var x = 0, i = rawList.length; x < i; x++){
    var rawStops = this.validator.getByTag('abbr', rawList[x]);
    var stops = [];
    for(var y = 1, j = rawStops.length; y < j-1; y += 2){
      stops.push(rawStops[y].innerHTML);
    }
    var aircrafts = [];
    var aircraftsDiv = rawList[x].getElementsByClassName("aircraft");
    segment = this.validator.getByClass("segment-info", rawList[x]);
    var a = 0;
    for(y = 0, j = segment.length; y < j; y++){
      if(this.validator.getChildNode([1], segment[y]).childNodes.length > 7){
        aircrafts.push(aircraftsDiv[a++].alt.split(" ").pop());
      }
      else{
        aircrafts.push("A380"); // default aircraft if aircraft not specified;
      }
    }
    processedList.push({
      depart: rawStops[0].innerHTML,
      arrive: rawStops[rawStops.length - 1].innerHTML,
      stops: stops,
      aircraft: "A380" //hardcoded for now
    });
  }
  this.validator.verifyList(processedList);
  console.log("--- initial list ---");
  console.log(processedList);
  return processedList;
};

lufthansaManager.prototype.getCoordinates = function(processedList){
  processedList = this.core.getCoordinates(processedList);
  console.log("--- got coordinates ---");
  console.log(processedList);
  return processedList;
};

lufthansaManager.prototype.getDistances = function(processedList){
    for(var x = 0, i = processedList.length; x < i; x++){
        processedList[x].distance = 0;
    console.log(processedList[x]);
      if(processedList[x].stopCoordinatesNew){
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

lufthansaManager.prototype.getEmission = function(processedList){
  processedList = this.core.getEmission(processedList);
  console.log("---got fuel consumption---");
  console.log(processedList);
  return processedList;
};

lufthansaManager.prototype.style = function(e){
  var td = document.createElement("td");
  //e.style.top = "50%";
  td.appendChild(e);
  return td;
};

lufthansaManager.prototype.insertInDom = function(processedList){
  if(processedList.length > 0){
    insertIn = this.validator.getByClass("flight wdk-line");
    for(var x = 0, i = insertIn.length; x < i; x++){
      //var insert = insertIn[x].getElementsByClassName("carrier")[0];
      if(insertIn[x].getElementsByClassName("carbon").length === 0){
           insertIn[x].appendChild(this.style(this.core.createMark(processedList[x].co2Emission)));
      }
    }
  }
};

var WebsiteManager = lufthansaManager;
