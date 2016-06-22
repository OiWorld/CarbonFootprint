/**
 * common core file for all MapsManagers
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * CarbonFootprintCore namespace.
 * @constructor
 * @param {object} settingsProvider
 */

var CarbonFootprintCore = function(settingsProvider) {
  this.settingsProvider = settingsProvider;
  this.treeGrowthPerYear = 8300;
};

/**
 * 1 Imperial Gallon to Litres
 * @const
 */

CarbonFootprintCore.IMPGAL_TO_L = 4.54609;

/**
 * 1 US Gallon to Litres
 * @const
 */

CarbonFootprintCore.USGAL_TO_L = 3.785411784;

/**
 * 1 Mile to Kilometers
 * @const
 */

CarbonFootprintCore.MI_TO_KM = 1.609344;

/**
 * 1 Kilogram to Pounds
 * @const
 */

CarbonFootprintCore.KG_TO_LBS = 2.204622621848775;


/**
 * computes footprints based on route distance
 * @param {number} distance
 * @return {number} footprint
 */

CarbonFootprintCore.prototype.computeFootprint = function(distance) {
  var footprint = distance * this.settingsProvider.getCarbonEmission();
  return footprint;
};

/**
 * converts footprints to appropriate units
 * @param {number} footprint
 * @return {string}
 */

CarbonFootprintCore.prototype.footprintToString = function(footprint) {
  var carbonUnit = this.settingsProvider.getCarbonEmissionUnit();
  if (footprint < 1 && carbonUnit == 'kg') {
    footprint *= 1000;
    carbonUnit = 'g';
  }
  else if (carbonUnit == 'lbs') {
    footprint *= CarbonFootprintCore.KG_TO_LBS;
    if (footprint < 1) {
      footprint *= 16;
      carbonUnit = 'oz';
    }
  }
  var threshold = 100;
  if (footprint < threshold) {
    footprint = Math.round(footprint * 10) / 10;
  }
  else {
    footprint = Math.round(footprint);
  }
  console.log('Carbon Footprint for this route is: ' +
              footprint + carbonUnit + ' CO<sub>2</sub>');
  return '' + footprint + carbonUnit + ' CO<sub>2</sub>';
};

/**
 * computes trees that would be required to curb footprints
 * @param {number} carbonFootprint
 * @return {number} trees
 */

CarbonFootprintCore.prototype.computeTrees = function(carbonFootprint) {
  var trees = carbonFootprint / this.treeGrowthPerYear;
  trees = Math.round(trees);
  console.log('Trees: ' + trees);
  return trees;
};

/**
 * return an appropriate message based on trees required
 * @param {number} trees
 * @return {string}
 */

CarbonFootprintCore.prototype.treesToString = function(trees) {
  if (trees > 1) {
    return 'You will need ' + Math.round(trees) +
      ' tropical trees growing for 1 year to capture that much CO2!' +
      ' (or ' + Math.round(trees * 12) +
      ' trees growing for 1 month, or ' + Math.round(trees * 365) +
      ' trees growing for 1 day)';
  } else if (trees * 12 > 1) {
    return 'You will need ' + Math.round(trees * 12) +
      ' tropical trees growing for 1 month to capture that much CO2!' +
      ' (or ' + Math.round(trees * 365) +
      ' trees growing for 1 day)';
  } else if (trees * 365 > 1) {
    return 'You will need ' + Math.round(trees * 365) +
      ' tropical trees growing for 1 day to capture that much CO2!';
  }
};

/**
 * creates element where footprints will be displayed
 * @param {number} distance
 * @return {element} e
 */

CarbonFootprintCore.prototype.createFootprintElement = function(distance) {
  var footprint = this.computeFootprint(distance);
  var e = document.createElement('div');
  var treesStr = this.treesToString(this.computeTrees(footprint));
  var knowMoreUrl = chrome.extension.getURL('pages/knowMore.html');
  e.innerHTML = '<a href=' + knowMoreUrl + ' target=\'_blank\' title=\'' +
    treesStr + '\' class=\'carbon\' id=\'carbon\'>' +
    this.footprintToString(footprint) +
    '</a> <a class=\'know-more-link\' href=' + knowMoreUrl +
    ' target=\'_blank\' title=\'' + treesStr + '\'>Know More</a>';
  return e;
};

/**
 * computes travel cost on basis of route distance and fuel price
 * @param {number} distance
 * @return {number} travelCost
 */

CarbonFootprintCore.prototype.computeTravelCost = function(distance) {
  var travelCost = this.settingsProvider.getTravelRate() * distance;
  console.log('Travel cost for this route is: ' + travelCost);
  return travelCost;
};

/**
 * creates element where travel cost will be displayed
 * @param {number} distance
 * @return {element} e
 */

CarbonFootprintCore.prototype.createTravelCostElement = function(distance) {
  var e = document.createElement('div');
  var knowMoreUrl = chrome.extension.getURL('pages/knowMore.html');
  e.innerHTML = '<a href=http://goo.gl/yxdIs target=_blank' + ' ' +
    'class=travelCost id=travelCost> Cost $' +
    this.computeTravelCost(distance).toFixed(2).toString() + '</a>';
  return e;
};

/**
 * extracts distance from scraped data from webpage
 * @param {string} distance
 * @param {string} unit
 * @return {string} distance
 */

CarbonFootprintCore.prototype.getDistanceFromStrings =
  function(distance, unit) {
    var splitDistance = distance.split(/[.,]/);
    distance = '';
    var i = 0;
    if (splitDistance.length == 1) {
      distance = splitDistance[0];
    } else {
      // contains a decimal digit
      if (splitDistance[splitDistance.length - 1].length == 1) {
        for (i = 0; i < splitDistance.length - 1; i = i + 1) {
          distance = '' + distance + splitDistance[i];
        }
        distance += '.' + splitDistance[splitDistance.length - 1];
      } else {
        for (i = 0; i < splitDistance.length; i = i + 1) {
          distance = '' + distance + splitDistance[i];
        }
      }
    }
    // Distance given in meters.
    if (unit.match(/\bm\b/) || unit.match(/\s\u043C,/)) {
      distance /= 1000;
    } else if (unit.match(/\bmi\b/) || // Distance given in miles.
               unit.match(/\bMeile\/n\b/) ||
               unit.match(/\u043C\u0438\u043B/)) {
      distance *= CarbonFootprintCore.MI_TO_KM;
    } else if (unit.match(/\bft\b/) ||
               unit.match(/\bp\u00E9s\b/) ||
               unit.match(/\u0444\u0443\u0442/)) { // Distance given in feet.
      distance *= CarbonFootprintCore.MI_TO_KM / 5280;
    }
    console.log('The distance is: ' + ' kilometers');
    return distance;
  };
