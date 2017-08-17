
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
  FlightsFootprintCommon.call(this);
  this.flights = true; // used to identift a flight ticket website
};

FlightsFootprintCore.prototype = Object.create(FlightsFootprintCommon.prototype);
FlightsFootprintCore.prototype.constructor = FlightsFootprintCore;


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
