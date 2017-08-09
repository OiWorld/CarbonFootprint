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
  CarbonFootprintCommon.call(this);
  this.settingsProvider = settingsProvider;
  this.helper = helper;
};

CarbonFootprintCore.prototype = Object.create(CarbonFootprintCommon.prototype);
CarbonFootprintCore.prototype.constructor = CarbonFootprintCore;

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
 * average Carbon dioxide emission per sec per person
 * @const
 * reference : http://data.worldbank.org/indicator/EN.ATM.CO2E.PC
 */

CarbonFootprintCore.humansEmission = 0.0001519811393*3600;

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
 * Analogy of above function just difference in the
 * paramaters
 * @param {Array} data
 * @param {character} type
 * @return {number} footprint
 */

 CarbonFootprintCore.prototype.computeTransitFootprint = function(data, type) {
   var footprint;
   if (type == 't') {
    console.log(this.settingsProvider.getPTCarbonEmission());
    console.log(data[0]);
    console.log(data[1]);
     footprint = (data[0] * this.settingsProvider.getPTCarbonEmission())/60 +
      (data[1] * CarbonFootprintCore.humansEmission.toFixed(2)/60);
   }
   else {
     footprint = data * this.settingsProvider.getCarbonEmission();
   }
   console.log(footprint);
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
              footprint +' '+ carbonUnit + ' CO<sub>2</sub>');
  return '' + footprint +' '+ carbonUnit + ' CO<sub>2</sub>';
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
 * creates footprint using provided footprints
 * @param {number} footprint
 * @param {number} distance
 * @return {element} e
 */

CarbonFootprintCore.prototype.createHTMLElement =
  function(footprint, distance) {
    var e = document.createElement('div');
    console.log(footprint,distance);
    var treesStr = this.treesToString(this.computeTrees(footprint)),
        otherGasStr = this.otherGasesString(distance),
        titleStr = otherGasStr + treesStr,
        knowMoreUrl = this.helper.getFilePath('pages/knowMore.html');

    console.log(titleStr);
    e.setAttribute("id", "carbon-footprint-label");
    e.innerHTML = '<a href=' + knowMoreUrl + ' target=\'_blank\' title=\'' +
      titleStr + '\' class=\'carbon\' id=\'carbon\'>' +
      this.footprintToString(footprint) +
      // question mark icon using svg
      this.getSVG();
    e.querySelector('a').addEventListener('click', function(e) {
      e.stopPropagation();
    });
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
 * creates footprint element for transit mode with walking time
 * @param {Array} time
 * @return {element} element
 */

CarbonFootprintCore.prototype.createPTransitFootprintElement = function(data,type) {
  var footprint = this.computeTransitFootprint(data, 't');
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
    distance =  parseFloat( distance.replace( /,/g , '' ).replace( ' ', '' ));

    if (unit.match(/\bm\b/) || unit.match(/\s\u043C,/)) { // Distance given in meters.
      distance /= 1000;
    } else if (unit.match(/\bmi\b/) ||  // Source: http://www.indifferentlanguages.com/words/mile
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
