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
 * 1 Foot to Kilometers
 * @const
 */

 CarbonFootprintCore.FT_TO_KM = 0.0003048;

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
  if (this.settingsProvider.getGHGEmission() >= 0 && !isNaN(distance)) {
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
    e.setAttribute("id", "carbon-footprint-label");
    e.innerHTML = '<a href=' + knowMoreUrl + ' target=\'_blank\' title=\'' +
      titleStr + '\' class=\'carbon\' id=\'carbon\'>' +
      this.footprintToString(footprint) +
      // question mark icon using svg
      '<svg id="quest_mark_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92"><path d="M45.4 0C20 0.3-0.3 21.2 0 46.6c0.3 25.4 21.2 45.7 46.6 45.4 25.4-0.3 45.7-21.2 45.4-46.6C91.7 20 70.8-0.3 45.4 0zM45.3 74l-0.3 0c-3.9-0.1-6.7-3-6.6-6.9 0.1-3.8 2.9-6.5 6.7-6.5l0.2 0c4 0.1 6.7 3 6.6 6.9C51.9 71.3 49.1 74 45.3 74zM61.7 41.3c-0.9 1.3-2.9 2.9-5.5 4.9l-2.8 1.9c-1.5 1.2-2.5 2.3-2.8 3.4 -0.3 0.9-0.4 1.1-0.4 2.9l0 0.5H39.4l0-0.9c0.1-3.7 0.2-5.9 1.8-7.7 2.4-2.8 7.8-6.3 8-6.4 0.8-0.6 1.4-1.2 1.9-1.9 1.1-1.6 1.6-2.8 1.6-4 0-1.7-0.5-3.2-1.5-4.6 -0.9-1.3-2.7-2-5.3-2 -2.6 0-4.3 0.8-5.4 2.5 -1.1 1.7-1.6 3.5-1.6 5.4v0.5H27.9l0-0.5c0.3-6.8 2.7-11.6 7.2-14.5C37.9 18.9 41.4 18 45.5 18c5.3 0 9.9 1.3 13.4 3.9 3.6 2.6 5.4 6.5 5.4 11.6C64.4 36.3 63.5 38.9 61.7 41.3z" /></svg>';
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

    distance = distance.trim();
    var lastIndex = distance.lastIndexOf(",");
    var i = distance.length - lastIndex;
    if(i <= 3){
      distance = distance.substr(0, lastIndex) + '.' + distance.substr(lastIndex + 1);
    }
    distance =  parseFloat( distance.replace( /,/g , '' ).replace( ' ', '' ))

    if (unit.match(/\bm\b/) || unit.match(/\s\u043C,/)) { // Distance given in meters.
      distance /= 1000;
    } else if (unit.match(/\bmi\b/) ||
               unit.match(/\bMeile(n?)\b/) ||
               unit.match(/\bmil/) ||
               unit.match(/\bm\u00ed/)||
               unit.match(/\bmaili(a?)/)||
               unit.match(/\bmylia/)||
               unit.match(/\bmigli(o|a)/)||
               unit.match(/\bmérföld/)||
               unit.match(/\bjūdze(s?)/)||
               unit.match(/\bμίλι/)||
               unit.match(/\bмілі/)||
               unit.match(/\bmi(j|i)l/)||
               unit.match(/\u043C\u0438\u043B/)) {  // Distance given in miles.
      distance *= CarbonFootprintCore.MI_TO_KM;
    } else if (unit.match(/\bft\b/) ||
               unit.match(/\bp\u00E9s\b/) ||
               unit.match(/\u0444\u0443\u0442/)) {  // Distance given in feet.
      distance *= CarbonFootprintCore.FT_TO_KM;
    }
    console.log('The distance is: ' + distance + ' kilometers');
    return distance;
  };
