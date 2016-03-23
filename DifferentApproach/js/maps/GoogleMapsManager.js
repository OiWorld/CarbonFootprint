/**
 * Created by Kolpa on 22.03.2016.
 */

var GoogleMapsManager = function(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
};

GoogleMapsManager.prototype.getMode = function (route) {
    var m = route.getElementsByClassName('widget-pane-section-directions-trip-travel-mode-icon');
    for (var i = m.length - 1; i >= 0; i--) {
        var style = m[i].parentElement.style;
        if (style.display != 'none') {
            var mode = m[i].classList[1];
            console.log('Route mode: ' + mode);
            return mode;
        }
    }
};

GoogleMapsManager.prototype.getAllDrivingRoutes = function () {
    var routes = [];

    // Get all non-transit driving routes suggested by Google Maps. widget-pane-section-directions-trip clearfix
    var r = document.getElementsByClassName('widget-pane-section-directions-trip clearfix');
    for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
        if (r[i].childNodes.length > 0) {
            if (this.getMode(r[i]) == "drive") {
                routes.push(r[i]);
            }
        }
    }

    return routes;
};

GoogleMapsManager.prototype.getDistanceString = function (route) {
    var distanceString = route.getElementsByClassName('widget-pane-section-directions-trip-distance widget-pane-section-directions-trip-secondary-text')[0].childNodes[5].innerHTML; // Using innerText instead of innerHTML results in strange errors.
    console.log('distanceString: ' + distanceString);
    return distanceString;
};

GoogleMapsManager.prototype.convertDistance = function(distanceStr) {
    var distanceAndUnit = distanceStr.replace('&nbsp;', ' ').split(/ /);
    var distance = distanceAndUnit[0];
    var unit = distanceAndUnit[1];

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

GoogleMapsManager.prototype.insertFootprintElement = function(route, e) {
    if (route.getElementsByClassName('carbon').length == 0) { // In this case, "e" has not been added yet. We may proceed and add it.
        route.getElementsByClassName('widget-pane-section-directions-trip-distance widget-pane-section-directions-trip-secondary-text')[0].appendChild(e);
    }
};

GoogleMapsManager.prototype.createFootprintElement = function (footprint, trees) {
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

GoogleMapsManager.prototype.createTravelCostElement = function (travelCost) {
    var e = document.createElement('div');
    e.innerHTML = '<a href=http://goo.gl/yxdIs target=_blank class=travelCost id=travelCost> Cost $' + travelCost.toFixed(2).toString() + '</a>';
    return e;
};

GoogleMapsManager.prototype.insertTravelCostElement = function(route, e) {
    //A check to ensure that the display travel cost checkbox is checked
    if (route.getElementsByClassName('travelCost').length == 0) { // In this case, "e" has not been added yet. We may proceed and add it.
        route.getElementsByClassName('widget-pane-section-directions-trip-distance widget-pane-section-directions-trip-secondary-text')[0].appendChild(e);
    }
};

GoogleMapsManager.prototype.update = function() {
    var routes = this.getAllDrivingRoutes();

    for(var i=0; i < routes.length; i++) {
        var distanceString = this.getDistanceString(routes[i]);
        var distanceInKm = this.convertDistance(distanceString);

        var carbonFootprint = this.footprintCore.computeFootprint(distanceInKm);
        var travelConst = this.footprintCore.computeTravelCost(distanceInKm);
        var trees = this.footprintCore.computeTrees(carbonFootprint);


        this.insertFootprintElement(routes[i], this.createFootprintElement(carbonFootprint, trees));
        if (this.settingsProvider.showTravelCost())
            this.insertTravelCostElement(routes[i], this.createTravelCostElement(travelConst))
    }
};

GoogleMapsManager.prototype.init = function() {
    var self = this;

    var observer = new MutationObserver(function() {
        self.update();
    });

    var target = document.getElementsByTagName('body')[0];
    observer.observe(target, {attributes: true, childList: true, characterData: true, subtree: true});
};

var MapManager = GoogleMapsManager;