var hipmunkManager = function(){

};

/**
* Function for making an object of flight
* @return array of Object
*/

hipmunkManager.prototype.getList = function(){
    console.log("Hey Expedia!");
    var rawList = document.getElementsByClassName('flight-routing-bar');
    console.log("--raw list--");
    //console.log(rawList);
    var processedList = [];
    var route,airports=[],depart,arrive,stops=[];
    depart = document.getElementsByClassName('flight-tab-chart-header__city-name m-left')[0].innerText;
    arrive = document.getElementsByClassName('flight-tab-chart-header__city-name m-right')[0].innerText;
    for(var x=0; x< rawList.length; x++){
        airports = rawList[x].getElementsByClassName('flight-routing-bar__layover');
        stops = []
        for(var y=0;y<airports.length;y++){
            stops.push(airports[y].innerText);
        }
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

hipmunkManager.prototype.getCoordinates = function(processedList){
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

hipmunkManager.prototype.getDistances = function(processedList){
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

hipmunkManager.prototype.getEmission = function(processedList){
    processedList = core.getEmission(processedList);
    console.log(processedList);
    return processedList;
};

/**
* Function for inserting Element in DOM
* @param array
* @return array
*/

hipmunkManager.prototype.insertInDom = function(processedList){
    var checkOption = document.getElementsByClassName('flight-tab-itin__info-row');
    var box = document.getElementsByClassName('flight-tab-itin g-no-select js-itin m-roundtrip m-group-0');
    var insertIn = [];
    console.log(checkOption);
    console.log(processedList);
    for(var x=0;x<checkOption.length;x++){
        box[x].style.height = '95px';
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

var FlightManager = hipmunkManager ;
