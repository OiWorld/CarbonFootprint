/**
 * Created by Kolpa on 22.03.2016.
 */

var CarbonFootprintCore = function(settingsProvider) {
    this.settingsProvider = settingsProvider;
    this.treeGrowthPerYear = 8300;
};

CarbonFootprintCore.prototype.computeFootprint = function(distance) {
    var footprint = distance * this.settingsProvider.getCarbonEmission();
    console.log('Carbon Footprint for this route is: ' + footprint + ' grams');
    return footprint;
};

CarbonFootprintCore.prototype.footprintToString = function(footprint) {
    var carbonUnit = ' g CO<sub>2</sub>';
    if (footprint > 1000) {
        footprint = footprint / 1000;
        carbonUnit = ' kg CO<sub>2</sub>';
    }
    footprint = Math.round(footprint);
    return '' + footprint + carbonUnit;
};

CarbonFootprintCore.prototype.computeTrees = function(carbonFootprint) {
    var trees = carbonFootprint / this.treeGrowthPerYear;
    console.log('Trees: ' + trees);
    return trees;
};

CarbonFootprintCore.prototype.createFootprintElement = function (distance) {
    var footprint = this.computeFootprint(distance);

    var e = document.createElement('div');

    var treesStr = this.treesToString(this.computeTrees(footprint));

    e.innerHTML = '<a href=\'http://goo.gl/yxdIs\' target=\'_blank\' title=\'' +
        treesStr +
        '\' class=\'carbon\' id=\'carbon\'>' +
        this.footprintToString(footprint) +
        '</a> <a class=\'offset-link\' href=\'http://goo.gl/yxdIs\' target=\'_blank\' title=\'' +
        treesStr + '\'>offset</a>';

    return e;
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

CarbonFootprintCore.prototype.computeTravelCost = function (distance) {
    var travelCost = this.settingsProvider.getTravelRate() * distance;
    console.log('Travel cost for this route is: ' + travelCost + ' grams');
    return travelCost;
};
<<<<<<< HEAD

CarbonFootprintCore.prototype.createTravelCostElement = function (distance) {
    var e = document.createElement('div');
    e.innerHTML = '<a href=http://goo.gl/yxdIs target=_blank class=travelCost id=travelCost> Cost $' + this.computeTravelCost(distance).toFixed(2).toString() + '</a>';
    return e;
};
=======
>>>>>>> refs/remotes/origin/rewrite
