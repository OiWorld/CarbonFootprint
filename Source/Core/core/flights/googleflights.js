var googleFlightsManager = function(){

};

/**
* Function for making an object of flight
* @return array of Object
*/

googleFlightsManager.prototype.getList = function(){
    console.log("Hey Google Flights!");
    var rawList = document.getElementsByClassName('OMOBOQD-d-W OMOBOQD-d-Lb OMOBOQD-d-S');
    console.log(rawList);
    console.log("--raw list--");
    //console.log(rawList);
    var processedList = [];
    var route,airports=[],depart,arrive,stops=[];
    airports = document.getElementsByClassName('OMOBOQD-Ib-a');
    depart = airports[0].innerText;
    arrive = airports[1].innerText;
    for(var x=1; x< rawList.length-1; x++){
        detail = rawList[x].getElementsByClassName('OMOBOQD-d-Qb')[0].innerText;
        detail = detail.split(" ");
        console.log(detail);
        if(detail.length === 1 || rawList[x].getElementsByClassName('OMOBOQD-d-Z').length == 0){
            stops = [] ;
        }
        else {
            stops = rawList[x].getElementsByClassName('OMOBOQD-d-Z')[0].innerText.split(" ");
            if(parseInt(detail[0]) === 1){
                if(stops[0] === 'Change'){
                    stops = [];
                }
                else{
                    stops = stops[stops.length-1];
                    stops = [stops];
                }
            }
        else{
            stops = stops.join(" ").split(",").join("").split(" ");
           }
        }
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
    var checkOption = document.getElementsByClassName('OMOBOQD-d-W OMOBOQD-d-Lb OMOBOQD-d-S');
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
        insertIn = checkOption[x].getElementsByClassName('OMOBOQD-d-X')[0];
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
