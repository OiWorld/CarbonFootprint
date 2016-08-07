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
 * Gets driving routes.
 * @return {string} routes
 */

GoogleMapsManager.prototype.getAllDrivingRoutes = function() {
  var routes = [];
  var r = document.getElementsByClassName(
    'widget-pane-section-directions-trip clearfix');
  for (var i = r.length - 1; i >= 0; i--) {
    if (r[i].childNodes.length > 0) {
      if (this.getMode(r[i]) == 'drive') {
        routes.push(r[i]);
      }
    }
  }
  return routes;
};

/**
 * Classes that contain distance and where results are displayed
 */

GoogleMapsManager.prototype.infoClasses = [
  'widget-pane-section-directions-trip-distance',
  'widget-pane-section-directions-trip-secondary-text'
];

/**
 * Gets distance for a route.
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
 * Inserts element where footprints will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

GoogleMapsManager.prototype.insertFootprintElement = function(route, e) {
  if (route.getElementsByClassName('carbon').length === 0) {
    route
      .getElementsByClassName(this.infoClasses[0] + ' ' +
                              this.infoClasses[1])[0]
      .appendChild(e);
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
      .getElementsByClassName(this.infoClasses[0] + ' ' +
                              this.infoClasses[1])[0]
      .appendChild(e);
  }
};

/**
 * called by MutationObeserver to update footprints
 */

GoogleMapsManager.prototype.update = function() {
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

var MapManager = GoogleMapsManager;
