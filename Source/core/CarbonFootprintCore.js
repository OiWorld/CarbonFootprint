/**
 * Created by Kolpa on 22.03.2016.
 * Contributed by PrateekGupta1509
 */

var CarbonFootprintCore = function(settingsProvider) {
    this.settingsProvider = settingsProvider;
    this.treeGrowthPerYear = 8300;
};

CarbonFootprintCore.prototype.computeFootprint = function(distance) {
    var footprint = distance * this.settingsProvider.getCarbonEmission();
    return footprint;
};

CarbonFootprintCore.prototype.footprintToString = function(footprint) {
    var carbonUnit = this.settingsProvider.getCarbonEmissionUnit();
    if (footprint > 1000 && carbonUnit =='g') {
        footprint = footprint / 1000;
        carbonUnit = 'kg';
    }
    else if (carbonUnit == 'lbs') {
        footprint = footprint * 0.00220462;  
    }
    footprint = Math.round(footprint);
    console.log('Carbon Footprint for this route is: ' + footprint + carbonUnit + ' CO<sub>2</sub>');
    return '' + footprint + carbonUnit + ' CO<sub>2</sub>';
};

CarbonFootprintCore.prototype.computeTrees = function(carbonFootprint) {
    var trees = carbonFootprint / this.treeGrowthPerYear;
    trees = Math.round(trees);
    console.log('Trees: ' + trees);
    return trees;
};

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

CarbonFootprintCore.prototype.createFootprintElement = function (distance) {
    var footprint = this.computeFootprint(distance);

    var e = document.createElement('div');

    var treesStr = this.treesToString(this.computeTrees(footprint));
    var knowMoreUrl = chrome.extension.getURL("pages/knowMore.html");

    e.innerHTML = '<a href=' + knowMoreUrl + ' target=\'_blank\' title=\'' +
        treesStr +
        '\' class=\'carbon\' id=\'carbon\'>' +
        this.footprintToString(footprint) +
        '</a> <a class=\'know-more-link\' href=' + knowMoreUrl + ' target=\'_blank\' title=\'' +
        treesStr + '\'>Know More</a>';

    return e;
};

CarbonFootprintCore.prototype.computeTravelCost = function (distance) {
    var travelCost = this.settingsProvider.getTravelRate() * distance;
    console.log('Travel cost for this route is: ' + travelCost );
    return travelCost;
};

CarbonFootprintCore.prototype.createTravelCostElement = function (distance) {
    var e = document.createElement('div');
    var knowMoreUrl = chrome.extension.getURL("pages/knowMore.html");

    e.innerHTML = '<a href=' + knowMoreUrl + ' target=_blank class=travelCost id=travelCost> Cost $' + this.computeTravelCost(distance).toFixed(2).toString() + '</a>';
    return e;
};

CarbonFootprintCore.prototype.getDistanceFromStrings = function(distance, unit) {
    var splitDistance = distance.split(/[.,]/);
    distance = '';
    var i = 0;
    if (splitDistance.length == 1) {
        distance = splitDistance[0];
    } else {
        if (splitDistance[splitDistance.length - 1].length == 1) { // contains a decimal digit
            for (i = 0; i < splitDistance.length - 1; i = i + 1) {
                distance = '' + distance + splitDistance[i];
            }
            distance = distance + '.' + splitDistance[splitDistance.length - 1];
        } else {
            for (i = 0; i < splitDistance.length; i = i + 1) {
                distance = '' + distance + splitDistance[i];
            }
        }
    }

    if (unit.match(/\bm\b/)  || unit.match(/\s\u043C,/)) { // Distance given in meters.
        distance = distance / 1000;
    } else if (unit.match(/\bmi\b/) || unit.match(/\bMeile\/n\b/) || unit.match(/\u043C\u0438\u043B/)) { // Distance given in miles.
        distance = distance * 1.609344;
    } else if (unit.match(/\bft\b/) || unit.match(/\bp\u00E9s\b/) || unit.match(/\u0444\u0443\u0442/)) { // Distance given in feet.
        distance = distance * 0.0003048;
    }

    console.log('The distance is: ' + distance + ' kilometers');
    return distance;
};
