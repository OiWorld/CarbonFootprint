var FlightsFootprintCore = function(){
  console.log("start http");
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', Helper.getFilePath("core/resources/airports.json"), true);
  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        console.log("ready state = 4");
          if(xmlhttp.status == 200) {
              core.airportsData = JSON.parse(xmlhttp.responseText);
              console.log("got reply");
              //console.log(this.airportsData);
          }
          else{
            console.log("error getting json status != 200");
          }
      }
      else{
        console.log("error getting json not ready");
        console.log(xmlhttp.readyState);
      }
  };
  xmlhttp.send();
  var xmlhttp2 = new XMLHttpRequest();
  xmlhttp2.open('GET', Helper.getFilePath("core/resources/airplanes.json"), true);
  xmlhttp2.onreadystatechange = function() {
      if (xmlhttp2.readyState == 4) {
        console.log("ready state = 4");
          if(xmlhttp2.status == 200) {
              core.airplanesData = JSON.parse(xmlhttp2.responseText);
              console.log("got reply");
              //console.log(this.airportsData);
          }
          else{
            console.log("error getting json status != 200");
          }
      }
      else{
        console.log("error getting json not ready");
        console.log(xmlhttp2.readyState);
      }
  };
  xmlhttp2.send();
};

FlightsFootprintCore.CO2_FOR_JETFUEL = 3.16; // 3.16 tons of co2 for 1 ton of jet fuel
FlightsFootprintCore.NM_TO_KM = 1.852;

FlightsFootprintCore.prototype.getCoordinates = function(list){
  console.log("reached core");
  console.log("started placing coords");
  //console.log(core.airportsData);
  for(var x = 0, i = list.length; x < i; x++){
    list[x].departCoordinates = core.airportsData[list[x].depart];
    list[x].arriveCoordinates = core.airportsData[list[x].arrive];
    if(list[x].stop.length){
      list[x].stopCoordinates = core.airportsData[list[x].stop];
    }
  }
  return list;
};

FlightsFootprintCore.prototype.getDistance = function(lat1, lon1, lat2, lon2){
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

FlightsFootprintCore.prototype.getEmission = function(list){
  //console.log(core.airplanesData);
  for(var x = 0, i = list.length; x < i; x++){
    var aircraft = list[x].aircraft;
    var fuelConsumptionFloor, fuelConsumptionCeil;
    var distanceFloor, distanceCeil;
    for(var y = 0, j = core.airplanesData.distances.length; y < j; y++){
      if(core.airplanesData.distances[y]*FlightsFootprintCore.NM_TO_KM > list[x].distance){
        fuelConsumptionFloor = core.airplanesData[aircraft][y-1];
        fuelConsumptionCeil = core.airplanesData[aircraft][y];
        distanceFloor = core.airplanesData.distances[y-1]*FlightsFootprintCore.NM_TO_KM;
        distanceCeil = core.airplanesData.distances[y]*FlightsFootprintCore.NM_TO_KM;
        break;
      }
    }
    var fuelConsumption = fuelConsumptionFloor + ((fuelConsumptionCeil - fuelConsumptionFloor)/(distanceCeil - distanceFloor))*(list[x].distance - distanceFloor);
    //console.log("fuelConsumption1" + fuelConsumption1);
    list[x].co2Emission = Math.floor(fuelConsumption*FlightsFootprintCore.CO2_FOR_JETFUEL/853);
  }
  console.log("--- final list ---");
  console.log(list);
  return list;
};
