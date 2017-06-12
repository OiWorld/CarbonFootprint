var thalysManager = function(){
  this.subtree = true;
  this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.MODE = "thalys"; // constant, the type of train on this website is only "thalys"
};

thalysManager.prototype.geocodeStations = function(){
  this.stations.depart = document.getElementsByClassName("gare-depart")[0].innerText;
  this.stations.arrive = document.getElementsByClassName("gare-arrivee")[0].innerText;
  console.log(this.stations.depart + " ->  " + this.stations.arrive);
  if(core.distance === 0 && this.stations.depart && this.stations.arrive){  //Check if geocode never happened for current stations, proceed if not
    var toGeocode = [this.stations.depart, this.stations.arrive];
    core.geocode(toGeocode);
  }
};

thalysManager.prototype.setStyle = function(emission){
  emission.style.marginLeft = "10px";
  return emission;
};

thalysManager.prototype.insertInDom = function(emission){
  emission = this.setStyle(emission);
  console.log(emission);
  var element = document.getElementById("telecommande");
  if(element.getElementsByClassName('carbon').length === 0){
    element.appendChild(emission);
  }
};

// Checks wheather the departure or arrival stations have changed, if changed then geocode them again
thalysManager.prototype.checkChangeInStations = function(){
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

thalysManager.prototype.update = function(){
  //this.checkChangeInStations();
  var processedList = this.geocodeStations();
  if(core.distance > 1){ //Check if station have alredy been geocoded
    this.insertInDom(core.getEmission(["thalys"])); //There is only 1 type of train
  }
};

var TrainManager = thalysManager;
