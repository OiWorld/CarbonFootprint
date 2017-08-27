
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
  this.seatType = "average";
  FlightsFootprintCommon.call(this);
  this.flights = true; // used to identify a flight ticket website
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
 * @param Object,Object as Emission from outbound and return visit
 * @return htmlElement
 */

FlightsFootprintCore.prototype.createMark = function(depart, arrive){
    if(arrive === undefined){
      arrive = {average: 0, economy: 0, business: 0};
    }
    var e = document.createElement('div');
    //knowMoreUrl = this.helper.getFilePath('pages/knowMore.html');
    var outBoundInfo = "",returnInfo = "",Title="";
    if(depart.average > 0){
      outBoundInfo = "Outbound : (Economy) " + depart.economy + " kg of CO₂e per person. \n";
      outBoundInfo = outBoundInfo + "                   (Business) " + depart.business + " kg of CO₂e per person. \n";
    }
    if(arrive.average > 0){
      returnInfo = "Return :      (Economy) " + arrive.economy + " kg of CO₂e per person. \n";
      returnInfo = returnInfo + "                   (Business) " + arrive.business + " kg of CO₂e per person. \n";
    }
    Title = outBoundInfo + returnInfo;
    //console.log(depart,arrive);
    var treesStr =  "";
    var visibleEmisson = "";
    knowMoreUrl = Helper.getFilePath('pages/knowMore.html');
    e.setAttribute("id", "carbon-footprint-label");
    console.log("seatType is = " + this.seatType);
    if(this.seatType == "economy"){
      visibleEmisson = (parseInt(depart.economy+arrive.economy)).toString() + " kg of CO₂ per person\n";
      treesStr = this.treesToString(this.computeTrees(parseInt(depart.economy)+parseInt(arrive.economy)));
    }
    else if(this.seatType == "business"){
      visibleEmisson = (parseInt(depart.business+arrive.business)).toString() + " kg of CO₂ per person\n";
      treesStr = this.treesToString(this.computeTrees(parseInt(depart.business)+parseInt(arrive.business)));
    }
    else{
      visibleEmisson = (parseInt(depart.average+arrive.average)).toString() + " kg of CO₂ per person\n";
      treesStr = this.treesToString(this.computeTrees(parseInt(depart.average)+parseInt(arrive.average)));
    }
    e.innerHTML = '<a href=' + knowMoreUrl + ' target=\'_blank\' title=\'' + Title +
      treesStr + '\' class=\'carbon\' id=\'carbon\'>' +
      visibleEmisson + this.getSVG(); //puts the questionmark svg in place
    e.querySelector('a').addEventListener('click', function(e) {
      e.stopPropagation();
    });
    e.onh;
    return e;
};

FlightsFootprintCommon.prototype.setSeatType = function(seatType){
  this.seatType = seatType;
};

var CarbonFootprintCore = FlightsFootprintCore;
