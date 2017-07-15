/**
 * MapsManager for Bing Maps
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * BingMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

var BingMapsManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.validator = new MapsValidator("bing");
  this.update();
};

/**
 * Checks if the route is by driving.
 * @return {boolean}
 */

BingMapsManager.prototype.isDriving = function() {
  return !!document.getElementsByClassName('dirBtnDrive dirBtnSelected')[0];
};

/**
 * Checks if the route is by transit.
 * @return {boolean}
 */

BingMapsManager.prototype.isTransit = function() {
  return !!document.getElementsByClassName('dirBtnTransit dirBtnSelected')[0];
};

/**
 * Gets driving routes.
 * @return {string} routes
 */

BingMapsManager.prototype.getAllDrivingRoutes = function() {
  var drivingRoutes = [];
  if (this.isDriving()) {
    var r = this.validator.getByClass('drTitle');
    for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
      if (r[i].childNodes.length > 0) {
        drivingRoutes.push(r[i]);
      }
    }
  }
  return drivingRoutes;
};

/**
 * Gets transit routes.
 * @return {string} routes
 */

BingMapsManager.prototype.getAllTransitRoutes = function() {
  var transitRoutes = [];
  if (this.isTransit()) {
    var r = this.validator.getByClass('drTitle');
    for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
      if (r[i].childNodes.length > 0) {
        transitRoutes.push(r[i]);
      }
    }
  }
  return transitRoutes;
};

/**
 * Gets distance for a route.
 * @param {object} route
 * @return {string} distanceString
 */

BingMapsManager.prototype.getDistanceString = function(route) {
  var distanceString = this.validator
        .getByClass('drTitleRight', route)[0]
        .innerHTML;
  console.log('distanceString: ' + distanceString);
  this.validator.isString(distanceString);
  return distanceString;
};

/**
 * Gets time for transit route.
 * @param {object} route
 * @return {string} timeString
 */

BingMapsManager.prototype.getTimeString = function(route) {
  var timeString = this.validator
        .getByClass('drTitleRight', route)[0]
        .innerHTML;
  this.validator.isString(timeString);
  timeString = ' ' + timeString;
  console.log('timeString:' + timeString);
  return timeString;
};

/**
 * Converts Distance.
 * @param {string} distanceStr
 * @return {float} distanceFloat
 */

BingMapsManager.prototype.convertDistance = function(distanceStr) {
  if (distanceStr) {
    var distanceAndUnit = distanceStr.split(/ /);
    var distance = distanceAndUnit[0];
    var unit = distanceAndUnit[1];
    return this.footprintCore.getDistanceFromStrings(distance, unit);
  }
};

/**
 * Converts total time into hours.
 * @param {string} timeStr
 * @return {float} hrs
 */

BingMapsManager.prototype.convertTime = function(timeStr) {
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
    console.log(hrs);
    return hrs;
  }
};

/**
 * Inserts element where footprints will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

BingMapsManager.prototype.insertFootprintElement = function(route, e) {
  if (route.getElementsByClassName('carbon').length === 0) {
    this.validator.getByClass('drTitleRight', route)[0].appendChild(e);
  }
};

/**
 * Inserts element where travel cost will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

BingMapsManager.prototype.insertTravelCostElement = function(route, e) {
  if (route.getElementsByClassName('travelCost').length === 0) {
    this.validator.getByClass('drTitleRight', route)[0].appendChild(e);
  }
};

/**
 * called by MutationObeserver to update footprints
 */

BingMapsManager.prototype.update = function() {
  //var routes = this.getAllDrivingRoutes();
  var mainContent = document.getElementsByClassName("directionsPanel")[1];
  console.log(mainContent);
  var drivingRoutes = [], transitRoutes = [];
  if(mainContent){
    drivingRoutes = this.getAllDrivingRoutes();
    transitRoutes = this.getAllTransitRoutes();
  }
  for (var i = 0; i < drivingRoutes.length; i++) {
    var distanceString = this.getDistanceString(drivingRoutes[i]);
    var distanceInKm = this.convertDistance(distanceString);
    this.insertFootprintElement(
      drivingRoutes[i],
      this.footprintCore.createFootprintElement(distanceInKm)
    );
    if (this.settingsProvider.showTravelCost()) {
      this.insertTravelCostElement(
        drivingRoutes[i],
        this.footprintCore.createTravelCostElement(distanceInKm)
      );
    }
  }
  for (i = 0; i < transitRoutes.length; i++) {
    var timeString = this.getTimeString(transitRoutes[i]);
    var timeInHrs = this.convertTime(timeString);
    this.insertFootprintElement(
      transitRoutes[i],
      this.footprintCore.createPTFootprintElement(timeInHrs)
    );
  }
};

var MapManager = BingMapsManager;
