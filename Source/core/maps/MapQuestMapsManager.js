/**
 * MapsManager for Map Quest
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * MapQuestMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

var MapQuestMapsManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  // click handler for angular route change
  var thisMap = this;
  var ul = document.getElementsByTagName('body')[0];
  ul.addEventListener('click', function(e) {
    if (e.target.parentNode.classList[1] ===
        'routes' && e.target.tagName === 'LI') {
      // Check if the element is a LI
      thisMap.update();
    }
  });
};

/**
 * Checks if the route is by driving.
 * @return {boolean}
 */

MapQuestMapsManager.prototype.isDriving = function() {
  var m = document.getElementsByClassName('transport-modes')[0];
  if (m) {
    var mode = m.classList[1].substring(0, 3);
    console.log('Route mode: ' + mode);
    return mode == 'car';
  }
  return false;
};

/**
 * Gets distance for a route.
 * @return {string} distanceString
 */

MapQuestMapsManager.prototype.getDistanceString = function () {
    var routingSummary = document.querySelector('.route-selection .distance');
    if(routingSummary) {
        var distanceString = routingSummary.innerText;
        console.log('distanceString: ' + distanceString);
        return distanceString;
    }
    console.error('no routingSummary found distanceString is 0');
    return 0;
};

/**
 * Converts Distance.
 * @param {string} distanceStr
 * @return {float} distanceFloat
 */

MapQuestMapsManager.prototype.convertDistance = function(distanceStr) {
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

MapQuestMapsManager.prototype.insertFootprintElement = function(e) {
  e.id = 'footprintDiv';
  if (document.getElementById('footprintDiv')) {
    var el = document.getElementById('footprintDiv');
    el.parentNode.removeChild(el);
  }
  var directionButton = document
        .querySelector('.route-selection .view-directions');
  e.setAttribute(
    'style',
    'padding:3px 15px;display:inline-block;position:relative;'
  );
  document.querySelector('.route-info-bar').insertBefore(e, directionButton);
};

/**
 * Inserts element where travel cost will be displayed if not present
 * @param {element} e
 */

MapQuestMapsManager.prototype.insertTravelCostElement = function(e) {
  e.id = 'travelCostDiv';
  if (document.getElementById('travelCostDiv')) {
    var el = document.getElementById('travelCostDiv');
    el.parentNode.removeChild(el);
  }
  var directionButton = document
        .querySelector('.route-selection .view-directions');
  e.setAttribute(
    'style',
    'padding:3px 15px;display:inline-block;position:relative;'
  );
  document.querySelector('.route-info-bar').insertBefore(e, directionButton);
};

/**
 * called by MutationObeserver to update footprints
 */

MapQuestMapsManager.prototype.update = function() {
  if (this.isDriving()) {
    var distanceString = this.getDistanceString();
    var distanceInKm = this.convertDistance(distanceString);
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

var MapManager = MapQuestMapsManager;
