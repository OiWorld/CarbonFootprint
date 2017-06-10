var pricelineManager = function(){

};

/**
* Function for making an object of flight
* @return array of Object
*/

pricelineManager.prototype.getList = function(){
    console.log("Hey Cleartrip!");
    var rawList = document.getElementsByClassName('listItem nonBundled');
    console.log("raw list");
    console.log(rawList);
    var processedList = [];
    var route,getValidRoute=[];
    for(var x=0; x< rawList.length; x++){
        route = rawList[x].getElementsByClassName('route')[0].innerText;
        route = route.split(" ");

        for(var y=0;y<route.length;y+=2){
            getValidRoute.push(route[y]);
        }
        route = getValidRoute;
        getValidRoute = [];
        if(route.length>2) stops = route.slice(1,route.length-1);
        else stops = []
        depart = route[0];
        arrive = route[route.length-1];
        processedList.push({
            depart: depart,
            arrive :arrive,
            stops:stops,
            aircraft: "A380"
        });
        console.log(stops);
    }
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
    var checkOption = document.getElementsByClassName('listItem nonBundled');
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

pricelineManager.prototype.update = function(){
    var processedList = this.getList();
    if(core.airplanesData && core.airportsData){
        processedList = this.getCoordinates(processedList);
        processedList = this.getDistances(processedList);
        processedList = this.getEmission(processedList);
        this.insertInDom(processedList);
    }
    console.log(processedList);
};

var FlightManager = pricelineManager ;
