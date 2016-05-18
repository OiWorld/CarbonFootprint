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
    if (distanceStr) {
        var distance = distanceStr.match(/[0-9,.]+/)[0];
        var unit = distanceStr.match(/[a-z,A-Z]+/)[0];

        return this.footprintCore.getDistanceFromStrings(distance, unit);
    }
};

OpenMapsManager.prototype.insertFootprintElement = function(e) {
    if (document.getElementsByClassName('carbon').length == 0) { // In this case, "e" has not been added yet. We may proceed and add it.
        if(document.getElementById('routing_summary')) {
            document.getElementById('routing_summary').appendChild(e);
        }
    }
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

        this.insertFootprintElement(this.footprintCore.createFootprintElement(distanceInKm));
        if (this.settingsProvider.showTravelCost())
            this.insertTravelCostElement(this.footprintCore.createTravelCostElement(distanceInKm));

    }
};

var MapManager = OpenMapsManager;