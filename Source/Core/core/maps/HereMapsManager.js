/**
 * MapsManager for Here Maps
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * HereMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

var HereMapsManager = function(footprintCore, settingsProvider) {
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

HereMapsManager.prototype.getMode = function(route) {
  // var mode = route.getAttribute('data-mode');
  if (!route.classList[1])
    return 'pt';
  var mode = route.classList[1].match(/route_card_(.*)/)[1];
  console.log('Route mode: ' + mode);
  return mode;
};

/**
 * Gets driving routes.
 * @return {string} routes
 */

HereMapsManager.prototype.getAllDrivingRoutes = function() {
  var routes = [];
  // Get all non-transit driving routes suggested by Here Maps. route_card
  var r = document.getElementsByClassName('route_card');
  for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
    if (this.getMode(r[i]) == 'car') {
      routes.push(r[i]);
    }
  }
  console.log(routes);
  return routes;
};

/**
 * Gets transit routes.
 * @return {string} routes
 */

HereMapsManager.prototype.getAllTransitRoutes = function() {
  var routes = [];
  // Get all transit driving routes suggested by Here Maps. route_card
  var r = document.getElementsByClassName('route_card');
  for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
    if (this.getMode(r[i]) == 'pt') {
      routes.push(r[i]);
    }
  }
  console.log(routes);
  return routes;
};

/**
 * Gets distance for a route.
 * @param {object} route
 * @return {string} distanceString
 */

HereMapsManager.prototype.getDistanceString = function(route) {
  var distanceString = route.getElementsByClassName('distance')[0].innerHTML;
  console.log('distanceString: ' + distanceString);
  return distanceString;
};

/**
 * Gets time for transit route.
 * @param {object} route
 * @return {string} timeString
 */

HereMapsManager.prototype.getTimeString = function(route) {
  var timeString = route.getElementsByClassName('duration')[0].textContent;
  timeString = ' ' + timeString;
  console.log('timeString:' + timeString);
  return timeString;
};

/**
 * Converts Distance.
 * @param {string} distanceStr
 * @return {float} distanceFloat
 */

HereMapsManager.prototype.convertDistance = function(distanceStr) {
  if (distanceStr) {
    var distanceAndUnit = distanceStr.replace('&nbsp;', ' ').split(/ /);
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

HereMapsManager.prototype.convertTime = function(timeStr) {
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
 */

HereMapsManager.prototype.insertFootprintElement = function(route, e) {
  if (route.getElementsByClassName('carbon').length === 0) {
    e.setAttribute(
      'style',
      'font-size:14px; padding-bottom: 0;'
    );
    route
      .getElementsByClassName('route_card_right')[0]
      .appendChild(e);
}
};

/**
 * Inserts element where travel cost will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

HereMapsManager.prototype.insertTravelCostElement = function(route, e) {
  //A check to ensure that the display travel cost checkbox is checked
  if (route.getElementsByClassName('travelCost').length === 0) {
    e.setAttribute(
      'style',
      'padding-right:15px;display:inline-block;position:relative;top:-15px;'
    );
    route
      .getElementsByClassName('route_card_footer_container')[0]
      .appendChild(e);
  }
};

/**
 * called by MutationObeserver to update footprints
 */

HereMapsManager.prototype.update = function() {
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
  var transitRoutes = thisMap.getAllTransitRoutes();
  for (i = 0; i < transitRoutes.length; i++) {
    var timeString = this.getTimeString(transitRoutes[i]);
    var timeInHrs = ' ' + this.convertTime(timeString);
    thisMap.insertFootprintElement(
      transitRoutes[i],
      this.footprintCore.createPTFootprintElement(timeInHrs)
    );
  }
};

var MapManager = HereMapsManager;
