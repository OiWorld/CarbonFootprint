var kayakManager = function(){
};
 /**
 * Function for making an object of flight
 * @return array of object
  */

kayakManager.prototype.getList = function(){
    console.log("Hey kayak!");
    var rawList = document.getElementsByClassName('flight');
    console.log("----raw List----");
    console.log(rawList);
    var processedList = [];
    var stops,depart,arrive,airport;
    for(var x = 0; x<rawList.length; x++){

        stops = rawList[x].getElementsByClassName('stops')[0].innerText;
        stops = stops.split(",").join("");
        stops = stops.slice(0,stops.length-1);
        stops = stops.split(" ");
        depart = rawList[x].getElementsByClassName('depart')[0].getElementsByClassName('bottom')[0].innerText;
        arrive = rawList[x].getElementsByClassName('return')[0].getElementsByClassName('bottom')[0].innerText.split(" ")[0];
        console.log(stops);
        if(stops.length==1){
            if(stops[0]==="non-stop")
               stops = [];

        }
        processedList.push({
            depart:depart,
            arrive:arrive,
            stops:stops,
            aircraft:'A380'
        });
        //console.log(stops);
    }
    console.log(processedList);
    return processedList;
};

/**
* Function for getting coordinates from the JSON
* @param array
* @result array
 */

kayakManager.prototype.getCoordinates = function(processedList){
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

kayakManager.prototype.getDistances = function(processedList){
    processedList = core.getTotalDistance(processedList);
    console.log("---got Distance---");
    console.log(processedList);
    return processedList;
};

kayakManager.prototype.getEmission = function(processedList){
    processedList = core.getEmission(processedList);
    console.log(processedList);
    return processedList;
};


/**
 * Function for inserting Element in DOM
 * @param array
 * @return array
 */

kayakManager.prototype.insertInDom = function(processedList){
    var checkOption = document.getElementsByClassName('resultInner');
    var insertIn = [];
    console.log(checkOption);
    console.log(processedList);
    for(var x=0;x<checkOption.length;x++){
        insertIn = checkOption[x].getElementsByClassName('extraInfo');
        insertIn = insertIn[insertIn.length-1];
        if(checkOption[x].getElementsByClassName('carbon').length<1){
            insertIn.appendChild(core.createMark(processedList[2*x].co2Emission,processedList[(2*x)+1].co2Emission));
            console.log('inserted');
        }
        else{
            console.log("already presented");
        }
    }
};

/**
 * Function for Updating the DOM
 */

kayakManager.prototype.update = function(){
    var processedList = this.getList();
    if(core.airplanesData && core.airportsData){
        processedList = this.getCoordinates(processedList);
        processedList = this.getDistances(processedList);
        processedList = this.getEmission(processedList);
        this.insertInDom(processedList);
    }
    console.log(processedList);
};

var FlightManager = kayakManager ;
