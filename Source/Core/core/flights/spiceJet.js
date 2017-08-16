var spiceManager = function(footprintCore, settingsProvider){
  this.core = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.validator = new FlightsValidator("spiceJet");
};
spiceManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("flightInfo");
  console.log("raw list");
  //console.log(rawList);
  var processedList = [];
  list = [];
  for(var x = 0, i = rawList.length; x < i; x+=2){
    list.push(this.validator.getByTag("p", rawList[x]));
  }
  console.log(list);
  for(x = 0, i = list.length; x < i; x++){
    var depart, arrive, stopsProcessed = [], stops = [], airplanes = [];
    for(var y = 1, j = list[x].length; y < j; y+=5){
      var destinations = list[x][y].innerHTML.split("\n");
      airplanes.push(list[x][y+1].innerHTML.split(" ")[4]);
      if(y == 1){
        depart = destinations[0].substring(0, 3);
        stops.push(destinations[2].substring(10, 13));
      }
      if(y == list[x].length - 3){
        arrive = destinations[2].substring(10, 13);
        stops.push(destinations[0].substring(0, 3));
      }
      if(y != 1 && y != list[x].length - 3){
        stops.push(destinations[0].substring(0, 3));
        stops.push(destinations[2].substring(10, 13));
      }
    }
    if(stops[0] == arrive){
      stopsProcessed = [];
    }
    else{
      for(y = 0, j = stops.length; y < j; y+=2){
        stopsProcessed.push(stops[y]);
      }
    }
    console.log("-------final scraped values--------");
    console.log(depart);
    console.log(stopsProcessed);
    console.log(arrive);
    processedList.push({
      depart: depart,
      arrive: arrive,
      stops: stopsProcessed,
      aircraft: "A380", //hardcoded for now
      airplanes: airplanes
    });
  }
  //console.log(list);
  console.log("--- initial list ---");
  console.log(processedList);
  this.validator.verifyList(processedList);
  return processedList;
};

spiceManager.prototype.style = function(e){
  e.style.marginTop = "5px";
  e.style.marginLeft = "-65px";
  return e;
};

spiceManager.prototype.insertInDom = function(processedList){
  if(processedList.length > 0){
    insertIn = this.validator.getByClass("flight-icon-symbol bold");
    for(var x = 0, i = insertIn.length; x < i; x++){
      if(insertIn[x].getElementsByClassName("carbon").length === 0){
           insertIn[x].appendChild(this.style(this.core.createMark(processedList[x].co2Emission)));
      }
    }
  }
};

var WebsiteManager = spiceManager;
