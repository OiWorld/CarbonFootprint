/**
 * Created by Kolpa on 22.03.2016.
 */

var OpenMapsManager = function(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
};

OpenMapsManager.prototype.isDriving = function () {
    var m = document.getElementsByClassName('routing_engines');
    var selectedOption = m[1].options[m[1].selectedIndex].text;
    var mode = selectedOption.split(" ")[0].toLowerCase();
    console.log('Route mode: ' + mode);
    return mode == 'car';
};

OpenMapsManager.prototype.getDistanceString = function () {
    var routingSummary = document.getElementById('routing_summary');
    if(routingSummary) {
        var distanceString = routingSummary.innerHTML.split(":")[1].split(" ")[1]; // Using innerText instead of innerHTML results in strange errors.
        distanceString = distanceString.substring(0, distanceString.length - 1)
    }
    console.log('distanceString: ' + distanceString);
    return distanceString;
};

OpenMapsManager.prototype.convertDistance = function(distanceStr) {
    if (distanceStr){
        var distance = distanceStr.match(/[0-9,.]+/)[0];
        var unit = distanceStr.match(/[a-z,A-Z]+/)[0];

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
    }
};

OpenMapsManager.prototype.insertFootprintElement = function(e) {
    if (document.getElementsByClassName('carbon').length == 0) { // In this case, "e" has not been added yet. We may proceed and add it.
        if(document.getElementById('routing_summary')) {
            document.getElementById('routing_summary').appendChild(e);
        }
    }
};

OpenMapsManager.prototype.createFootprintElement = function (footprint, trees) {
    var e = document.createElement('div');
    var treesStr = this.footprintCore.treesToString(trees);
    e.innerHTML = '<a href=\'http://goo.gl/yxdIs\' target=\'_blank\' title=\'' +
        treesStr +
        '\' class=\'carbon\' id=\'carbon\'>' +
        this.footprintCore.footprintToString(footprint) +
        '</a> <a class=\'offset-link\' href=\'http://goo.gl/yxdIs\' target=\'_blank\' title=\'' +
        treesStr + '\'>offset</a>';
    return e;
};

OpenMapsManager.prototype.createTravelCostElement = function (travelCost) {
    var e = document.createElement('div');
    e.innerHTML = '<a href=http://goo.gl/yxdIs target=_blank class=travelCost id=travelCost> Cost $' + travelCost.toFixed(2).toString() + '</a>';
    return e;
};

OpenMapsManager.prototype.insertTravelCostElement = function(e) {
    //A check to ensure that the display travel cost checkbox is checked
    if (document.getElementsByClassName('travelCost').length == 0) { // In this case, "e" has not been added yet. We may proceed and add it.
        if (document.getElementById('routing_summary')){
            document.getElementById('routing_summary').appendChild(e);
        }
    }
};

OpenMapsManager.prototype.update = function() {

    if (this.isDriving()) {

        var distanceString = this.getDistanceString();
        var distanceInKm = this.convertDistance(distanceString);

        var carbonFootprint = this.footprintCore.computeFootprint(distanceInKm);
        var travelConst = this.footprintCore.computeTravelCost(distanceInKm);
        var trees = this.footprintCore.computeTrees(carbonFootprint);


        this.insertFootprintElement(this.createFootprintElement(carbonFootprint, trees));
        if (this.settingsProvider.showTravelCost())
            this.insertTravelCostElement(this.createTravelCostElement(travelConst))

    }
};

var MapManager = OpenMapsManager;