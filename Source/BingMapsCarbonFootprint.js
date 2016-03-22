/**
 * Content script for Bing Maps
 *
 * Copyright (c) 2011 Bruno Woltzenlogel Paleo. All rights reserved.
 * @author me@chiragarora.com (Chriag Arora)
 */

/* jslint white: true */

/**
 * App namespace.
 * @type {object}
 */
var carbonFootprintCalc = {};


/**
 * Message logging function.
 * @param {string|object} msg
 */
carbonFootprintCalc.logMsg = function(msg) {
    console.log('Carbon Calc: ' + JSON.stringify(msg));
};


/**
 * Tree growth per year. in gram of CO2 captured.
 * @const
 */
carbonFootprintCalc.TREE_GROWTH_PER_YEAR = 8300;


/**
 * Carbon Emission in grams of CO2 per km.
 * @const
 */
carbonFootprintCalc.CARBON_EMISSION = 217;


/**
 * Travel Rate.
 * @const
 */
carbonFootprintCalc.TRAVEL_RATE = 0;


/**
 * Flag to enable display for travel cost.
 * @const
 */
carbonFootprintCalc.DISPLAY_TRAVEL_COST = false;


/**
 * Current URL of the page.
 * @const
 */
carbonFootprintCalc.CURRENT_URL = location.href;


/**
 * Maps Route container element.
 * @const
 */
carbonFootprintCalc.ROUTE_CONTAINER_ELEM = 'drTitle';


/**
 * Map Mode container element.
 * @const
 */
carbonFootprintCalc.MAP_MODE_CONTAINER_ELEM = 'dirBtnDrive dirBtnSelected';


/**
 * Distance container element.
 * @const
 */
carbonFootprintCalc.DISTANCE_CONTAINER_ELEM = 'drTitleRight';


/**
 * Carbon Footprint container element.
 * @const
 */
carbonFootprintCalc.CARBON_CONTAINER_ELEM = 'carbon';


/**
 * Travel container element.
 * @const
 */
carbonFootprintCalc.TRAVEL_COST_CONTAINER_ELEM = 'travelCost';


/**
 * Possible Travel Modes Enum.
 * @const {object}
 */
carbonFootprintCalc.TRAVEL_MODES = {
    'BIKE': 'bike',
    'DRIVE': 'drive',
    'WALK': 'walk',
    'FLY': 'fly'
};


/**
 * Returns all the elements for a class from the elem.
 * @param {string} className
 * @param {object} parent
 * @return {object} elem.
 */
carbonFootprintCalc.getElems = function(className, parent) {
  if (parent == undefined) {
    parent = document;
  }
  return parent.getElementsByClassName(className);
};


/**
 * Returns the first element for a class from the element.
 * @param {string} className
 * @param {object} parent
 * @return {object} elem.
 * @this {object} app namespace
 */
carbonFootprintCalc.getElem = function(className, parent) {
  return this.getElems(className, parent)[0];
};


/**
 * Returns the current travel mode.
 * @return {string} travel mode.
 * @this {object} app namespace
 */
carbonFootprintCalc.getTravelMode = function() {
  var mapModeContainer = this.getElem(this.MAP_MODE_CONTAINER_ELEM);
  if (mapModeContainer) {
    return this.TRAVEL_MODES.DRIVE;
  }
    return this.TRAVEL_MODES.WALK;
};


/**
 * Verify Travel modes.
 * @param {string} mode
 * @param {string} travelMode
 * @return {boolean}
 */
carbonFootprintCalc.verifyTravelMode = function(mode, travelMode) {
  return mode == travelMode;
};



/**
 * Converts the distance string into a integer.
 * @param {string} distanceStr
 * @return {float} distance in kilometers.
 */
carbonFootprintCalc.convertDistance = function(distanceStr) {
  var distanceAndUnit = distanceStr.split(/ /);
  var distance = distanceAndUnit[0];
  var unit = distanceAndUnit[1];

  var distance = parseFloat(distance.replace(/\,/g, ''));

  // Normalizing in kilometers
  if (unit.match(/\bm\b/) || unit.match(/\s\u043C,/)) {
    // Distance given in meters.
    distance = distance / 1000;
  } else if (
          unit.match(/\bmi\b/) ||
          unit.match(/\bMeile\/n\b/) ||
          unit.match(/\u043C\u0438\u043B/)) {
    // Distance given in miles.
    distance = distance * 1.609344;
  } else if (
          unit.match(/\bft\b/) ||
          unit.match(/\bp\u00E9s\b/) ||
          unit.match(/\u0444\u0443\u0442/)) {
    // Distance given in feet.
    distance = distance * 0.0003048;
  }

  return distance;
};


/**
 * Gets the distance from route.
 * @param {object} route element.
 * @return {float} distance.
 * @this {object} app namespace
 */
carbonFootprintCalc.getDistance = function(route) {
  // Using innerText instead of innerHTML results in strange errors.
  var distanceString = this.getElem(
      this.DISTANCE_CONTAINER_ELEM, route).innerHTML;
  return this.convertDistance(distanceString);
};



/**
 * Computes the carbon footprint for route.
 * @param {object} route
 * @return {float} carbon footprint
 * @this {object} app namespace
 */
carbonFootprintCalc.computeFootprint = function(route) {
  var distance = this.getDistance(route);
  this.logMsg('Distance for this route is: ' + distance + ' kms.');
  return distance * this.CARBON_EMISSION;
};



/**
 * Computes the number of trees necessary.
 * @param {float} carbonFootprint
 * @return {float} number of trees.
 * @this {object} app namespace
 */
carbonFootprintCalc.computeTrees = function(carbonFootprint) {
  return carbonFootprint / this.TREE_GROWTH_PER_YEAR;
};


/**
 * Converts the number of trees into a human-readable string.
 * @param {float} trees
 * @return {string}
 */
carbonFootprintCalc.treesToString = function(trees) {
  if (trees > 1) {
    return 'You will need ' + Math.round(trees) +
        ' tropical trees growing for 1 year to capture that much CO2!' +
        ' (or ' + Math.round(trees * 12) +
        ' trees growing for 1 month, or ' + Math.round(trees * 365) +
        ' trees growing for 1 day)';
  }
  if (trees * 12 > 1) {
    return 'You will need ' + Math.round(trees * 12) +
        ' tropical trees growing for 1 month to capture that much CO2!' +
        ' (or ' + Math.round(trees * 365) +
        ' trees growing for 1 day)';
  }
  return 'You will need ' + Math.round(trees * 365) +
      ' tropical trees growing for 1 day to capture that much CO2!';
};


/**
 * Converts the carbon footprint into a human-readable string.
 * @param {float} footprint
 * @return {string}
 */
carbonFootprintCalc.footprintToString = function(footprint) {
  var carbonUnit = ' g CO<sub>2</sub>';
  if (footprint > 1000) {
    footprint = footprint / 1000;
    carbonUnit = ' kg CO<sub>2</sub>';
  }
  footprint = Math.round(footprint);
  return '' + footprint + carbonUnit;
};


/**
 * Creates an element element to be inserted in the webpage.
 * @param {string} innerHTML
 * @return {object} element
 */
carbonFootprintCalc.createElement = function(innerHTML) {
  var elem = document.createElement('div');
  elem.innerHTML = innerHTML;
  return elem;
};


/**
 * Creates the footprint element to be inserted in the webpage.
 * @param {float} footprint
 * @param {int} trees
 * @return {object} element
 * @this {object} app namespace
 */
carbonFootprintCalc.createFootPrintElem = function(footprint, trees) {
  var treesStr = this.treesToString(trees);
  var footprintStr = this.footprintToString(footprint);
  var innerHTML = ' <a href="http://goo.gl/yxdIs" target="_blank" title="' +
      treesStr +
      '" class="carbon" id="carbon">' +
      footprintStr +
      '</a> <a class="offset-link" href="http://goo.gl/yxdIs' +
      '" target="_blank" title="' +
      treesStr + '">offset</a>';
  return this.createElement(innerHTML);
};


/**
 * Inserts the footprint element in the webpage.
 * @param {object} route
 * @param {float} footprint
 * @param {int} trees
 * @this {object} app namespace
 */
carbonFootprintCalc.insertFootPrintElem = function(route, footprint, trees) {
  if (this.getElems(this.CARBON_CONTAINER_ELEM, route).length == 0) {
    // In this case, element has not been added yet.
    this.getElem(this.DISTANCE_CONTAINER_ELEM, route).appendChild(
      this.createFootPrintElem(footprint, trees));
  }
};


/**
 * Creates the travel cost element to be inserted in the webpage.
 * @param {float} travelCost
 * @return {object} element
 * @this {object} app namespace
 */
carbonFootprintCalc.createTravelCostElem = function(travelCost) {
  var travelCostStr = travelCost.toFixed(2).toString();
  var innerHTML = '<a href="http://goo.gl/yxdIs" target="_blank"' +
      ' class="travelCost" id="travelCost"> Cost $' +
      travelCostStr + '</a>';
    this.logMsg(innerHTML);
  return this.createElement(innerHTML);
};


/**
 * Inserts the travel cost element in the webpage.
 * @param {object} route
 * @param {float} travelCost
 * @this {object} app namespace
 */
carbonFootprintCalc.insertTravelCostElem = function(route, travelCost) {
  if (this.getElems(this.TRAVEL_COST_CONTAINER_ELEM, route) == 0) {
    // In this case, element has not been added yet.
    this.getElem(this.DISTANCE_CONTAINER_ELEM, route).appendChild(
      this.createTravelCostElem(travelCost));
  }
};


/**
 * Inserts travel cost element.
 * @param {object} route
 * @this {object} app namespace
 */
carbonFootprintCalc.insertTravelCost = function(route) {
  var travelCost = TRAVEL_RATE * this.getDistance(route);
  this.insertTravelCostElement(route, travelCost);
};


/**
 * Inserts footprint data in route elem.
 * @param {object} route
 * @this {object} app namespace
 */
carbonFootprintCalc.insertFootprint = function(route) {
  var footprint = this.computeFootprint(route);
  this.logMsg('Carbon Footprint for this route is: ' + footprint + ' grams');

  var trees = this.computeTrees(footprint);
  this.logMsg('Trees: ' + trees);

  // Insert element into route
  this.insertFootPrintElem(route, footprint, trees);
};


/**
 * Updates each route with footprint data.
 * @param {object} elem
 * @this {object} app namespace
 */
carbonFootprintCalc.updateRouteElem = function(elem) {
  var travelMode = this.getTravelMode();
  if (this.verifyTravelMode(travelMode, this.TRAVEL_MODES.DRIVE)) {
    this.insertFootprint(elem);
    // Insert travel cost element
    if (this.DISPLAY_TRAVEL_COST) {
      this.insertTravelCost(elem);
    }
  }
};


/**
 * Returns filtered routes.
 * @return {array} filtered routes.
 * @this {object} app namespace
 */
carbonFootprintCalc.filteredRoutes = function() {
  var routes = [];

  // Get all non-transit driving routes suggested by Bing maps.
  var allRoutes = this.getElems(this.ROUTE_CONTAINER_ELEM);
  for (var i = allRoutes.length - 1; i >= 0; i--) {
    // Filtering spurious routes.
    if (allRoutes[i].childNodes.length > 0) {
      routes.push(allRoutes[i]);
    }
  }
  return routes;
};


/**
 * Updates all the routes.
 * @param {array} routes
 * @this {object} app namespace
 */
carbonFootprintCalc.updateRoutes = function(routes) {
  for (var i = routes.length - 1; i >= 0; i--) {
    this.logMsg('updating footprint for route ' + i);
    this.updateRouteElem(routes[i]);
  }
  if (routes.length) {
    // Preventing unnecessary logs.
    this.logMsg('Update for all routes completed.');
  }
};


/**
 * Callback to handle the changes in page.
 * @this {object} app namespace
 */
carbonFootprintCalc.updateFootprintInBingMaps = function() {
  this.logMsg('Map Changed, updating values!');
  this.updateRoutes(this.filteredRoutes());
};


/**
 * This handles the response from the background script.
 * @param {object} response
 * @this {object} app namespace
 */
carbonFootprintCalc.backgroundCallBackFunction = function(response) {
  // TODO: change these bindings once we update background.js
  this.TRAVEL_RATE = response.travelRate.value;
  this.DISPLAY_TRAVEL_COST = response.travelRate.displayTravelCost;
  this.CARBON_EMISSION = response.emissionRate.value;

  var observer = new MutationObserver(
      this.updateFootprintInBingMaps.bind(this));
  var target = document.getElementsByTagName('body')[0];
  var config = {
      attributes: true, childList: true, characterData: true, subtree: true};
  observer.observe(target, config);
};


/**
 * Init function
 * @this {object} app namespace
 */
carbonFootprintCalc.init = function() {
  this.logMsg('Carbon Footprint Script Starting');
  this.logMsg('Location: ' + this.CURRENT_URL);
  if (this.CURRENT_URL.indexOf('mapspreview') != -1) {
    chrome.runtime.sendMessage(
        {carbonEmission: 'Request Carbon Efficiency...'},
        this.backgroundCallBackFunction.bind(this)
    );
  }
}.bind(carbonFootprintCalc);

// Starting the script.
carbonFootprintCalc.init();
