var pricelineManager = function(){
    this.treeGrowthPerYear = 8.3;
    this.validator = new FlightsValidator("priceline");
};

/**
* Function for making an object of flight
* @return array of Object
*/

pricelineManager.prototype.getList = function(){
    console.log("Hey Priceline!");
    var rawList = document.getElementsByClassName('slice-container');
    console.log("raw list");
    console.log(rawList);
    var processedList = [];
    var stops,depart,arrive,airport;
    for(var x=0; x< rawList.length; x++){
        stops = this.validator.getByClass('stopsLocations', rawList[x]);
        airport = this.validator.getByClass('airport-code', rawList[x]);
        depart = airport[0].innerText;
        arrive = airport[1].innerText;
        if(stops.length>0){
            stops = stops[0].innerText;
            stops = stops.split(",");
            stops = stops.join("");
            stops = stops.slice(1,stops.length-1);
            stops = stops.split(" ");
        }
        else{
            console.log("no stops");
            stops = [];
        }
        processedList.push({
            depart: depart,
            arrive :arrive,
            stops:stops,
            aircraft: "A380"
        });
        console.log(stops);
    }
    this.validator.verifyList(processedList);
    console.log(processedList);
    return processedList;
};

/**
* Function for getting coordinates from the JSON
* @param array
* @return array
*/

pricelineManager.prototype.getCoordinates = function(processedList){
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
pricelineManager.prototype.getDistances = function(processedList){
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

pricelineManager.prototype.getEmission = function(processedList){
    processedList = core.getEmission(processedList);
    console.log(processedList);
    return processedList;
};

/**
* Function for inserting Element in DOM
* @param array
* @return array
*/

pricelineManager.prototype.insertInDom = function(processedList){
  if(processedList.length){
    var checkOption = this.validator.getByClass('fly-itinerary retail');
    var insertIn = [];
    console.log(checkOption);
    console.log(processedList);
    for(var x=0;x<checkOption.length;x++){
        console.log(checkOption[x].getElementsByClassName('carbon'));
        insertIn = this.validator.getByClass('fineprint', checkOption[x]);
        insertIn = insertIn[insertIn.length-1];
        console.log(x);
        if(checkOption[x].getElementsByClassName('carbon').length < 1)
        {
            console.log("here we are");
            insertIn.appendChild(core.createMark(processedList[2*x].co2Emission,processedList[(2*x)+1].co2Emission));
        }
        else{
            console.log("saved");
        }
    }
  }
};

var FlightManager = pricelineManager ;
