var kayakManager = function(){
    
};
 /**
 * Function for making an object of flight
 * @return array of object
  */

kayakManager.prototype.getList = function(){
    console.log("Hey priceline!");
    var rawList = document.getElementsByClassName('');
    console.log("----raw List----");
    console.log(rawList);
    var processedList = [];
    var stops,depart,arrive,airport;
    for(var x = 0; x<rawList.length; x++){
        stops = rawList[x].getElementsByClassName('');
        airport = rawList[x].getElementsByClassName('');
        //depart = airport[0]
        //arrive
        // if(stops.length>0){
        // }
        processedList.push({
            depart:depart,
            arrive:arrive,
            stops:stops,
            aircraft:'A380'
        });
        console.log(stops);
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

/**
 * Function for inserting Element in DOM
 * @param array
 * @return array
 */

kayakManager.prototype.insertDOM = function(processedList){
};

/**
 * Function for Updating the DOM
 */

kayakManager.prototype.update = function(){
    console.log("Its working?")
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
