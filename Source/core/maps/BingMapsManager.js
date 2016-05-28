/**
 * Created by Kolpa on 22.03.2016.
 */

var BingMapsManager = function(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.update();
};

BingMapsManager.prototype.isDriving = function () {
    return !!document.getElementsByClassName('dirBtnDrive dirBtnSelected')[0];
};

BingMapsManager.prototype.getAllDrivingRoutes = function () {
    var routes = [];

    if (this.isDriving()) {
        // Get all non-transit driving routes suggested by Google Maps. widget-pane-section-directions-trip clearfix
        var r = document.getElementsByClassName('drTitle');
        for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
            if (r[i].childNodes.length > 0) {
                    routes.push(r[i]);
            }
        }
    }
    return routes;

};

BingMapsManager.prototype.getDistanceString = function (route) {
    var distanceString = route.getElementsByClassName('drTitleRight')[0].innerHTML; // Using innerText instead of innerHTML results in strange errors.
    console.log('distanceString: ' + distanceString);
    return distanceString;
};

BingMapsManager.prototype.convertDistance = function(distanceStr) {
    if (distanceStr) {
        var distanceAndUnit = distanceStr.split(/ /);
        var distance = distanceAndUnit[0];
        var unit = distanceAndUnit[1];

        return this.footprintCore.getDistanceFromStrings(distance, unit);
    }
};

BingMapsManager.prototype.insertFootprintElement = function(route, e) {
    if (route.getElementsByClassName('carbon').length == 0) { // In this case, "e" has not been added yet. We may proceed and add it.
        route.getElementsByClassName('drTitleRight')[0].appendChild(e);
    }
};

BingMapsManager.prototype.insertTravelCostElement = function(route, e) {
    //A check to ensure that the display travel cost checkbox is checked
    if (route.getElementsByClassName('travelCost').length == 0) { // In this case, "e" has not been added yet. We may proceed and add it.
        route.getElementsByClassName('drTitleRight')[0].appendChild(e);
    }
};

BingMapsManager.prototype.update = function() {
    var routes = this.getAllDrivingRoutes();

    for(var i=0; i < routes.length; i++) {
        var distanceString = this.getDistanceString(routes[i]);
        var distanceInKm = this.convertDistance(distanceString);

        this.insertFootprintElement(routes[i], this.footprintCore.createFootprintElement(distanceInKm));
        if (this.settingsProvider.showTravelCost())
            this.insertTravelCostElement(routes[i], this.footprintCore.createTravelCostElement(distanceInKm));
    }
};

var MapManager = BingMapsManager;