
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

var FlightsFootprintCore = function(){
  dataHelper = new FlightDataHelper();
  dataHelper.getData("core/resources/airplanes.json", function(data){
    core.airplanesData = data;
    //console.log(data);
  });
  dataHelper.getData("core/resources/airports.json", function(data){
    core.airportsData = data;
    //console.log(data);
  });
    this.treeGrowthPerYear = 8.3; // Check EstimationSources/toronto-university-CO2-sequested-by-tree
};

FlightsFootprintCore.CO2_FOR_JETFUEL = 3.16; // 3.16 tons of co2 for 1 ton of jet fuel

FlightsFootprintCore.NMI_TO_KM = 1.852; // 1 nautical mile = 1.852 kilometers

/**
 * computes trees that would be required to curb footprints
 * @param {number} carbonFootprint
 * @return {number} trees
 */

FlightsFootprintCore.prototype.computeTrees = function(carbonFootprint) {
    var trees = carbonFootprint / this.treeGrowthPerYear;
    trees = Math.round(trees * 100) / 100;
    //console.log('Trees: ' + trees);
    return trees;
};

/**
 * return an appropriate message based on trees required
 * @param {number} trees
 * @return {string}
 */

FlightsFootprintCore.prototype.treesToString = function(trees) {
    if (trees > 1) {
        return 'You will need ' + Math.round(trees) +
            ' tropical trees growing for 1 year to capture that much CO₂!' +
            ' (or ' + Math.round(trees * 12) +
            ' trees growing for 1 month, or ' + Math.round(trees * 365) +
            ' trees growing for 1 day)';
    } else if (trees * 12 > 1) {
        return 'You will need ' + Math.round(trees * 12) +
            ' tropical trees growing for 1 month to capture that much CO₂!' +
            ' (or ' + Math.round(trees * 365) +
            ' trees growing for 1 day)';
    } else if (trees * 365 > 1) {
        return 'You will need ' + Math.round(trees * 365) +
            ' tropical trees growing for 1 day to capture that much CO₂!';
    } else {
        return 'Your Carbon Emission is almost nil. Great going!';
    }
};

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
    list[x].departCoordinates = core.airportsData[list[x].depart];
      list[x].arriveCoordinates = core.airportsData[list[x].arrive];
      list[x].stopCoordinatesNew = [];
      if(list[x].stops.length){
          for(var y=0;y<list[x].stops.length;y++){
              list[x].stopCoordinatesNew.push(core.airportsData[list[x].stops[y]]);
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
 * @param [Objects]
 * @return [Objects]
 */

FlightsFootprintCore.prototype.getEmission = function(list){
  //console.log(core.airplanesData);
    for(var x = 0, i = list.length; x < i; x++){
      var aircraft = list[x].aircraft;
      var fuelConsumptionFloor, fuelConsumptionCeil;
          var distanceFloor, distanceCeil;
      var interpolationFailed = false;
      for(var y = 0, j = core.airplanesData.distances.length; y < j; y++){
          if(core.airplanesData.distances[y]*FlightsFootprintCore.NMI_TO_KM > list[x].distance){
            fuelConsumptionFloor = core.airplanesData[aircraft].fuel[y-1];
            fuelConsumptionCeil = core.airplanesData[aircraft].fuel[y];
            distanceFloor = core.airplanesData.distances[y-1]*FlightsFootprintCore.NMI_TO_KM;
            distanceCeil = core.airplanesData.distances[y]*FlightsFootprintCore.NMI_TO_KM;
            break;
          }
      }
      //check if interpolation will fail, if it does then use extrpolation
      if(!fuelConsumptionCeil){
        console.log("interpolation failed using extrapolation");
        l = core.airplanesData[aircraft].fuel.length - 1;
        slope = ((core.airplanesData[aircraft].fuel[l] - core.airplanesData[aircraft].fuel[l-1]) /
                          (core.airplanesData.distances[l]*FlightsFootprintCore.NMI_TO_KM -
                            core.airplanesData.distances[l-1]*FlightsFootprintCore.NMI_TO_KM));

        fuelConsumption = slope*(list[x].distance - core.airplanesData.distances[l]*FlightsFootprintCore.NMI_TO_KM) +
          core.airplanesData[aircraft].fuel[l];
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
      '<svg id="quest_mark_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92"><path d="M45.4 0C20 0.3-0.3 21.2 0 46.6c0.3 25.4 21.2 45.7 46.6 45.4 25.4-0.3 45.7-21.2 45.4-46.6C91.7 20 70.8-0.3 45.4 0zM45.3 74l-0.3 0c-3.9-0.1-6.7-3-6.6-6.9 0.1-3.8 2.9-6.5 6.7-6.5l0.2 0c4 0.1 6.7 3 6.6 6.9C51.9 71.3 49.1 74 45.3 74zM61.7 41.3c-0.9 1.3-2.9 2.9-5.5 4.9l-2.8 1.9c-1.5 1.2-2.5 2.3-2.8 3.4 -0.3 0.9-0.4 1.1-0.4 2.9l0 0.5H39.4l0-0.9c0.1-3.7 0.2-5.9 1.8-7.7 2.4-2.8 7.8-6.3 8-6.4 0.8-0.6 1.4-1.2 1.9-1.9 1.1-1.6 1.6-2.8 1.6-4 0-1.7-0.5-3.2-1.5-4.6 -0.9-1.3-2.7-2-5.3-2 -2.6 0-4.3 0.8-5.4 2.5 -1.1 1.7-1.6 3.5-1.6 5.4v0.5H27.9l0-0.5c0.3-6.8 2.7-11.6 7.2-14.5C37.9 18.9 41.4 18 45.5 18c5.3 0 9.9 1.3 13.4 3.9 3.6 2.6 5.4 6.5 5.4 11.6C64.4 36.3 63.5 38.9 61.7 41.3z" /></svg>';
    e.querySelector('a').addEventListener('click', function(e) {
      e.stopPropagation();
    });
    e.onh;
    return e;
}
