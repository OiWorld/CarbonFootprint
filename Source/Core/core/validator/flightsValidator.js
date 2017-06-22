var FlightsValidator = function(website) {
  BasicValidator.call(this);
  this.server = new Server();
  this.website = website;
};

FlightsValidator.prototype = Object.create(BasicValidator.prototype);
FlightsValidator.prototype.constructor = FlightsValidator;

FlightsValidator.prototype.verifyAirports = function(airport){
  if(typeof airport !== 'string' || airport.length != 3){
    this.counterMeasure("invalid airports");
  }
  else{
    console.log("valid airport");
  }
};

FlightsValidator.prototype.verifyStops = function(list){
  if(!Array.isArray(list)){
    this.counterMeasure("invalid stop");
  }
  else{
    for(var x = 0, i = list.length; x < i; x++){
      this.verifyAirports(list[x]);
    }
  }
};

FlightsValidator.prototype.verifyAirplanes = function(list){
  if(!Array.isArray(list)){
    this.counterMeasure("invalid airplanes");
  }
  else{
    for(var x = 0, i = list.length; x < i; x++){
      if(typeof list[x] !== 'string' || list[x].length > 15){ //15 is an experimental value right now
        this.counterMeasure();
      }
      else{
        console.log("valid airplane");
      }
    }
  }
};

FlightsValidator.prototype.verifyList = function(list){
  for(var x = 0, i = list.length; x < i; x++){
    this.verifyAirports(list[x].depart);
    this.verifyAirports(list[x].arrive);
    this.verifyStops(list[x].stops);
    //this.verifyAirplanes(list[x].ariplanes);
  }
};
