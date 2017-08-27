var FlightsFootprintCommon = function(){
	console.log("FlightsFootprintCommon");
	CarbonFootprintCommon.call(this);
	dataHelper = new FlightDataHelper();
  	dataHelper.getData("core/resources/airplanes.json", function(data){
    	flightData.airplanesData = data;
    	//console.log(data);
  	});
  	dataHelper.getData("core/resources/airports.json", function(data){
    	flightData.airportsData = data;
    	//console.log(data);
  	});
};

FlightsFootprintCommon.prototype = Object.create(CarbonFootprintCommon.prototype);
FlightsFootprintCommon.prototype.constructor = FlightsFootprintCommon;

FlightsFootprintCommon.CO2_FOR_JETFUEL = 3.16; // 3.16 tons of co2 for 1 ton of jet fuel

FlightsFootprintCommon.NMI_TO_KM = 1.852; // 1 nautical mile = 1.852 kilometers

/**
 * Function for getting Stops,arrive and depart coordinates
 * @param [Objects]
 * @return [Objects]
 */

FlightsFootprintCommon.prototype.getCoordinates = function(list){
  //console.log("reached core");
  //console.log("started placing coords");
  //console.log(core.airportsData);
  for(var x = 0, i = list.length; x < i; x++){
    list[x].departCoordinates = flightData.airportsData[list[x].depart];
      list[x].arriveCoordinates = flightData.airportsData[list[x].arrive];
      list[x].stopCoordinatesNew = [];
      if(list[x].stops.length){
          for(var y=0;y<list[x].stops.length;y++){
              list[x].stopCoordinatesNew.push(flightData.airportsData[list[x].stops[y]]);
          }
          //console.log(list[x].stopCoordinatesNew);
      }
  }
  return list;
};

/**
 * Function to calculate flight distance between two coordinates
 * @param Float,Float,Float,Float as Coordinates
 * @return Float as Distance
 */

FlightsFootprintCommon.prototype.getDistance = function(lat1, lon1, lat2, lon2){
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

/**
 * Function to calculate the emission from the distance
 * Uses linear interpolation/extrapolation for calculating
 * fuel consumed, fuel consumption is then converted to
 * CO2 emission.
 * @param [Objects]
 * @return [Objects]
 */

FlightsFootprintCommon.prototype.getEmission = function(list){
    for(var x = 0, i = list.length; x < i; x++){
      var aircraft = list[x].aircraft;
      var fuelConsumptionFloor, fuelConsumptionCeil,
          distanceFloor, distanceCeil;
      var interpolationFailed = false;
      for(var y = 0, j = flightData.airplanesData.distances.length; y < j; y++){
          if(flightData.airplanesData.distances[y]*FlightsFootprintCommon.NMI_TO_KM > list[x].distance){
            fuelConsumptionFloor = flightData.airplanesData[aircraft].fuel[y-1];
            fuelConsumptionCeil = flightData.airplanesData[aircraft].fuel[y];
            distanceFloor = flightData.airplanesData.distances[y-1]*FlightsFootprintCommon.NMI_TO_KM;
            distanceCeil = flightData.airplanesData.distances[y]*FlightsFootprintCommon.NMI_TO_KM;
            break;
          }
      }
      //check if interpolation will fail, if it does then use extrapolation
      if(!fuelConsumptionCeil){
        console.log("interpolation failed using extrapolation");
        l = flightData.airplanesData[aircraft].fuel.length - 1;
        slope = ((flightData.airplanesData[aircraft].fuel[l] - flightData.airplanesData[aircraft].fuel[l-1]) /
                          (flightData.airplanesData.distances[l]*FlightsFootprintCommon.NMI_TO_KM -
                            flightData.airplanesData.distances[l-1]*FlightsFootprintCommon.NMI_TO_KM));

        fuelConsumption = slope*(list[x].distance - flightData.airplanesData.distances[l]*FlightsFootprintCommon.NMI_TO_KM) +
          flightData.airplanesData[aircraft].fuel[l];
      }
      //if interpolation wont fail then use it
      else{
        fuelConsumption = fuelConsumptionFloor + ((fuelConsumptionCeil - fuelConsumptionFloor)/
                              (distanceCeil - distanceFloor))*(list[x].distance - distanceFloor);
      }
      list[x].co2Emission = this.convertFuelToCO2(fuelConsumption, aircraft);
  }
  //console.log("--- final list ---");
  //console.log(list);
  return list;
};

/**
 * Function to calculate CO2 released from fuel used
 * @param Float,String as Fuel,aircraft
 * @return Float as CO2 in kg
 */

FlightsFootprintCommon.prototype.convertFuelToCO2 = function(fuel, aircraft){
  var obj =  {
    economy: Math.floor(fuel*FlightsFootprintCommon.CO2_FOR_JETFUEL/flightData.airplanesData[aircraft].capacity),
    business: Math.floor(fuel*FlightsFootprintCommon.CO2_FOR_JETFUEL/flightData.airplanesData[aircraft].capacityTwoClass)
  };
  obj.average = Math.floor((obj.economy + obj.business)/2);
  return obj;
};

var flightData = {};
