/**
 * TrainsValidator namespace.
 * @constructor
 * @param {string} website
 */

var TrainsValidator = function(website) {
  BasicValidator.call(this);
  this.server = new Server();
  this.website = website;
};

TrainsValidator.prototype = Object.create(BasicValidator.prototype);
TrainsValidator.prototype.constructor = TrainsValidator;

/**
 * check if its a valid train
 * @param {string} train
 */

TrainsValidator.prototype.verifyTrain = function(train){
  if(typeof train !== 'string' || train.length === 0){
    this.counterMeasure("invalid train type");
    return false;
  }
  else{
    console.log("valid train " + train);
    return true;
  }
};

/**
 * check if the string is a valid station
 * @param {string} station
 */

TrainsValidator.prototype.verifyStation = function(station){
  if(typeof station !== 'string' || station.length === 0){
    this.counterMeasure("invalid station " + station);
    return false;
  }
  return true;
};

/**
 * use all above functions to verify the data
 * scraped from website.
 * @param {array} list
 */

TrainsValidator.prototype.verifyList = function(list){
  for(var x = 0, i = list.length; x < i; x++){
    for(var y = 0, j = list[x].mode.length; y < j; y++){
      this.verifyTrain(list[x].mode[y]);
    }
    this.verifyStation(list[x].arrive);
    this.verifyStation(list[x].depart);
  }
};
