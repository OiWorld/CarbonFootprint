/**
 * FlightsValidator namespace.
 * @constructor
 * @param {string} website
 */

var FlightsValidator = function(website) {
  BasicValidator.call(this,website,"flights");
  this.server = new Server();
  this.website = website;
};

FlightsValidator.prototype = Object.create(BasicValidator.prototype);
FlightsValidator.prototype.constructor = FlightsValidator;

/**
 * check if the string is a valid airport
 * i.e. it is 3 char long
 * @param {string} airport
 */

FlightsValidator.prototype.verifyAirports = function(airport){
  if(typeof airport !== 'string' || airport.length != 3){
    this.counterMeasure("invalid airports");
    return false;
  }
  else{
    console.log("valid airport");
    return true;
  }
};

/**
 * check if array is full of valid airports
 * @param {array} stops
 */

FlightsValidator.prototype.verifyStops = function(stops){
  if(!Array.isArray(stops) || stops.length == 0){
    this.counterMeasure("invalid stop");
    return false;
  }
  else{
    for(var x = 0, i = stops.length; x < i; x++){
      this.verifyAirports(stops[x]);
    }
  }
};

/**
 * check if list is full of valid airplanes
 * i.e. string is not too long or too short
 * @param {array} airplanes
 */

FlightsValidator.prototype.verifyAirplanes = function(airplanes){
  if(!Array.isArray(airplanes) || airplanes.length == 0){
    this.counterMeasure("invalid airplanes");
    return false;
  }
  else{
    for(var x = 0, i = airplanes.length; x < i; x++){
      if(typeof airplanes[x] !== 'string' || airplanes[x].length > 15 || airplanes[x].length < 3){ //15 is an experimental value right now
        this.counterMeasure("invalid airplane");
        return false;
      }
      else{
        console.log("valid airplane");
      }
    }
    return true;
  }
};

/**
 * use all above functions to verify the data
 * scraped from website.
 * @param {array} list
 */

FlightsValidator.prototype.verifyList = function(list){
  for(var x = 0, i = list.length; x < i; x++){
    this.verifyAirports(list[x].depart);
    this.verifyAirports(list[x].arrive);
    this.verifyStops(list[x].stops);
    //this.verifyAirplanes(list[x].ariplanes);
  }
};
