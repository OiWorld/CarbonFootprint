/*
 * Copyright (c) 2011 Bruno Woltzenlogel Paleo. All rights reserved.
 */

console.log('Carbon Footprint Script Starting');

var treeGrowthPerYear = 8300; // in g of CO2 captured.
var carbonEmission = 217; // in grams of CO2 per km
var fuelCost = 2.4 // in %/L
var displayTravelCost = false; 
var averageMileage = 20; 

var href = location.href;

console.log('Location: ' + href);

if (href.match(/maps/gi)) {
  chrome.extension.sendRequest({carbonEmission: 'Request Carbon Efficiency...'}, function(response) {
      // alert("got response from background: " + response);
      carbonEmission = response.carbonEmission;

      //Checks if the travel cost needs to be displayed
      chrome.extension.sendRequest({displayTravelCost: '....'}, function(response) {
        displayTravelCost = (response.displayTravelCost === "true");

        //fetches the fuel cost and the average mileage
        if(displayTravelCost){
          chrome.extension.sendRequest({fuelCost: 'Request fuel cost...'}, function(response) {
            fuelCost = response.fuelCost;
          });

          chrome.extension.sendRequest({averageMileage: 'Request vehicle mileage...'}, function(response) {
            averageMileage = response.averageMileage;
          });
        }

    });

    var observer = new MutationObserver(function(mutations) {
      updateFootprintAndTravelCostInGoogleMaps();
    });

    var target = document.getElementsByTagName('body')[0];
    var config = {attributes: true, childList: true, characterData: true, subtree: true};
    observer.observe(target, config);
  });

}

/*
 * This function is called whenever
 * a change is observed in Google Maps. It is the main function.
 */
function updateFootprintAndTravelCostInGoogleMaps() {
  var routes = [];

  // Get all non-transit driving routes suggested by Google Maps. widget-pane-section-directions-trip clearfix
  var r = document.getElementsByClassName('widget-pane-section-directions-trip clearfix');
  for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
    if (r[i].childNodes.length > 0) {
      routes.push(r[i]);
    }
  };

  // For each route, insert footprint
  for (var i = routes.length - 1; i >= 0; i--) {
    console.log('update footprint for route ' + i);
    var travelMode = getMode(routes[i]);
    if (isDrive(travelMode)) {
      insertFootprint(routes[i]);
      insertTravelCost(routes[i]);
    }
  };
};

/*
 Arguments:
   route: DOM element containing all info about the route
          and where the footprint information should be inserted.
 */
function insertFootprint(route) {
  var distance = convertDistance(getDistanceString(route));

  var footprint = computeFootprint(distance);
  var trees = computeTrees(footprint);

  insertElement(route, createElement(footprint, trees));
}

/*
 Arguments:
   route: DOM element containing all info about the route
          and where the travel cost information should be inserted.
 */

function insertTravelCost(route){
  var distance = convertDistance(getDistanceString(route));
  // calculating travel cost 
  var travelCost = Math.floor(fuelCost) * (Math.floor(distance)/Math.floor(averageMileage));
  insertTravelCostElement(route, createTravelCostElement(travelCost));
}

/*
 * Creates the footprint element to be inserted in the webpage.
 *
 * Arguments:
 *   - footprint: amount of CO2 in grams
 *   - trees: amount of trees to offset the CO2 emission in one year of growth
 */
function createElement(footprint, trees) {
  var e = document.createElement('div');
  var treesStr = treesToString(trees);
  e.innerHTML = ' <a href=\'http://goo.gl/yxdIs\' target=\'_blank\' title=\'' +
                treesStr +
                '\' class=\'carbon\' id=\'carbon\'>' +
                footprintToString(footprint) +
                '</a> <a class=\'offset-link\' href=\'http://goo.gl/yxdIs\' target=\'_blank\' title=\'' +
                treesStr + '\'>offset</a>';
  return e;
}

/*
 * Creates the travel cost element to be inserted in the webpage.
 *
 * Arguments:
 *   - travel cost in $ (fixed to 2 decimal places)
 */

function createTravelCostElement(travelCost) {
  var e = document.createElement('div');
  e.innerHTML = '<a href=http://goo.gl/yxdIs target=_blank class=travelCost id=travelCost> Cost $' +
                travelCost.toFixed(2).toString(); +
                '</a>';
  return e;
}

/*
 * Inserts the footprint element in the webpage.
 * Arguments:
 *   - route: div element of the route where footprint should be inserted
 *   - e: element that should be added
 */
function insertElement(route, e) {
  if (route.getElementsByClassName('carbon').length == 0) { // In this case, "e" has not been added yet. We may proceed and add it.
    route.getElementsByClassName('widget-pane-section-directions-trip-distance widget-pane-section-directions-trip-secondary-text')[0].appendChild(e);
  }
}

/*
 * Inserts the travel cost element in the webpage.
 * Arguments:
 *   - route: div element of the route where the element should be inserted
 *   - e: element that should be added
 */

function insertTravelCostElement(route, e) {
  //A check to ensure that the display travel cost checkbox is checked 
  if (route.getElementsByClassName('travelCost').length == 0 && displayTravelCost) { // In this case, "e" has not been added yet. We may proceed and add it.
    route.getElementsByClassName('widget-pane-section-directions-trip-distance widget-pane-section-directions-trip-secondary-text')[0].appendChild(e);
  }
}

/*
 * This function is applicable only to non-transit routes.
 *
 * return:
 *   - One of the following strings:
 *     "drive"; "bike"; "walk"; "fly";
 */
function getMode(route) {
  var m = route.getElementsByClassName('widget-pane-section-directions-trip-travel-mode-icon');
  for (var i = m.length - 1; i >= 0; i--) {
    var style = m[i].parentElement.style;
    if (style.display != 'none') {
      var mode = m[i].classList[1];
      console.log('Route mode: ' + mode);
      return mode;
    }
  };
}

function isDrive(mode) { return mode == 'drive'; }
function isBike(mode) { return mode == 'bike' ; }
function isWalk(mode) { return mode == 'walk' ; }
function isFly(mode)  { return mode == 'fly' ; }

/*
 * Arguments:
 *   - route: div element containing all info about suggested route
 * Return:
 *   - the string containing the distance of the route.
 */
function getDistanceString(route) {
  var distanceString = route.getElementsByClassName('widget-pane-section-directions-trip-distance widget-pane-section-directions-trip-secondary-text')[0].childNodes[5].innerHTML; // Using innerText instead of innerHTML results in strange errors.
  console.log('distanceString: ' + distanceString);
  return distanceString;
}

/*
 * Converts the distance string into a number.
 *
 * Arguments:
 *   - distanceStr: the string containing the distance of the route.
 * Return:
 *   - the distance of the route, in kilometers.
 */
function convertDistance(distanceStr) {
  var distanceAndUnit = distanceStr.split(/ /);
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
}

/*
 * Computes the carbon footprint.
 * Arguments:
 *   - distance: the distance of the route.
 * Return:
 *   - the carbon footprint, in grams.
 */
function computeFootprint(distance) {
  var footprint = distance * carbonEmission;
  console.log('Carbon Footprint for this route is: ' + footprint + ' grams');
  return footprint;
}

/*
 * Converts the carbon footprint into a human-readable string.
 *
 * Arguments:
 *   - footprint: the amount of CO2.
 * Return:
 *   - a string with amount of CO2 and unit of measurement.
 */
function footprintToString(footprint) {
  var carbonUnit = ' g CO<sub>2</sub>';
  if (footprint > 1000) {
    footprint = footprint / 1000;
    carbonUnit = ' kg CO<sub>2</sub>';
  }
  footprint = Math.round(footprint);
  return '' + footprint + carbonUnit;
}

/*
 * Computes the number of trees necessary
 * for offsetting the Carbon Footprint
 * while growing for one year.
 *
 * Arguments:
 *   - carbonFootprint: the amount of CO2, in grams, to be offset.
 * Return:
 *   - the number of trees.
 */
function computeTrees(carbonFootprint) {
  var trees = carbonFootprint / treeGrowthPerYear;
  console.log('Trees: ' + trees);
  return trees;
}

/*
 * Converts the number of trees into a human-readable string.
 *
 * Arguments:
 *   - trees: the number of trees growing for one year.
 * Return:
 *   - a string.
 */
function treesToString(trees) {
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
}

console.log('Carbon Footprint Script Ending');



