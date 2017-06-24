var TrainsValidator = function(website) {
  BasicValidator.call(this);
  this.server = new Server();
  this.website = website;
};

TrainsValidator.prototype = Object.create(BasicValidator.prototype);
TrainsValidator.prototype.constructor = TrainsValidator;

TrainsValidator.prototype.verifyTrain = function(train){
  if(!core.trainData[train]){
    this.counterMeasure("invalid train type");
  }
  else{
    console.log("valid train " + train);
  }
};

TrainsValidator.prototype.verifyStation = function(station){
  if(typeof station !== 'string' || station.length === 0){
    this.counterMeasure("invalid station " + station);
  }
};

TrainsValidator.prototype.verifyList = function(list){
  for(var x = 0, i = list.length; x < i; x++){
    for(var y = 0, j = list[x].mode.length; y < j; y++){
      this.verifyTrain(list[x].mode[y]);
    }
    this.verifyStation(list[x].arrive);
    this.verifyStation(list[x].depart);
  }
};
