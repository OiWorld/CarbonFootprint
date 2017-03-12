var FlightsFootprintCore = function(){
  dataHelper = new DataHelper();
  dataHelper.getData("core/resources/airplanes.json", function(data){
    core.airplanesData = data;
    console.log(data);
  });
  dataHelper.getData("core/resources/airports.json", function(data){
    core.airportsData = data;
    console.log(data);
  });
};

FlightsFootprintCore.CO2_FOR_JETFUEL = 3.16; // 3.16 tons of co2 for 1 ton of jet fuel
FlightsFootprintCore.NMI_TO_KM = 1.852; // 1 nautical mile = 1.852 kilometers

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
      if(core.airplanesData.distances[y]*FlightsFootprintCore.NMI_TO_KM > list[x].distance){
        fuelConsumptionFloor = core.airplanesData[aircraft].fuel[y-1];
        fuelConsumptionCeil = core.airplanesData[aircraft].fuel[y];
        distanceFloor = core.airplanesData.distances[y-1]*FlightsFootprintCore.NMI_TO_KM;
        distanceCeil = core.airplanesData.distances[y]*FlightsFootprintCore.NMI_TO_KM;
        break;
      }
    }
    var fuelConsumption = fuelConsumptionFloor + ((fuelConsumptionCeil - fuelConsumptionFloor)/
                          (distanceCeil - distanceFloor))*(list[x].distance - distanceFloor);
    //console.log("fuelConsumption1" + fuelConsumption1);
    list[x].co2Emission = this.convertFuelToCO2(fuelConsumption, aircraft);
  }
  //console.log("--- final list ---");
  //console.log(list);
  return list;
};

FlightsFootprintCore.prototype.convertFuelToCO2 = function(fuel, aircraft){
  return Math.floor(fuel*FlightsFootprintCore.CO2_FOR_JETFUEL/this.airplanesData[aircraft].capacity);
};

FlightsFootprintCore.prototype.createHTMLElement = function(co2Emission){
  var co2 = document.createElement("span");
  co2.className = "carbon";
  co2.innerHTML = co2Emission + "kg of CO<sub>2</sub> per person";
  return co2;
};
