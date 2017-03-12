/**
 * MapsManager for Waze
 */

 /**
 * WazeMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

var WazeMapsManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.update();
};


/**
 * Gets driving routes.
 * @return {string} routes
 */

WazeMapsManager.prototype.getAllDrivingRoutes = function() {
  var routes = [];
  // Get all routes suggested by waze Maps. route-info
  var r = document.getElementsByClassName('route-info');
  for (var i = r.length - 1; i >= 0; i--) {
      routes.push(r[i]);
  }
  console.log(routes);
  return routes;
};

/**
 * Gets distance for a route.
 * @param {object} route
 * @return {string} distanceString
 */

WazeMapsManager.prototype.getDistanceString = function(route) {
  var distanceString = route.getElementsByClassName('route-length')[0].textContent;
  distanceString = distanceString.trim();
  console.log('distanceString: ' + distanceString);
  return distanceString;
};

/**
 * Gets time for transit route.
 * @param {object} route
 * @return {string} timeString
 */

WazeMapsManager.prototype.getTimeString = function(route) {
  var timeString = route.getElementsByClassName('route-time')[0].textContent;
  timeString = ' ' + timeString.trim();
  console.log('timeString:' + timeString);
  return timeString;
};

/**
 * Converts Distance.
 * @param {string} distanceStr
 * @return {float} distanceFloat
 */

WazeMapsManager.prototype.convertDistance = function(distanceStr) {
  if (distanceStr) {
    var distanceAndUnit = distanceStr.replace('&nbsp;', ' ').split(/ /);
    var distance = distanceAndUnit[0];
    var unit = distanceAndUnit[1];
    return this.footprintCore.getDistanceFromStrings(distance, unit);
  }
};

/**
 * Inserts element where footprints will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

 WazeMapsManager.prototype.insertFootprintElement = function(route, e) {
   if (route.getElementsByClassName('carbon').length === 0) {
     e.setAttribute(
       'style',
       'padding-left:5px;display:inline-block;position:relative;top:-5px;'
     );
     route
       .getElementsByClassName('route-stats')[0]
       .appendChild(e);
   }
 };

 /**
 * Inserts element where travel cost will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

WazeMapsManager.prototype.insertTravelCostElement = function(route, e) {
  //A check to ensure that the display travel cost checkbox is checked
  if (route.getElementsByClassName('travelCost').length === 0) {
    e.setAttribute(
      'style',
      'padding-right:15px;display:inline-block;position:relative;top:-15px;'
    );
    route
      .getElementsByClassName('route-stats')[0]
      .appendChild(e);
  }
};

/**
 * called by MutationObeserver to update footprints
 */

WazeMapsManager.prototype.update = function() {
  var thisMap = this;
  var drivingRoutes = thisMap.getAllDrivingRoutes();
  var i;
  for (i = 0; i < drivingRoutes.length; i++) {
    var distanceString = thisMap.getDistanceString(drivingRoutes[i]);
    var distanceInKm = thisMap.convertDistance(distanceString);
    thisMap.insertFootprintElement(
      drivingRoutes[i],
      thisMap.footprintCore.createFootprintElement(distanceInKm)
    );
    if (thisMap.settingsProvider.showTravelCost())
      thisMap.insertTravelCostElement(
        drivingRoutes[i],
        thisMap.footprintCore.createTravelCostElement(distanceInKm)
      );
  }
};

var MapManager = WazeMapsManager;
