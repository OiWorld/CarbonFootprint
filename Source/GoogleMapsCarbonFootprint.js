/*
 * Copyright (c) 2011 Bruno Woltzenlogel Paleo. All rights reserved.
 */

var treeGrowthPerYear = 22000 // in g of CO2 captured.
var carbonEmission = 217 // in grams of CO2 per km


var host = window.location.host;
if (host.match(/maps[.]google/gi)) {
  //alert("request from background");
  chrome.extension.sendRequest({carbonEmission : "Request Carbon Efficiency..."}, function(response) {
	//alert("got response from background: " + response);
    carbonEmission = response.carbonEmission;
    setInterval('checksDOM()',500);
  });
}


function checksDOM() {
  var route = document.getElementById("altroute_0")
//  alert(route.innerHTML)
//  alert(route.innerText)
  var carbon = document.getElementById("carbon")
  if ((route != null) && (carbon == null)) {
    while (route.nodeName == "LI") {
      var routeInfoDiv = route.getElementsByTagName("DIV")[1]
//      alert(kmDiv.innerHTML)
      addCarbonFootprint(routeInfoDiv)
      route = route.nextSibling      
    }
  }
};

function getDistanceString(routeInfoDiv) {
  return routeInfoDiv.getElementsByTagName("SPAN")[0].innerHTML
}


function computeDistance(distanceStr) {
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
  return distance;
}


function addCarbonFootprint(routeInfoDiv) {
  var distanceStr = getDistanceString(routeInfoDiv);
  //alert(distanceStr)
  var distance = computeDistance(distanceStr);
  //alert(distance)
  var carbonFootprint = computeCarbonFootprint(distance);
  //alert(carbonFootprint);
  var trees = computeTrees(carbonFootprint);
  //alert(trees);  
  routeInfoDiv.innerHTML = routeInfoDiv.innerHTML + "<br />" +
      "<a href='http://goo.gl/yxdIs' target='_blank' title='"+ 
          trees + 
          "' class='carbon' id='carbon'>" + 
          carbonFootprintToString(carbonFootprint) +
      "</a> <a class='offset-link' href='http://goo.gl/yxdIs' target='_blank' title='"+ 
          trees + "'>plant trees!</a>"  
}

function computeCarbonFootprint(distance) {
  return distance * carbonEmission
}

function carbonFootprintToString(carbonFootprint) {
  var carbonUnit = " g CO<sub>2</sub>"
  if (carbonFootprint > 1000) {
    carbonFootprint = carbonFootprint/1000
    carbonUnit = " kg CO<sub>2</sub>"
  }
  carbonFootprint = Math.round(carbonFootprint)
  return "" + carbonFootprint + carbonUnit
}

function computeTrees(carbonFootprint) {
  var treesGrowingInOneYear = carbonFootprint / treeGrowthPerYear

  if (treesGrowingInOneYear > 1) {
    return "You will need " + Math.round(treesGrowingInOneYear) + 
                     " tropical trees growing for 1 year to capture that much CO2!" +
                     " (or "+ Math.round(treesGrowingInOneYear*12) +
                     " trees growing for 1 month, or "+ Math.round(treesGrowingInOneYear*365) +
                     " trees growing for 1 day)"      
  } 
  else if (treesGrowingInOneYear*12 > 1) {
    return "You will need " + Math.round(treesGrowingInOneYear*12) + 
                     " tropical trees growing for 1 month to capture that much CO2!" +
                     " (or "+ Math.round(treesGrowingInOneYear*365) +
                     " trees growing for 1 day)"      
  } 
  else if (treesGrowingInOneYear*365 > 1) {
    return "You will need "+ Math.round(treesGrowingInOneYear*365) + 
                     " tropical trees growing for 1 day to capture that much CO2!" 
  }
}