var thalysManager = function(){
  this.subtree = true;
  this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.MODE = "thalys"; // constant, the type of train on this website is only "thalys"
  this.validator = new TrainsValidator("thalys");
};

thalysManager.prototype.geocodeStations = function(){
  this.stations.depart = this.validator.getByClass("gare-depart")[0].innerText;
  this.stations.arrive = this.validator.getByClass("gare-arrivee")[0].innerText;
  this.validator.verifyStation(this.stations.depart);
  this.validator.verifyStation(this.stations.arrive);
  console.log(this.stations.depart + " ->  " + this.stations.arrive);
  if(core.distance === 0 && this.stations.depart && this.stations.arrive){  //Check if geocode never happened for current stations, proceed if not
    var toGeocode = [this.stations.depart, this.stations.arrive];
    core.geocode(toGeocode);
  }
};

thalysManager.prototype.setStyle = function(emission){
  emission.style.marginLeft = "10px";
  emission.style.fontSize = "small";
  return emission;
};

thalysManager.prototype.insertInDom = function(emission){
  emission = this.setStyle(emission);
  console.log(emission);
  var element = this.validator.getById("telecommande");
  if(element.getElementsByClassName('carbon').length === 0){
    element.appendChild(emission);
  }
};

thalysManager.prototype.update = function(){
  var processedList = this.geocodeStations();
  if(core.distance > 1){ //Check if station have alredy been geocoded
    this.insertInDom(core.getEmission([this.MODE])); //There is only 1 type of train
  }
};

var TrainManager = thalysManager;
