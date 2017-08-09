/**
 * MapsManager for Open Maps
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * OpenMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

var OpenMapsManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.validator = new MapsValidator("openmaps");
};

/**
 * Checks if the route is by driving.
 * @return {boolean}
 */

OpenMapsManager.prototype.isDriving = function() {
  var m = document.getElementsByClassName('routing_engines'),
      selectedOption = m[1].options[m[1].selectedIndex].text,
      mode = selectedOption.split(' ')[0].toLowerCase();
  console.log('Route mode: ' + mode);
  return mode == 'car';
};

/**
 * Gets distance for a route.
 * @return {string} distanceString
 */

OpenMapsManager.prototype.getDistanceString = function() {
  var distanceString,
      routingSummary = document.getElementById('routing_summary');
  if (routingSummary) {
    this.validator.isString(routingSummary.innerHTML);
    distanceString = routingSummary.innerHTML.split(':')[1].split(' ')[1];
    distanceString = distanceString.substring(0, distanceString.length - 1);
  }
  console.log('distanceString: ' + distanceString);
  return distanceString;
};

/**
 * Converts Distance.
 * @param {string} distanceStr
 * @return {float} distanceFloat
 */

OpenMapsManager.prototype.convertDistance = function(distanceStr) {
  if (distanceStr) {
    var distance = distanceStr.match(/[0-9,.]+/)[0];
    var unit = distanceStr.match(/[a-z,A-Z]+/)[0];
    var distanceFloat = this
          .footprintCore.getDistanceFromStrings(distance, unit);
    return distanceFloat;
  }
};

/**
 * Inserts element where footprints will be displayed if not present
 * @param {element} e
 */

OpenMapsManager.prototype.insertFootprintElement = function(e) {
  if (document.getElementsByClassName('carbon').length === 0) {
    document.getElementById('routing_summary').appendChild(e);
  }
};

/**
 * Inserts element where travel cost will be displayed if not present
 * @param {element} e
 */

OpenMapsManager.prototype.insertTravelCostElement = function(e) {
  //A check to ensure that the display travel cost checkbox is checked
  if (document.getElementsByClassName('travelCost').length === 0) {
    document.getElementById('routing_summary').appendChild(e);
  }
};

/**
 * called by MutationObeserver to update footprints
 */

OpenMapsManager.prototype.update = function() {
  if (this.isDriving() &&
      document.getElementById('routing_summary')) {
    var distanceString = this.getDistanceString();
    var distanceInKm = this.convertDistance(distanceString);
    this.validator.isNumber(distanceInKm);
    this.insertFootprintElement(
      this.footprintCore.createFootprintElement(distanceInKm)
    );
    if (this.settingsProvider.showTravelCost()) {
      this.insertTravelCostElement(
        this.footprintCore.createTravelCostElement(distanceInKm)
      );
    }
  }
};

var WebsiteManager = OpenMapsManager;
