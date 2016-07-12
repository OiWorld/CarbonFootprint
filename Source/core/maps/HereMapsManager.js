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
  //Append script as DOM to enable angularDebug
  //function updateRouteMode() to get mode through angular element scopr
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = 'window.here.features.angularDebug=true;' +
    'function updateRouteMode() {' +
    'var routes = document.getElementsByClassName("route_card");' +
    'for (var i = routes.length - 1; i >= 0; i--) {' +
    'var mode = angular.element(routes[i]).scope()' +
    '.route.mode.transportModes[0];' +
    'routes[i].setAttribute("data-mode",mode);' +
    ' } };';
  document.head.appendChild(script);
  //append a div to trigger updateRouteMode
  var e = document.createElement('div');
  e.id = 'updateModeTrigger';
  e.setAttribute('onclick', 'updateRouteMode()');
  document.getElementsByTagName('body')[0].appendChild(e);
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.update();
};

/**
 * Gets driving modes for all routes.
 * @param {object} route
 * @return {string} mode
 */

HereMapsManager.prototype.getMode = function(route) {
  var mode = route.getAttribute('data-mode');
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
 * Inserts element where footprints will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

HereMapsManager.prototype.insertFootprintElement = function(route, e, type) {
  if (route.getElementsByClassName('carbon').length === 0) {
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
 * Inserts element where travel cost will be displayed if not present
 * @param {object} route
 * @param {element} e
 */

HereMapsManager.prototype.insertTravelCostElement = function(route, e, type) {
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
  //execute after data is loaded
  setTimeout(function() {
    //trigger click for routeMode evaluation
    document.getElementById('updateModeTrigger').click();
    var routes = thisMap.getAllDrivingRoutes();
    for (var i = 0; i < routes.length; i++) {
      var distanceString = thisMap.getDistanceString(routes[i]);
        var distanceInKm = thisMap.convertDistance(distanceString);
      thisMap.insertFootprintElement(
        routes[i],
        thisMap.footprintCore.createFootprintElement(distanceInKm,'d'),
        'd'
      );
      if (thisMap.settingsProvider.showTravelCost())
        thisMap.insertTravelCostElement(
          routes[i],
          thisMap.footprintCore.createTravelCostElement(distanceInKm,'d'),
          'd'
        );
    }
  },1000);
};

var MapManager = HereMapsManager;
