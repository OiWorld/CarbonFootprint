var travelocityManager = function(){

};

/**
* Function for making an object of flight
* @return array of Object
*/

travelocityManager.prototype.getList = function(){
    //console.log("Hey Cleartrip!");
    var rawList = document.getElementsByClassName('flight-module segment offer-listing');
    console.log("--raw list--");
    //console.log(rawList);
    var processedList = [];
    var route,airports=[],depart,arrive,stops=[];
    for(var x=0; x< rawList.length; x++){
        details = rawList[x].getElementsByClassName('primary-block');
        //console.log(rawList);
        airports = details[1].getElementsByClassName('secondary')[0].innerText;
        //console.log(airports);
        check = details[2].getElementsByClassName('primary')[0].innerText;
        //console.log(check);
        check = check.split(" ");
        //console.log(check);
        if(check.length===1){
            stops = [];
            //console.log("no stops");
        }
        else{
            stops = details[2].getElementsByClassName('secondary')[0].innerText;
            //console.log(stops);
            if(parseInt(check[0]) == 1){
            stops = stops.split(" ");
                stops = stops[stops.length-1];
                stops = [stops];
         }
            else{
                //console.log(stops);
            stops = stops.split(",").join("").split(" ");
         }
        }
        route = airports.split(" ").join("").split("-");
        depart = route[0];
        arrive = route[1];
        //console.log(depart,arrive);
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

travelocityManager.prototype.getCoordinates = function(processedList){
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

travelocityManager.prototype.getDistances = function(processedList){
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

travelocityManager.prototype.getEmission = function(processedList){
    processedList = core.getEmission(processedList);
    console.log(processedList);
    return processedList;
};

/**
* Function for inserting Element in DOM
* @param array
* @return array
*/

travelocityManager.prototype.insertInDom = function(processedList){
    var checkOption = document.getElementsByClassName('details-holder');
    var insertIn = [];
    console.log(checkOption);
    console.log(processedList);
    for(var x=0;x<checkOption.length;x++){
        console.log(checkOption[x].getElementsByClassName('carbon'));
        insertIn = checkOption[x];
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

/**
* Function for Updating the DOM
*/

travelocityManager.prototype.update = function(){
    var processedList = this.getList();
    if(core.airplanesData && core.airportsData){
        processedList = this.getCoordinates(processedList);
        processedList = this.getDistances(processedList);
        processedList = this.getEmission(processedList);
        this.insertInDom(processedList);
    }
    console.log(processedList);
};

var FlightManager = travelocityManager ;
