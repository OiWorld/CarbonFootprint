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
 * @param {function} helper
 */

var CarbonFootprintCore = function(settingsProvider, helper) {
  this.settingsProvider = settingsProvider;
  this.helper = helper;
  this.treeGrowthPerYear = 8.3;
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
 * 'd' is default type
 * @param {number} data
 * @param {character} type
 * @return {number} footprint
 */

CarbonFootprintCore.prototype.computeFootprint = function(data, type) {
  var footprint;
  if (type == 't') {
    footprint = data * this.settingsProvider.getPTCarbonEmission();
  }
  else {
    footprint = data * this.settingsProvider.getCarbonEmission();
  }
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
  footprint = footprint.toPrecision(3);
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
  trees = Math.round(trees * 100) / 100;
  console.log('Trees: ' + trees);
  return trees;
};

/**
 * return a string for CH4,N2O,GHG Emissions
 * @param {number} distance
 * @return {string}
 */

CarbonFootprintCore.prototype.otherGasesString = function(distance) {
  if (this.settingsProvider.getGHGEmission() >= 0) {
    return 'CH₄: ' + (this.settingsProvider.getCH4Emission() * 1000 * distance)
      .toFixed(3) + 'g CO₂e,  ' + 'N₂O: ' +
      (this.settingsProvider.getN2OEmission() * 1000 * distance).toFixed(3) +
      'g CO₂e,  ' + 'GHG: ' + (this.settingsProvider.getGHGEmission() *
                 distance).toFixed(3) + 'kg CO₂e\n';
  }
  return '';
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
  } else {
    return 'Your Carbon Emission is almost nil. Great going!';
  }
};

/**
 * creates footprint using provided footprints
 * @param {number} footprint
 * @param {number} distance
 * @return {element} e
 */


CarbonFootprintCore.prototype.createHTMLElement =
  function(footprint, distance) {
    var e = document.createElement('div'),
        treesStr = this.treesToString(this.computeTrees(footprint)),
        otherGasStr = this.otherGasesString(distance),
        titleStr = otherGasStr + treesStr,
        knowMoreUrl = this.helper.getFilePath('pages/knowMore.html');

    console.log(titleStr);

    e.innerHTML = '<a href=' + knowMoreUrl + ' target=\'_blank\' title=\'' +
      titleStr + '\' class=\'carbon\' id=\'carbon\'>' +
      this.footprintToString(footprint) +
      '</a> <a class=\'know-more-link\' href=' + knowMoreUrl +
      ' target=\'_blank\' title=\'' + titleStr + '\'><img src="' + this.helper.getFilePath('images/quest_mark.jpg') + '" id="quest_mark_icon"></a>';
    e.onh;
    return e;
  };

/**
 * creates footprint element for driving mode
 * @param {number} distance
 * @return {element} element
 */

CarbonFootprintCore.prototype.createFootprintElement = function(distance) {
  var footprint = this.computeFootprint(distance, 'd');
  var element = this.createHTMLElement(footprint, distance);
  return element;
};

/**
 * creates footprint element for transit mode
 * @param {number} time
 * @return {element} element
 */

CarbonFootprintCore.prototype.createPTFootprintElement = function(time) {
  var footprint = this.computeFootprint(time, 't');
  var element = this.createHTMLElement(footprint);
  return element;
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
  e.innerHTML = '<div class=travelCost id=travelCost>' +
    this.computeTravelCost(distance).toFixed(2).toString() + ' ' +
    this.settingsProvider.getCurrency() + '</div>';
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
    console.log('The distance is: ' + distance + ' kilometers');
    return distance;
  };
