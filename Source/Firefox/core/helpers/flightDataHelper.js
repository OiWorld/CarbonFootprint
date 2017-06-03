var FirefoxFlightDataHelper = function(){

};

FirefoxFlightDataHelper.prototype.getData = function(link, cb){
  if(link == "core/resources/airplanes.json"){
    self.port.emit("loadAirplanesData");
    self.port.on("airplanesDataLoaded", function(data){
      cb(data);
    });
  }
  else if(link == "core/resources/airports.json"){
    self.port.emit("loadAirportsData");
    self.port.on("airportsDataLoaded", function(data){
      cb(data);
    });
  }
};

var DataHelper = FirefoxFlightDataHelper;
