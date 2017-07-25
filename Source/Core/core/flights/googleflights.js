var googleFlightsManager = function(){
  
};

/**
 * Function for making an object of flight
 * @return array of Object
 * Note : for 'all airport' case the first airport for depart or(or and) arrive shown in the url is considered.
 */

googleFlightsManager.prototype.getList = function(){
    console.log("Hey Google Flights!");
    var rawList = document.getElementsByClassName('EIGTDNC-d-W EIGTDNC-d-Lb EIGTDNC-d-S');
    console.log(rawList);
    console.log("--raw list--");
    //console.log(rawList);
    var processedList = [];
    var route,airports=[],depart,arrive,stops=[],url,detail;
    url = location.href;
    url = url.split(";");
    airports = url.slice(1,3);
    depart = airports[0].slice(2,5);
    arrive = airports[1].slice(2,5);
    for(var x=1; x< rawList.length-1; x++){
        detail = rawList[x].getElementsByClassName('EIGTDNC-d-Qb')[0].innerText;
        detail = detail.split(" ");
        console.log(detail);
        if(detail.length>0){
            if(!isNaN(parseInt(detail[0]))){
                stops = rawList[x].getElementsByClassName('EIGTDNC-d-Z')[0].innerText.split(" ");
                if(stops[0] === 'Change'){
                    stops = [];
                }
                else if(parseInt(detail[0]) != stops.length){   // handle when stops is like ["1h", "50m", "in", "AUH"]
                    console.log(stops);
                    stops = stops[stops.length-1];
                    stops = [stops];
                }
                else if(parseInt(detail[0])>1){
                    stops = stops.join(" ").split(",").join("").split(" ");
                }
            }
            else{
                stops = [];
            }
        }
        else{
            stops = [];
        }
        //In the case of city having more than one airport
        // we try to find exact airport by not considering URL
        var airportElement = rawList[x].getElementsByClassName('EIGTDNC-d-Ib');
        console.log(airportElement,airportElement.length);
        if(airportElement.length>0){
            airportElement = airportElement[0].innerText.split("-");
            depart = airportElement[0];
            arrive = airportElement[1];
        }
        console.log(depart,arrive);
        processedList.push({
            depart: depart,
            arrive :arrive,
            stops:stops,
            aircraft: "A380"
        });
        //console.log(stops);
    }
    console.log(processedList);
    return processedList;
};

/**
 * Function for getting coordinates from the JSON
 * @param array
 * @return array
 */

googleFlightsManager.prototype.getCoordinates = function(processedList){
    processedList = core.getCoordinates(processedList);
    console.log("--- got coordinates ---");
    console.log(processedList);
    return processedList;
};

/**
 * Function for getting Total Distance of flight
 * @param array
 * @return array
 */

googleFlightsManager.prototype.getDistances = function(processedList){
    processedList = core.getTotalDistance(processedList);
    console.log("---got Distance---");
    console.log(processedList);
    return processedList;
};

/**
 * Function for getting Emission of flight
 * @param array 
 * @return array
 */

googleFlightsManager.prototype.getEmission = function(processedList){
    processedList = core.getEmission(processedList);
    console.log(processedList);
    return processedList;
};

/**
 * Function for inserting Element in DOM
 * @param array
 * @return array
 */

googleFlightsManager.prototype.insertInDom = function(processedList){
    var checkOption = document.getElementsByClassName('EIGTDNC-d-W EIGTDNC-d-Lb EIGTDNC-d-S');
    var alter = [];
    for(var x=1;x<checkOption.length-1;x++){
        alter.push(checkOption[x]);
    }
    checkOption = alter;
    var insertIn = [];
    console.log(checkOption);
    console.log(processedList);
    for(x =0;x<checkOption.length;x++){
        console.log(checkOption[x].getElementsByClassName('carbon'));
        insertIn = checkOption[x].getElementsByClassName('EIGTDNC-d-X')[0];
        console.log(x);
        if(checkOption[x].getElementsByClassName('carbon').length < 1)
        {
            console.log("here we are");
            console.log(insertIn);
            insertIn.appendChild(core.createMark(processedList[x].co2Emission,0));
        }
        else{
            console.log("saved");
        }
    }
};

var FlightManager = googleFlightsManager ;
