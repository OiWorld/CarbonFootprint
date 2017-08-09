
/**
 * Footprint Core file for flights websites
 * Functions inside core Namespace :
 * computeTrees() @param Float
 * createHTMLElement @param Float
 * createMark() @param Float,Float
 * convertFuelToCO2()  @param Float,String
 * getCoordinates() @param String
 * getDistance() @param [objects]
 * getEmission() @param [objects]
 * getTotalDistance() @param [objects]
 * treesToString() @param Number
 */

var FlightsFootprintCore = function(settingsProvider, helper){
  CarbonFootprintCommon.call(this);
  this.flights = true; // used to identift a flight ticket website
  dataHelper = new FlightDataHelper();
  dataHelper.getData("core/resources/airplanes.json", (data) => {
    this.airplanesData = data;
    //console.log(data);
  });
  dataHelper.getData("core/resources/airports.json", (data) => {
    this.airportsData = data;
    //console.log(data);
  });
};

FlightsFootprintCore.prototype = Object.create(CarbonFootprintCommon.prototype);
FlightsFootprintCore.prototype.constructor = FlightsFootprintCore;

FlightsFootprintCore.CO2_FOR_JETFUEL = 3.16; // 3.16 tons of co2 for 1 ton of jet fuel

FlightsFootprintCore.NMI_TO_KM = 1.852; // 1 nautical mile = 1.852 kilometers

/**
 * Function for getting Stops,arrive and depart coordinates
 * @param [Objects]
 * @return [Objects]
 */

FlightsFootprintCore.prototype.getCoordinates = function(list){
  //console.log("reached core");
  //console.log("started placing coords");
  //console.log(core.airportsData);
  for(var x = 0, i = list.length; x < i; x++){
    list[x].departCoordinates = this.airportsData[list[x].depart];
      list[x].arriveCoordinates = this.airportsData[list[x].arrive];
      list[x].stopCoordinatesNew = [];
      if(list[x].stops.length){
          for(var y=0;y<list[x].stops.length;y++){
              list[x].stopCoordinatesNew.push(this.airportsData[list[x].stops[y]]);
          }
          //console.log(list[x].stopCoordinatesNew);
      }
  }
  return list;
};

/**
 * Function for calculating total distance for a route
 * @param [Objects]
 * @return [Objects]
 */

FlightsFootprintCore.prototype.getTotalDistance = function(processedList){
    for(var x = 0, i = processedList.length; x < i; x++){
        processedList[x].distance = 0;
        //console.log(processedList[x]);
        //console.log(processedList[x].stopCoordinatesNew);
      if(processedList[x].stopCoordinatesNew.length>0){
          noOfStops = processedList[x].stopCoordinatesNew.length;
          //console.log(noOfStops);
          processedList[x].distance += this.getDistance(processedList[x].departCoordinates.lat,
                                                        processedList[x].departCoordinates.lon,
                                                        processedList[x].stopCoordinatesNew[0].lat,
                                                        processedList[x].stopCoordinatesNew[0].lon) +
              this.getDistance(processedList[x].stopCoordinatesNew[noOfStops-1].lat,
                               processedList[x].stopCoordinatesNew[noOfStops-1].lon,
                               processedList[x].arriveCoordinates.lat,
                               processedList[x].arriveCoordinates.lon);
          for(var y = 0; y < noOfStops-1 ; y++){
              //console.log("Totally working fine");
              processedList[x].distance += this.getDistance(processedList[x].stopCoordinatesNew[y].lat,
                                                            processedList[x].stopCoordinatesNew[y].lon,
                                                            processedList[x].stopCoordinatesNew[y+1].lat,
                                                            processedList[x].stopCoordinatesNew[y+1].lon);
          }
    }
    else{
        processedList[x].distance += this.getDistance(processedList[x].departCoordinates.lat,
                                                      processedList[x].departCoordinates.lon,
                                                      processedList[x].arriveCoordinates.lat,
                                                      processedList[x].arriveCoordinates.lon);
    }
  }
  //console.log("---got distances---");
  //console.log(processedList);
  return processedList;
};

/**
 * Function to calculate flight distance between two coordinates
 * @param Float,Float,Float,Float as Coordinates
 * @return Float as Distance
 */

FlightsFootprintCore.prototype.getDistance = function(lat1, lon1, lat2, lon2){
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

FlightsFootprintCore.prototype.getEmission = function(list){
  //console.log(this.airplanesData);
    for(var x = 0, i = list.length; x < i; x++){
      var aircraft = list[x].aircraft;
      var fuelConsumptionFloor, fuelConsumptionCeil;
          var distanceFloor, distanceCeil;
      var interpolationFailed = false;
      for(var y = 0, j = this.airplanesData.distances.length; y < j; y++){
          if(this.airplanesData.distances[y]*FlightsFootprintCore.NMI_TO_KM > list[x].distance){
            fuelConsumptionFloor = this.airplanesData[aircraft].fuel[y-1];
            fuelConsumptionCeil = this.airplanesData[aircraft].fuel[y];
            distanceFloor = this.airplanesData.distances[y-1]*FlightsFootprintCore.NMI_TO_KM;
            distanceCeil = this.airplanesData.distances[y]*FlightsFootprintCore.NMI_TO_KM;
            break;
          }
      }
      //check if interpolation will fail, if it does then use extrpolation
      if(!fuelConsumptionCeil){
        console.log("interpolation failed using extrapolation");
        l = this.airplanesData[aircraft].fuel.length - 1;
        slope = ((this.airplanesData[aircraft].fuel[l] - this.airplanesData[aircraft].fuel[l-1]) /
                          (this.airplanesData.distances[l]*FlightsFootprintCore.NMI_TO_KM -
                            this.airplanesData.distances[l-1]*FlightsFootprintCore.NMI_TO_KM));

        fuelConsumption = slope*(list[x].distance - this.airplanesData.distances[l]*FlightsFootprintCore.NMI_TO_KM) +
          this.airplanesData[aircraft].fuel[l];
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

FlightsFootprintCore.prototype.convertFuelToCO2 = function(fuel, aircraft){
  return Math.floor(fuel*FlightsFootprintCore.CO2_FOR_JETFUEL/this.airplanesData[aircraft].capacity);
};

/**
 * Function to create HTML element to insert in DOM element
 * @param Float as CO2 Emission
 * @return return htmlElement
 */

FlightsFootprintCore.prototype.createHTMLElement = function(co2Emission){
  var co2 = document.createElement("span");
  co2.className = "carbon";
  co2.innerHTML = co2Emission + " kg of CO<sub>2</sub> per per";
  return co2;
};

/**
 * Function to create svg mark to display more information
 * @param Float,Float as Emission from outbound and return visit
 * @return htmlElement
 */

FlightsFootprintCore.prototype.createMark = function(depart=0,arrive=0){
      var e = document.createElement('div');
    //knowMoreUrl = this.helper.getFilePath('pages/knowMore.html');
    var outBoundInfo = "",returnInfo = "",Title="";
    if(depart>0) outBoundInfo = "Outbound : " + depart + " kg of CO₂e per person. \n";
    if(arrive>0) returnInfo = "Return : " + arrive + " kg of CO₂e per person. \n";
    Title = outBoundInfo + returnInfo;
    //console.log(depart,arrive);
    var treesStr = this.treesToString(this.computeTrees(parseInt(depart)+parseInt(arrive)));
    knowMoreUrl = Helper.getFilePath('pages/knowMore.html');
    e.setAttribute("id", "carbon-footprint-label");
    e.innerHTML = '<a href=' + knowMoreUrl + ' target=\'_blank\' title=\'' + Title + treesStr + '\' class=\'carbon\' id=\'carbon\'>' + (parseInt(depart+arrive)).toString() + " kg of CO₂ per person\n" +
      // question mark icon using svg
      this.getSVG();
    e.querySelector('a').addEventListener('click', function(e) {
      e.stopPropagation();
    });
    e.onh;
    return e;
};
var CarbonFootprintCore = FlightsFootprintCore;
