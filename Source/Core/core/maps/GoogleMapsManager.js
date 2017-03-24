/**
 * MapsManager for Google Maps
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * GoogleMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */


var GoogleMapsManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.update();
};

/**
 * Gets driving modes for all routes.
 * @param {object} route
 * @return {string} mode
 */

GoogleMapsManager.prototype.getMode = function(route) {
  var m = route.getElementsByClassName(
    'section-directions-trip-travel-mode-icon');
  for (var i = m.length - 1; i >= 0; i--) {
    var style = m[i].parentElement.style;
    if (style.display != 'none') {
      var mode = m[i].classList[1];
      console.log('Route mode: ' + mode);
      return mode;
    }
  }
};

/**
 * Gets all routes.
 */

GoogleMapsManager.prototype.getAllRoutes = function() {
  var allRoutes = [];
  var r = document.getElementsByClassName(
    'section-directions-trip clearfix');
  for (var i = r.length - 1; i >= 0; i--) {
    if (r[i].childNodes.length > 0) {
      allRoutes.push(r[i]);
    }
  }
  GoogleMapsManager.allRoutes = allRoutes;
};

/**
 * Gets driving routes.
 * @return {string} routes
 */

GoogleMapsManager.prototype.getAllDrivingRoutes = function() {
  var drivingRoutes = [];
  var r = GoogleMapsManager.allRoutes;
  for (var i = r.length - 1; i >= 0; i--) {
    if (this.getMode(r[i]) == 'drive') {
      drivingRoutes.push(r[i]);
    }
  }
  return drivingRoutes;
};

/**
 * Gets driving routes.
 * @return {string} routes
 */

GoogleMapsManager.prototype.getAllTransitRoutes = function() {
  var transitRoutes = [];
  var r = GoogleMapsManager.allRoutes;
  for (var i = r.length - 1; i >= 0; i--) {
    if (this.getMode(r[i]) == 'transit') {
      transitRoutes.push(r[i]);
    }
  }
  return transitRoutes;
};

/**
 * Gets Total walking time during transit travel.
 * @return {Integer} in seconds
 *
 */

GoogleMapsManager.prototype.transitWalkingTime = function(){
  var transitStep = $(document.getElementsByClassName('transit-logical-step-content noprint transit-hoverable'));
  content = [];
  walkingTimeInMin = 0 ;
  for(x=0;x<transitStep.length;x++){
    if(transitStep[x].innerText.substring(0,4).toLowerCase() == "walk"){
      walkingTimeInMin += parseInt(transitStep[x].innerText.match(/(\d+)\smin/g)[0].split(" ")[0]);
    }
  }
  return walkingTimeInMin;
}

/**
 * Gets Distance for Private Mode of Transportation.
 * @return {Integer} in meters
 * 
 */

GoogleMapsManager.prototype.dataFromDrivingMode = function(dataString,datatype){
  console.log('welcome in case 1');
      type = 'd';
      dataString = dataString.substring(1,dataString.length-1);
      distanceInMtrs = this.convertDistance(dataString);
      unit = "km";
      if(unit == "km")
        unit = "m";distanceInMtrs *=1000;
      console.log(distanceInMtrs + " " + unit);
      if(dataType == 'flag'){
        return "m";
      }
      else
        return distanceInMtrs; 
}

/**
 * Gets Travelling time for Public Mode of Transportation.
 * @return {array} Times in Minutes
 * 
 */

GoogleMapsManager.prototype.dataFromTransitMode = function(dataString,dataType){
  var regex4Time = /\((\d+\ d)?\ ?(\d+\ h)?\ ?(\d+\ min)?\)/g;
  var days = 0 , hours = 0 , mins = 0;
  console.log('welcome in case 2');
  type = 't';
  result = dataString.split(regex4Time);
  console.log(result);
   if(result[1]){
    days = parseInt(result[1].substring(0,2));
  }
  if(result[2]){
    hours = parseInt(result[2].substring(0,2));
  }
  if(result[3]){
    mins = parseInt(result[3].substring(0,2));
  }
  console.log("transit days" + days);
  console.log("transit hours" + hours);
  console.log("transit min" + mins);
  totalTimeInMin = days*24*60 + hours*60 + mins;
  console.log("total transitTime is : " + totalTimeInMin);
  if (dataType == 'flag'){
    return "min";
  }
  else
    return [totalTimeInMin,this.transitWalkingTime()];
}
/**
 * Gets transit distance(in meters) or time(in sec) when either of them is available .
 * @return object 
 * 
 */

GoogleMapsManager.prototype.travelInfo = function(dataType){
  content = document.getElementsByClassName('section-trip-summary-subtitle');
  route = [];
  for(x=0;x<content.length;x++){
    route.push(content[x]);
  }
  console.log(route);
  try {
    console.log('calling getdata');
    route = document.getElementsByClassName('section-trip-summary-subtitle');
    count = 0;
    flag = true ;
    $.each(route,function(key,value){
      console.log(value);
      if(value.innerText.length > 2 && flag){
        dataString = value.innerText;
        console.log("length greater than 2" +dataString);
        flag = false ;
        console.log('found the value and hence going of the loop');
      }
      if(flag){
        count++;
      }
    });
    if(count === 0){
      return this.dataFromDrivingMode(dataString,dataType);
    }
    else if(count === 1){
      return this.dataFromTransitMode(dataString,dataType);
    }
    else{
      return {
        "status" : false
      };
    }
  }
  catch(err){
  }
};

/**
 * Classes that contain distance and where results are displayed
 *    for driving mode
 */

GoogleMapsManager.infoClasses = [
  'section-directions-trip-distance',
  'section-directions-trip-secondary-text'
];

/**
 * Classes that contain distance and where results are displayed
 *    for transit mode
 */

GoogleMapsManager.durationClass =
  'section-directions-trip-duration';

/**
  * Class in which resulted element of footprint is appended
  */

GoogleMapsManager.summaryTitleClass = 
  'section-trip-summary-description' ;

  /**
    * Class from which the distance is scrapped from the dom
    */

  GoogleMapsManager.infoTransitClasses4D = [
    'section-directions-trip-summary',
    'section-directions-trip-secondary-text'
  ];

/**
  * Class from which walking distance during travelling is scrapped
  */

  GoogleMapsManager.walkingSummary = [
    'section-directions-trip-walking-duration',
    'section-directions-trip-secondary-text'
  ];

  /**
  * Class from which time is extracted for a particular route
  */

  GoogleMapsManager.infoTransitClasses4T = 
  'section-trip-summary'; 

  /**
  * Class from which distance is extracted in lite mode
  */

  GoogleMapsManager.drivingModeScreen = 
  'ml-directions-pane-header-container';

  /**
  * Class from which time is extracted in lite mode
  */

  GoogleMapsManager.transitModeScreen = 
  'ml-directions-selection-screen';

  /**
  *  Class in which footprints are to inserted in lite mode
  */

  GoogleMapsManager.insertInLiteTransit =
  'ml-directions-selection-screen-transit-further-details';

  /**
  * Class in which footprints are to inserted in lite mode
  */

  GoogleMapsManager.insertInLiteDriving = 
  'ml-directions-pane-header-line-summary-container' ;

/**
 * Gets distance for driving route.
 * @param {object} route
 * @return {string} distanceString
 */

GoogleMapsManager.prototype.getDistanceString = function(route) {
  var distanceString = route
        .getElementsByClassName(GoogleMapsManager.infoClasses[0] + ' ' +
                                GoogleMapsManager.infoClasses[1])[0]
        .childNodes[5]
        .innerHTML;
  console.log('distanceString: ' + distanceString);
  return distanceString;
};

/**
 * Gets time for transit route.
 * @param {object} route
 * @return {array} [timeString,walkingTime] as obtained from scrapping
 */

GoogleMapsManager.prototype.getTimeString = function(route,type) {
  if(type == "n"){
  var timeString = route
        .getElementsByClassName(GoogleMapsManager.durationClass)[0].innerHTML;
  var walkingTime = route
        .getElementsByClassName(GoogleMapsManager.walkingSummary[0] + ' ' + 
                                  GoogleMapsManager.walkingSummary[1])[0].innerText;
  timeString = ' ' + timeString;
  console.log(walkingTime);
  console.log('timeString:' + timeString);
  return [timeString,walkingTime];
  }
  else{
    var timeString = route
                .getElementsByClassName('ml-directions-selection-screen-lines-section-right')[0]
                .innerText;
    console.log(timeString);
    timeString = " " + timeString;
    return timeString;
  }
};

/**
 * Converts Distance.
 * @param {string} distanceStr
 * @return {float} distanceFloat
 */

GoogleMapsManager.prototype.convertDistance = function(distanceStr) {
  if (distanceStr) {
    var distanceAndUnit = distanceStr.replace('&nbsp;', ' ').split(/ /);
    var distance = distanceAndUnit[0];
    var unit = distanceAndUnit[1];
    var distanceFloat = this.footprintCore
          .getDistanceFromStrings(distance, unit);
    return distanceFloat;
    }
};

/**
 * Converts total time into hours.
 * @param {string} timeStr
 * @return {float} hrs
 */

GoogleMapsManager.prototype.convertTime = function(timeStr) {
  if (timeStr) {
    var days = (/ (\w*) d/).exec(timeStr);
    var hrs = (/ (\w*) h/).exec(timeStr);
    var mins = (/ (\w*) m/).exec(timeStr);
    if (hrs) {
      hrs = parseFloat(hrs[1]);
    }
    else {
      hrs = 0;
    }
    if (mins) {
      mins = parseFloat(mins[1]);
      hrs += mins / 60;
    }
    if (days) {
      days = parseFloat(days[1]);
      hrs += days * 24;
    }
    return hrs;
  }
};

/**
 * Inserts element where footprints will be displayed if not present
 * @param {object} route
 * @param {element} e
 * @param {string} type Driving and Transit have different DOM classes
 */

GoogleMapsManager.prototype.insertFootprintElement = function(route, e, type) {
  if (route
      .getElementsByClassName('section-directions-trip-numbers')[0]
      .getElementsByClassName('carbon').length === 0) {
    switch (type) {
    case 'd':
      route
        .getElementsByClassName(GoogleMapsManager.infoClasses[0] + ' ' +
                                GoogleMapsManager.infoClasses[1])[0]
        .appendChild(e);
      break;
    case 't':
      route
        .getElementsByClassName('section-directions-trip-numbers')[0]
        .appendChild(e);
      break;
    }
  }
};

/**
 * Inserts element where footprints will be displayed if not present in details view
 * @param {object} route
 * @param {element} e
 * @param {char} type
 * @param {char} mode lite("l")/normal("n");
 */

GoogleMapsManager.prototype.insertTransitElement = function(route,e,type){
  console.log(route[0]);
    if(document
    .getElementsByClassName('carbon').length === 0 && document.getElementsByClassName('section-directions-trip').length == 0){
      if(type == 'd'){document
        .getElementsByClassName(GoogleMapsManager.infoTransitClasses4D[0] + ' ' +
                              GoogleMapsManager.infoTransitClasses4D[1])[0]
        .appendChild(e);
      }
      else{
      document.getElementsByClassName(GoogleMapsManager.infoTransitClasses4T)[0]
      .appendChild(e);
      }
    }
};

/**
 * Inserts footprint elements in the lite mode .
 * @param {object} route
 * @param {element} e
 */

GoogleMapsManager.prototype.insertInLiteMaps = function(route,e,type){
  if(type=="t"){
    if (route
            .getElementsByClassName(GoogleMapsManager.insertInLiteTransit)[0]
             .getElementsByClassName('carbon').length === 0){
      route
      .getElementsByClassName(GoogleMapsManager.insertInLiteTransit)[0]
      .append(e);
    }  
  }
  else{
    if(route
            .getElementsByClassName('carbon').length === 0){
      route
          .getElementsByClassName(GoogleMapsManager.insertInLiteDriving)[0]
          .append(e);
    }
  }  
} 
/**
 * Inserts element where footprints will be displayed if not present in details view
 *       Considering the walking time and total time in the journey when distance is 
 *        not given .
 * @param {object} route
 * @param {element} e
 */

GoogleMapsManager.prototype.insertDetailedFootprintElement = function(){
    unit = this.travelInfo(dataType='flag');
    data = this.travelInfo(dataType = 'data');
    console.log(data);
    type = "t" ; //default
    if(unit == "m"){
      type = "d";
      try{
      dataElement = this.footprintCore.createPTransitFootprintElement(data,"d");
      }
    catch(err){
        console,log(err);
      }
    }
    else if(unit == "min"){
      type = "t";
      totalTransitTime = data[0];
      totalWalkingTime = data[1];
      try{
      dataElement = this.footprintCore.createPTransitFootprintElement(data,"t");
      }
    catch(err){
        console.log(err);
      }
      console.log(totalWalkingTime);
    }
    else{
      console.log(unit);
      console.log(data);
    }
  try{
    targetElement = document.getElementsByClassName(GoogleMapsManager.summaryTitleClass);
    console.log(targetElement);
    console.log(dataElement);
    try{
       this.insertTransitElement(targetElement,dataElement,type);
      }
    catch(err){
      console.log(err);
    }
  }
  catch(err){
    var url = window.location.href ;
    if(url.substring(url.length-4,url.length) == 'lite'){
      console.error('Please try open maps in normal mode.');
      this.liteGoogleMaps();
    }
    else{
      console.log('showing possible routes to the destination');
    }
    
  }
};

/**
 * Inserts element where travel cost will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

GoogleMapsManager.prototype.insertTravelCostElement = function(route, e) {
  if (route.getElementsByClassName('travelCost').length === 0) {
      route
        .getElementsByClassName(GoogleMapsManager.infoClasses[0] + ' ' +
                                GoogleMapsManager.infoClasses[1])[0]
        .appendChild(e);
  }
};

/**
 * Calling for inserting the footprint in lite Google maps
 */ 

GoogleMapsManager.prototype.liteGoogleMaps = function(){
  this.liteMapsTransitMode();
  this.liteMapsDrivingMode();
};

/**
 * Inserts footprint elements in transit mode for each route
 */

GoogleMapsManager.prototype.liteMapsTransitMode = function(){
  try{
  var transitElements = $('.' + GoogleMapsManager.transitModeScreen)[0]
                            .getElementsByClassName('ml-directions-selection-screen-row');
  console.log(transitElements);
  var distance = 0 ;
    for(var x=0;x<transitElements.length;x++){
      timeString = this.getTimeString(transitElements[x]);
      timeInMins = this.convertTime(timeString,'l')*60;
      this.insertInLiteMaps(
        transitElements[x],
        this.footprintCore.createPTransitFootprintElement([timeInMins,0],'t'),
        't'
        );
    }
  }
  catch(err){
  }
};

/**
 * Inserts footprint element during Driving
 */

GoogleMapsManager.prototype.liteMapsDrivingMode = function(){
  try{
    var targetElement = document.getElementsByClassName('ml-directions-pane-toggle')[0];
    console.log(targetElement);
    var distanceString = document.getElementsByClassName('ml-directions-pane-header-distance')[0]
                        .innerText;
    console.log(distanceString);
    if(distanceString.length > 0){
        distanceString = distanceString.substring(1,distanceString.length-1);
        var distanceInKm = this.convertDistance(distanceString);
        this.insertInLiteMaps(
          targetElement,
          this.footprintCore.createFootprintElement(distanceInKm),
          'd'
          );
      if (this.settingsProvider.showTravelCost()){
        this.insertTravelCostElement(
          targetElement,
          this.footprintCore.createTravelCostElement(distanceInKm)
        );
      }
    }
  }
  catch(err){
  }
};

/**
 * called by MutationObeserver to update footprints
 */

GoogleMapsManager.prototype.update = function(){
  this.getAllRoutes();
  var i;
  var drivingRoutes = this.getAllDrivingRoutes();
  var transitRoutes = this.getAllTransitRoutes();
  this.insertDetailedFootprintElement();
  for (i = 0; i < drivingRoutes.length; i++) {
    var distanceString = this.getDistanceString(drivingRoutes[i]);
    console.log(distanceString);
    var distanceInKm = this.convertDistance(distanceString);
    this.insertFootprintElement(
      drivingRoutes[i],
      this.footprintCore.createFootprintElement(distanceInKm),
      'd'
    );
    if (this.settingsProvider.showTravelCost()) {
      this.insertTravelCostElement(
        drivingRoutes[i],
        this.footprintCore.createTravelCostElement(distanceInKm)
      );
    }
  }
  for (i = 0; i < transitRoutes.length; i++) {
    var timeString = this.getTimeString(transitRoutes[i],"n");
    var timeInMins = this.convertTime(timeString[0])*60;
    var walkingTimeInMins = this.convertTime(timeString[1])*60;
    console.log(walkingTimeInMins)
    this.insertFootprintElement(
      transitRoutes[i],
      this.footprintCore.createPTransitFootprintElement([timeInMins,walkingTimeInMins],'t'),
      't'
    );
  }
};

var MapManager = GoogleMapsManager;