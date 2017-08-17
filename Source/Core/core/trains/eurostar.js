var eurostarManager = function(footprintCore, settingsProvider){
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.MODE = "eurostar"; // constant, the type of train on this website is only "eurostar"
  this.validator = new TrainsValidator("eurostar");
  this.footprintCore.storeDataSource(this.dataSource);
};

eurostarManager.prototype.geocodeStations = function(){
  console.log("get list");
  var stations = this.validator.getByClass("train-table-head__journey-info-od")[0].innerHTML;
  this.stations.depart = stations.split(" ")[0];
  this.stations.arrive = stations.split(" ")[2];
  console.log(this.stations.depart + " ->  " + this.stations.arrive);
  if(this.footprintCore.distance === 0 && this.stations.depart && this.stations.arrive){  //Check if geocode never happened for current stations, proceed if not
    var toGeocode = [this.stations.depart, this.stations.arrive];
    this.footprintCore.geocode(toGeocode);
  }
};

eurostarManager.prototype.setStyle = function(emission){
  emission.style.fontSize = "x-large";
  return emission;
};

eurostarManager.prototype.insertInDom = function(emission){
  emission = this.setStyle(emission);
  console.log(emission);
  var element = this.validator.getByClass("train-table-head")[0];
  if(element.getElementsByClassName('carbon').length === 0){
    element.appendChild(emission);
  }
};

eurostarManager.prototype.update = function(){
  var processedList = this.geocodeStations();
  if(this.footprintCore.distance > 1){ //Check if station has alredy been geocoded
    this.insertInDom(this.footprintCore.getEmission([this.MODE])); //There is only 1 type of train
  }
};

var WebsiteManager = eurostarManager;
