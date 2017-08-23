var sncfManager = function(footprintCore, settingsProvider){
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("voyages-sncf");
  this.footprintCore.storeDataSource(this.dataSource);
};

sncfManager.prototype.getList = function(){
  //console.log("get list");
  var rawList = document.getElementsByClassName("proposal-info");
  var processedList = [];
  for(var x = 0, i = rawList.length; x < i; x++){
    var lineShortner = this.validator.getChildNode([2,1,5,0,0], rawList[x]);
    var numOfModes = (lineShortner.childNodes.length - 1) / 2;
    //console.log("mode count = " + numOfModes);
    processedList.push({
      depart: this.validator.getChildNode([0,1,0], rawList[x]).innerHTML,
      arrive: this.validator.getChildNode([1,1,0], rawList[x]).innerHTML,
    });
    processedList[processedList.length-1].mode = [];
    for(var y = 1, j = numOfModes; y <= j; y++){
      processedList[processedList.length-1].mode.push(this.validator.getChildNode([y*2 - 1], lineShortner).innerText.toLowerCase());
    }

    this.validator.verifyList(processedList);

    if(this.footprintCore.distance === 0){  //Check if geocode never happened for current stations, proceed if not
      var toGeocode = [processedList[0].depart, processedList[0].arrive];
      this.footprintCore.geocode(toGeocode);
    }
  }
  //console.log(processedList);
  return processedList;
};

sncfManager.prototype.insertInDom = function(emissions){
  var list = this.validator.getByClass("proposal-info");
  for(var x = 0, i = list.length; x < i; x++){
    if(list[x].getElementsByClassName('carbon').length === 0){
      this.validator.getByClass('row', list[x])[0].appendChild(emissions[x]);
    }
  }
};

// Checks wheather the departure or arrival stations have changed, if changed then geocode them again
sncfManager.prototype.checkChangeInStations = function(){
  currentArrive = this.validator.getById("panel-origin-city-input").value;
  currentDepart = this.validator.getById("panel-destination-city-input").value;
  //console.log(currentArrive + " " + currentDepart);
  if(this.stations.arrive != currentArrive || this.stations.depart != currentDepart){
    this.stations.arrive = currentArrive;
    this.stations.depart = currentDepart;
    this.distance = 0; //geocode again
  }
};

sncfManager.prototype.update = function(){
  this.checkChangeInStations();
  var processedList = this.getList();
  if(this.footprintCore.distance > 1){ //Check if station have alredy been geocoded
    var emissionList = [];
    for(var x = 0, i = processedList.length; x < i; x++){
      emissionList.push(this.footprintCore.getEmission(processedList[x].mode));
    }
    //var emissions = this.footprintCore.getEmission(processedList);
    this.insertInDom(emissionList);
  }
};

var WebsiteManager = sncfManager;
