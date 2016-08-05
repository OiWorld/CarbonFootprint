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
 * Gets driving routes.
 * @return {string} routes
 */

BingMapsManager.prototype.getAllDrivingRoutes = function() {
  var routes = [];
  if (this.isDriving()) {
    var r = document.getElementsByClassName('drTitle');
    for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
      if (r[i].childNodes.length > 0) {
        routes.push(r[i]);
      }
    }
  }
  return routes;
};

/**
 * Gets distance for a route.
 * @param {object} route
 * @return {string} distanceString
 */

BingMapsManager.prototype.getDistanceString = function(route) {
  var distanceString = route
        .getElementsByClassName('drTitleRight')[0]
        .innerHTML;
  console.log('distanceString: ' + distanceString);
  return distanceString;
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
 * Inserts element where footprints will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

BingMapsManager.prototype.insertFootprintElement = function(route, e) {
  if (route.getElementsByClassName('carbon').length === 0) {
    route.getElementsByClassName('drTitleRight')[0].appendChild(e);
  }
};

/**
 * Inserts element where travel cost will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

BingMapsManager.prototype.insertTravelCostElement = function(route, e) {
  if (route.getElementsByClassName('travelCost').length === 0) {
    route.getElementsByClassName('drTitleRight')[0].appendChild(e);
  }
};

/**
 * called by MutationObeserver to update footprints
 */

BingMapsManager.prototype.update = function() {
  var routes = this.getAllDrivingRoutes();
  for (var i = 0; i < routes.length; i++) {
    var distanceString = this.getDistanceString(routes[i]);
    var distanceInKm = this.convertDistance(distanceString);
    this.insertFootprintElement(
      routes[i],
      this.footprintCore.createFootprintElement(distanceInKm)
    );
    if (this.settingsProvider.showTravelCost()) {
      this.insertTravelCostElement(
        routes[i],
        this.footprintCore.createTravelCostElement(distanceInKm)
      );
    }
  }
};

var MapManager = BingMapsManager;
