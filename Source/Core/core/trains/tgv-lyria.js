var lyriaManager = function(){
  this.subtree = true;
  this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.MODE = "lyria"; // constant, the type of train on this website is only "lyria"
  this.validator = new TrainsValidator("tgv-lyria");
};

lyriaManager.prototype.geocodeStations = function(){
  var stations = this.validator.getByTag("h2")[0].innerText;
  console.log(stations);
  this.stations.depart = stations.split(" > ")[0];
  this.stations.arrive = stations.split(" > ")[1];
  this.validator.verifyStation(this.stations.depart);
  this.validator.verifyStation(this.stations.arrive);
  console.log(this.stations.depart + " ->  " + this.stations.arrive);
  if(core.distance === 0 && this.stations.depart && this.stations.arrive){  //Check if geocode never happened for current stations, proceed if not
    var toGeocode = [this.stations.depart, this.stations.arrive];
    core.geocode(toGeocode);
  }
};

lyriaManager.prototype.setStyle = function(emission){
  emission.style.fontSize = "small";
  emission.style.color = "#595450";
  return emission;
};

lyriaManager.prototype.insertInDom = function(emission){
  emission = this.setStyle(emission);
  console.log(emission);
  var element = this.validator.getByTag("h2")[0];
  if(element.getElementsByClassName('carbon').length === 0){
    element.appendChild(emission);
  }
};

lyriaManager.prototype.update = function(){
  this.geocodeStations();
  if(core.distance > 1){ //Check if station have alredy been geocoded
    this.insertInDom(core.getEmission(["lyria"])); //There is only 1 type of train
  }
};

var TrainManager = lyriaManager;
