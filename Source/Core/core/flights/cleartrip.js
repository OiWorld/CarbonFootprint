var clearTripManager = function(footprintCore, settingsProvider){
  this.this.core = footprintCore;
  this.settingsProvider = settingsProvider;
  this.validator = new FlightsValidator("cleartrip");
};

/**
* Function for making an object of flight
* @return array of Object
*/

clearTripManager.prototype.getList = function(){
    console.log("Hey Cleartrip!");
    var rawList = document.getElementsByClassName('listItem nonBundled');
    console.log("raw list");
    console.log(rawList);
    var processedList = [];
    var route,getValidRoute=[];
    for(var x=0; x< rawList.length; x++){
        route = this.validator.getByClass('route', rawList[x])[0].innerText;
        route = route.split(" ");

        for(var y=0;y<route.length;y+=2){
            getValidRoute.push(route[y]);
        }
        route = getValidRoute;
        getValidRoute = [];
        if(route.length>2) stops = route.slice(1,route.length-1);
        else stops = [];
        var depart = route[0];
        var arrive = route[route.length-1];
        processedList.push({
            depart: depart,
            arrive: arrive,
            stops: stops,
            aircraft: "A380"
        });
        this.validator.verifyList(processedList);
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

clearTripManager.prototype.getCoordinates = function(processedList){
    processedList = this.core.getCoordinates(processedList);
    console.log("--- got coordinates ---");
    console.log(processedList);
    return processedList;
};

/**
* Function for getting Total Distance of flight
* @param array
* @return array
*/

clearTripManager.prototype.getDistances = function(processedList){
    processedList = this.core.getTotalDistance(processedList);
    console.log("---got Distance---");
    console.log(processedList);
    return processedList;
};

/**
* Function for getting Emission of flight
* @param array
* @return array
*/

clearTripManager.prototype.getEmission = function(processedList){
    processedList = this.core.getEmission(processedList);
    console.log(processedList);
    return processedList;
};

/**
* Function for inserting Element in DOM
* @param array
* @return array
*/

clearTripManager.prototype.insertInDom = function(processedList){
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
            insertIn.appendChild(this.core.createMark(processedList[x].co2Emission,0));
        }
        else{
            console.log("saved");
        }
    }
};

var WebsiteManager = clearTripManager ;
