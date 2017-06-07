var sncfManager = function(){
  this.subtree = true;
  this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
};

sncfManager.prototype.getList = function(){
  console.log("get list");
  var rawList = document.getElementsByClassName("proposal-info");
  var processedList = [];
  for(var x = 0, i = rawList.length; x < i; x++){
    var lineShortner = rawList[x].childNodes[2].childNodes[1].childNodes[5].childNodes[0].childNodes[0];
    var numOfModes = (lineShortner.childNodes.length - 1) / 2;
    console.log("mode count = " + numOfModes);
    processedList.push({
      depart: rawList[x].childNodes[0].childNodes[1].childNodes[0].innerHTML,
      arrive: rawList[x].childNodes[1].childNodes[1].childNodes[0].innerHTML,
    });
    processedList[processedList.length-1].mode = [];
    for(var y = 1, j = numOfModes; y <= j; y++){
      processedList[processedList.length-1].mode.push(lineShortner.childNodes[y*2 - 1].innerText.toLowerCase());
    }

    if(core.distance === 0){  //Check if geocode never happened for current stations, proceed if not
      var toGeocode = [processedList[0].depart, processedList[0].arrive];
      core.geocode(toGeocode);
    }
  }
  //console.log(processedList);
  return processedList;
};

sncfManager.prototype.insertInDom = function(emissions){
  var list = document.getElementsByClassName("proposal-info");
  for(var x = 0, i = list.length; x < i; x++){
    if(list[x].getElementsByClassName('carbon').length === 0){
      list[x].getElementsByClassName('row')[0].appendChild(emissions[x]);
    }
  }
};

// Checks wheather the departure or arrival stations have changed, if changed then geocode them again
sncfManager.prototype.checkChangeInStations = function(){
  currentArrive = document.getElementById("panel-origin-city-input").value;
  currentDepart = document.getElementById("panel-destination-city-input").value;
  console.log(currentArrive + " " + currentDepart);
  if(this.stations.arrive != currentArrive || this.stations.depart != currentDepart){
    this.stations.arrive = currentArrive;
    this.stations.depart = currentDepart;
    this.distance = 0; //geocode again
  }
};

sncfManager.prototype.update = function(){
  this.checkChangeInStations();
  var processedList = this.getList();
  if(core.distance > 1){ //Check if station have alredy been geocoded
    var emissionList = [];
    for(var x = 0, i = processedList.length; x < i; x++){
      emissionList.push(core.getEmission(processedList[x].mode));
    }
    //var emissions = core.getEmission(processedList);
    this.insertInDom(emissionList);
  }
};

var TrainManager = sncfManager;
