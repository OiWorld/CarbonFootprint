var eurostarManager = function(){
  this.subtree = true;
  this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.MODE = "eurostar"; // constant, the type of train on this website is only "eurostar"
};

eurostarManager.prototype.geocodeStations = function(){
  console.log("get list");
  var stations = document.getElementsByClassName("train-table-head__journey-info-od")[0].innerHTML;
  this.stations.depart = stations.split(" ")[0];
  this.stations.arrive = stations.split(" ")[2];
  console.log(this.stations.depart + " ->  " + this.stations.arrive);
  if(core.distance === 0 && this.stations.depart && this.stations.arrive){  //Check if geocode never happened for current stations, proceed if not
    var toGeocode = [this.stations.depart, this.stations.arrive];
    core.geocode(toGeocode);
  }
};

eurostarManager.prototype.setStyle = function(emission){
  emission.style.fontSize = "x-large";
  return emission;
};

eurostarManager.prototype.insertInDom = function(emission){
  emission = this.setStyle(emission);
  console.log(emission);
  var element = document.getElementsByClassName("train-table-head")[0];
  if(element.getElementsByClassName('carbon').length === 0){
    element.appendChild(emission);
  }
};

// Checks wheather the departure or arrival stations have changed, if changed then geocode them again
eurostarManager.prototype.checkChangeInStations = function(){
  var stations = document.getElementsByClassName("train-table-head__journey-info-od")[0].innerHTML;
  currentArrive = stations.split(" ")[0];
  currentDepart = stations.split(" ")[2];
  console.log(currentDepart + " ->  " + currentArrive);
  if(this.stations.arrive != currentArrive || this.stations.depart != currentDepart){
    this.stations.arrive = currentArrive;
    this.stations.depart = currentDepart;
    this.distance = 0; //geocode again
  }
};

eurostarManager.prototype.update = function(){
  //this.checkChangeInStations();
  var processedList = this.geocodeStations();
  if(core.distance > 1){ //Check if station have alredy been geocoded
    this.insertInDom(core.getEmission(["eurostar"])); //There is only 1 type of train
  }
};

var TrainManager = eurostarManager;
