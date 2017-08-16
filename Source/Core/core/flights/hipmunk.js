var hipmunkManager = function(footprintCore, settingsProvider){
 this.core = footprintCore;
 this.settingsProvider = settingsProvider;
 this.validator = new FlightsValidator("hipmunk");
};

/**
* Function for making an object of flight
* @return array of Object
*/

hipmunkManager.prototype.getList = function(){
    console.log("Hey Hipmunk!");
    var rawList = document.getElementsByClassName('flight-routing-bar');
    console.log("--raw list--");
    //console.log(rawList);
    var processedList = [];
    var route,airports=[],depart,arrive,stops=[];
    if(rawList.length){
      depart = this.validator.getByClass('flight-tab-chart-header__city-name m-left')[0].innerText;
      arrive = this.validator.getByClass('flight-tab-chart-header__city-name m-right')[0].innerText;
    }
    for(var x=0; x< rawList.length; x++){
        airports = rawList[x].getElementsByClassName('flight-routing-bar__layover');
        stops = [];
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
    this.validator.verifyList(processedList);
    console.log(processedList);
    return processedList;
};

/**
* Function for inserting Element in DOM
* @param array
* @return array
*/

hipmunkManager.prototype.insertInDom = function(processedList){
  if(processedList.length){
    var checkOption = this.validator.getByClass('flight-tab-itin__info-row');
    var box = this.validator.getByClass('flight-tab-itin g-no-select js-itin m-roundtrip m-group-0');
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
            insertIn.appendChild(this.core.createMark(processedList[x].co2Emission,0));
        }
        else{
            console.log("saved");
        }
    }
  }
};

var WebsiteManager = hipmunkManager ;
