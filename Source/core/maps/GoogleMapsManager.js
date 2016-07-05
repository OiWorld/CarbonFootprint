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
  this.update();
};

/**
 * Gets driving modes for all routes.
 * @param {object} route
 * @return {string} mode
 */

GoogleMapsManager.prototype.getMode = function(route) {
  var m = route.getElementsByClassName(
    'widget-pane-section-directions-trip-travel-mode-icon');
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
  var routes = [];
  var r = document.getElementsByClassName(
    'widget-pane-section-directions-trip clearfix');
  for (var i = r.length - 1; i >= 0; i--) {
    if (r[i].childNodes.length > 0) {
      routes.push(r[i]);
    }
  }
  GoogleMapsManager.allRoutes = routes;
};

/**
 * Gets driving routes.
 * @return {string} routes
 */

GoogleMapsManager.prototype.getAllDrivingRoutes = function() {
  var routes = [];
  var r =  GoogleMapsManager.allRoutes;
  for (var i = r.length - 1; i >= 0; i--) {
    if (this.getMode(r[i]) == 'drive') {
      routes.push(r[i]);
    }
  }
  return routes;
};

/**
 * Gets driving routes.
 * @return {string} routes
 */

GoogleMapsManager.prototype.getAllTransitRoutes = function() {
  var routes = [];
  var r =  GoogleMapsManager.allRoutes;
  for (var i = r.length - 1; i >= 0; i--) {
    if (this.getMode(r[i]) == 'transit') {
      routes.push(r[i]);
    }
  }
  return routes;
};

/**
 * Classes that contain distance and where results are displayed
 * for driving mode
 */

GoogleMapsManager.prototype.infoClasses = [
  'widget-pane-section-directions-trip-distance',
  'widget-pane-section-directions-trip-secondary-text'
];

/**
 * Classes that contain distance and where results are displayed
 * for transit mode
 */

GoogleMapsManager.prototype.durationClass =
  'widget-pane-section-directions-trip-duration';

/**
 * Gets distance for driving route.
 * @param {object} route
 * @return {string} distanceString
 */

GoogleMapsManager.prototype.getDistanceString = function(route) {
  var distanceString = route
        .getElementsByClassName(this.infoClasses[0] + ' ' +
                                this.infoClasses[1])[0]
        .childNodes[5]
        .innerHTML;
  console.log('distanceString: ' + distanceString);
  return distanceString;
};

/**
 * Gets time for transit route.
 * @param {object} route
 * @return {string} timeString
 */

GoogleMapsManager.prototype.getTimeString = function(route) {
  var timeString = route
        .getElementsByClassName('widget-pane-section-directions-trip-duration')[0].innerHTML;
  timeString = ' ' + timeString;
  console.log('timeString:' + timeString);
  return timeString;
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
    if(hrs){
      hrs = parseFloat(hrs[1]);
    }
    else{
      hrs = 0;
    }
    if(mins){
      mins = parseFloat(mins[1]);
      hrs += mins/60;
    }
    if(days){
      days = parseFloat(days[1]);
      hrs += days*24;
    }
    return hrs;
  }
};

/**
 * Inserts element where footprints will be displayed if not present
 * @param {object} route
 * @param {element} e
 * @param {string} type
 */

GoogleMapsManager.prototype.insertFootprintElement = function(route, e, type) {
  if (route.getElementsByClassName('carbon').length === 0) {
    switch(type){
    case 'd':
      route
        .getElementsByClassName(this.infoClasses[0] + ' ' +
                                this.infoClasses[1])[0]
        .appendChild(e);
      break;
    case 't':
      route
        .getElementsByClassName('widget-pane-section-directions-trip-numbers')[0]
        .appendChild(e);
      break;
    }
  }
};

/**
 * Inserts element where travel cost will be displayed if not present
 * @param {object} route
 * @param {element} e
 * @param {string} type
 */

GoogleMapsManager.prototype.insertTravelCostElement = function(route, e, type) {
  if (route.getElementsByClassName('travelCost').length === 0) {
    switch(type){
    case 'd':
      route
        .getElementsByClassName(this.infoClasses[0] + ' ' +
                                this.infoClasses[1])[0]
        .appendChild(e);
      break;
    case 't':
      route
        .getElementsByClassName('widget-pane-section-directions-trip-numbers')[0]
        .appendChild(e);
    }
  }
};

/**
 * called by MutationObeserver to update footprints
 */

GoogleMapsManager.prototype.update = function() {
  this.getAllRoutes();
  var i;
  var drivingRoutes = this.getAllDrivingRoutes();
  var transitRoutes = this.getAllTransitRoutes();
  for (i = 0; i < drivingRoutes.length; i++) {
    var distanceString = this.getDistanceString(drivingRoutes[i]);
    var distanceInKm = this.convertDistance(distanceString);
    this.insertFootprintElement(
      drivingRoutes[i],
      this.footprintCore.createFootprintElement(distanceInKm,'d'),
      'd'
    );
    if (this.settingsProvider.showTravelCost()) {
      this.insertTravelCostElement(
        drivingRoutes[i],
        this.footprintCore.createTravelCostElement(distanceInKm,'d'),
        'd'
      );
    }
  }
  for (i = 0; i < transitRoutes.length; i++) {
    var timeString = this.getTimeString(transitRoutes[i]);
    var timeInHrs = this.convertTime(timeString);
    this.insertFootprintElement(
      transitRoutes[i],
      this.footprintCore.createFootprintElement(timeInHrs,'t'),
      't'
    );
    if (this.settingsProvider.showPTCost()) {
      this.insertTravelCostElement(
        transitRoutes[i],
        this.footprintCore.createTravelCostElement(timeInHrs,'t'),
        't'
      );
    }
  }
};

var MapManager = GoogleMapsManager;
