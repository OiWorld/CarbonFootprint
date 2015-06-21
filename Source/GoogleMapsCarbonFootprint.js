/*
 * Copyright (c) 2011 Bruno Woltzenlogel Paleo. All rights reserved.
 */

console.log("Script injected");

var treeGrowthPerYear = 8300 // in g of CO2 captured.
var carbonEmission = 217 // in grams of CO2 per km


var href = location.href;

console.log("Location: " + href);


if (href.match(/maps/gi)) {
  chrome.extension.sendRequest({carbonEmission : "Request Carbon Efficiency..."}, function(response) {
	//alert("got response from background: " + response);
    carbonEmission = response.carbonEmission;
     
    var observer = new MutationObserver(function(mutations) {
      updateFootprintInGoogleMaps();
    })
    var target = document.getElementsByTagName("body")[0];
    var config = { attributes: true, childList: true, characterData: true, subtree: true }
    observer.observe(target, config)
  });
}


function updateFootprintInGoogleMaps() {

  // Get all non-transit routes suggested by Google Maps.
  var routes = [];
  var r = document.getElementsByClassName("cards-directions-body cards-directions-non-transit cards-directions-animated");
  for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
    if (r[i].childNodes.length > 0) {
      routes.push(r[i]);
    }
  };
  //console.log(routes);

  // For each route, update footprint
  for (var i = routes.length - 1; i >= 0; i--) {
    console.log("update footprint for route " + i);
    updateFootprint(routes[i]);
  };

  
//  var carbon = document.getElementById("carbon")
//   if ((routes != null) && (carbon == null)) {
//     while (route.nodeName == "LI") {
//       var routeInfoDiv = route.getElementsByTagName("DIV")[1]
// //      alert(kmDiv.innerHTML)
//       addCarbonFootprint(routeInfoDiv);
//       route = route.nextSibling;
//     }
//   }
};



/*
 * Arguments:
 *   - route: div element containing all info about suggested route
 * Return:
 *   - the string containing the distance of the route.
 */
function getDistanceString(route) {
  var distanceString = route.getElementsByClassName("cards-directions-details cards-directions-distance")[0].childNodes[2].innerHTML; // Using innerText instead of innerHTML results in strange errors.
  console.log("distanceString: " + distanceString);
  return distanceString;
}

/*
 * Converts the distance string into a number.
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
  distance = "";
  var i=0;
  if (splitDistance.length == 1) {
    distance = splitDistance[0];
  }
  else {
    if (splitDistance[splitDistance.length-1].length == 1) { // contains a decimal digit
      for (i=0;i<splitDistance.length-1;i=i+1) {
        distance = "" + distance + splitDistance[i];
      } 
      distance = distance + "." + splitDistance[splitDistance.length-1];
    }    
    else {
      for (i=0;i<splitDistance.length;i=i+1) {
        distance = "" + distance + splitDistance[i];
      } 
    }
  }

  if (unit.match(/\bm\b/)  || unit.match(/\s\u043C,/)) { // Distance given in meters.
    distance = distance/1000; 
  }
  else if (unit.match(/\bmi\b/) || unit.match(/\bMeile\/n\b/) || unit.match(/\u043C\u0438\u043B/)) { // Distance given in miles.
    distance = distance * 1.609344; 
  } 
  else if (unit.match(/\bft\b/) || unit.match(/\bp\u00E9s\b/) || unit.match(/\u0444\u0443\u0442/)) { // Distance given in feet.
    distance = distance * 0.0003048;
  } 

  console.log("The distance is: " + distance + " kilometers")
  return distance;
}

/*
 Arguments:
   route: div element containing all info about suggested route
 */
function updateFootprint(route) {
  var distance = convertDistance(getDistanceString(route));

  var footprint = computeFootprint(distance);
  var trees = computeTrees(footprint);

  insertElement(route, createElement(footprint, trees));
}

function createElement(footprint, trees) {
  var e = document.createElement("div");
  var treesStr = treesToString(trees);
  e.innerHTML = " <a href='http://goo.gl/yxdIs' target='_blank' title='"+ 
                treesStr + 
                "' class='carbon' id='carbon'>" + 
                footprintToString(footprint) +
                "</a> <a class='offset-link' href='http://goo.gl/yxdIs' target='_blank' title='"+ 
                treesStr + "'>offset</a>"  
  return e;
}

/*
 * Inserts the footprint in the webpage.
 * Arguments:
 *   - route: div element of the route where footprint should be inserted
 *   - e: element that should be added
 */
function insertElement(route, e) {
  if (route.getElementsByClassName("carbon").length == 0) { // In this case, "e" has not been added yet. We may proceed and add it.
    route.getElementsByClassName("cards-directions-details cards-directions-distance")[0].appendChild(e);    
  }
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
  console.log("Carbon Footprint for this route is: " + footprint + " grams");
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
  var carbonUnit = " g CO<sub>2</sub>";
  if (footprint > 1000) {
    footprint = footprint/1000;
    carbonUnit = " kg CO<sub>2</sub>";
  }
  footprint = Math.round(footprint);
  return "" + footprint + carbonUnit;
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
  console.log("Trees: " + trees);
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
    return "You will need " + Math.round(trees) + 
                     " tropical trees growing for 1 year to capture that much CO2!" +
                     " (or "+ Math.round(trees*12) +
                     " trees growing for 1 month, or "+ Math.round(trees*365) +
                     " trees growing for 1 day)"      
  } 
  else if (trees*12 > 1) {
    return "You will need " + Math.round(trees*12) + 
                     " tropical trees growing for 1 month to capture that much CO2!" +
                     " (or "+ Math.round(trees*365) +
                     " trees growing for 1 day)"      
  } 
  else if (trees*365 > 1) {
    return "You will need "+ Math.round(trees*365) + 
                     " tropical trees growing for 1 day to capture that much CO2!" 
  }
}