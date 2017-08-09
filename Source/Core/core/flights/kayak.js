var kayakManager = function(footprintCore, settingsProvider){
  this.core = footprintCore;
  this.settingsProvider = settingsProvider;
  this.validator = new FlightsValidator("kayak");
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

        stops = this.validator.getByClass('stops', rawList[x])[0].innerText;
        stops = stops.split(",").join("");
        stops = stops.slice(0,stops.length-1);
        stops = stops.split(" ");
        depart = this.validator.getByClass('depart', rawList[x])[0];
        depart = this.validator.getByClass('bottom', depart)[0].innerText;
        arrive = this.validator.getByClass('return', rawList[x])[0];
        arrive = this.validator.getByClass('bottom', arrive)[0].innerText.split(" ")[0];
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
    this.validator.verifyList(processedList);
    console.log(processedList);
    return processedList;
};

/**
* Function for getting coordinates from the JSON
* @param array
* @result array
 */

kayakManager.prototype.getCoordinates = function(processedList){
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

kayakManager.prototype.getDistances = function(processedList){
    processedList = this.core.getTotalDistance(processedList);
    console.log("---got Distance---");
    console.log(processedList);
    return processedList;
};

kayakManager.prototype.getEmission = function(processedList){
    processedList = this.core.getEmission(processedList);
    console.log(processedList);
    return processedList;
};


/**
 * Function for inserting Element in DOM
 * @param array
 * @return array
 */

kayakManager.prototype.insertInDom = function(processedList){
  if(processedList){
    var checkOption = this.validator.getByClass('resultInner');
    var insertIn = [];
    console.log(checkOption);
    console.log(processedList);
    for(var x=0;x<checkOption.length;x++){
        insertIn = this.validator.getByClass('extraInfo', checkOption[x]);
        insertIn = insertIn[insertIn.length-1];
        if(checkOption[x].getElementsByClassName('carbon').length<1){
            insertIn.appendChild(this.core.createMark(processedList[2*x].co2Emission,processedList[(2*x)+1].co2Emission));
            console.log('inserted');
        }
        else{
            console.log("already presented");
        }
    }
  }
};

var WebsiteManager = kayakManager ;
