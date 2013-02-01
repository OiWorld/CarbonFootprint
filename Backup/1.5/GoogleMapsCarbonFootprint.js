/*
 * Copyright (c) 2011 Bruno Woltzenlogel Paleo. All rights reserved.
 */


var carbonEmission = 217 // in grams of CO2 per km
chrome.extension.sendRequest({carbonEmission : "Request Carbon Efficiency..."}, function(response) {
  carbonEmission = response.carbonEmission;
  setInterval('checksDOM()',500)
});

var treeGrowthPerYear = 22000 // in g of CO2 captured.


function checksDOM() {
  var route = document.getElementById("altroute_0")
//  alert(route.innerHTML)
//  alert(route.innerText)
  var carbon = document.getElementById("carbon")
  if ((route != null) && (carbon == null)) {
    while (route.nodeName == "LI") {
      var kmDiv = route.getElementsByTagName("DIV")[1]
//      alert(kmDiv.innerHTML)
      addCarbonFootprint(kmDiv)
      route = route.nextSibling      
    }
  }
};

function addCarbonFootprint(kmDiv) {
  var content = kmDiv.innerHTML
//  alert(content)
  var distanceStr = content.split(/ /)[0]
//  alert(distanceStr)
  var distance = distanceStr.replace(/[^\d]/g, '') // Removes non-digits from distanceStr. 
//  alert(distance)
  if (distanceStr.match(/\d[.,]\d\b/)) {distance = distance/10} // Corrects the distance, in case the decimal separator was removed.
  if (content.match(/\bm\b/)  || content.match(/\s\u043C,/)) { // Distance given in meters.
//    alert("m")
    distance = distance/1000; 
  }
  else if (content.match(/\bmi\b/) || content.match(/\bMeile\/n\b/) || content.match(/\u043C\u0438\u043B/)) { // Distance given in miles.
//    alert("mile")
    distance = distance * 1.609344; 
  } 
  else if (content.match(/\bft\b/) || content.match(/\bp\u00E9s\b/) || content.match(/\u0444\u0443\u0442/)) { // Distance given in feet.
    distance = distance * 0.0003048;
  }
  
  var carbonFootprint = computeCarbonFootprint(distance)
  var carbonUnit = " g CO<sub>2</sub>"
  var treesGrowingInOneYear = computeTreesInOneYear(carbonFootprint)
  
  if (carbonFootprint > 1000) {
    carbonFootprint = carbonFootprint/1000
    carbonUnit = " kg CO<sub>2</sub>"
  }
  carbonFootprint = Math.round(carbonFootprint)
  
  var titleAttribute = ""
  if (treesGrowingInOneYear > 1) {
    titleAttribute = "You will need " + Math.round(treesGrowingInOneYear) + 
                     " tropical trees growing for 1 year to capture that much CO2!" +
                     " (or "+ Math.round(treesGrowingInOneYear*12) +
                     " trees growing for 1 month, or "+ Math.round(treesGrowingInOneYear*365) +
                     " trees growing for 1 day)"      
  } 
  else if (treesGrowingInOneYear*12 > 1) {
    titleAttribute = "You will need " + Math.round(treesGrowingInOneYear*12) + 
                     " tropical trees growing for 1 month to capture that much CO2!" +
                     " (or "+ Math.round(treesGrowingInOneYear*365) +
                     " trees growing for 1 day)"      
  } 
  else if (treesGrowingInOneYear*365 > 1) {
    titleAttribute = "You will need "+ Math.round(treesGrowingInOneYear*365) + 
                     " tropical trees growing for 1 day to capture that much CO2!" 
  }
  
  var spaces = "<br />"
  kmDiv.innerHTML = kmDiv.innerHTML + spaces +
      "<a href='http://goo.gl/yd5vh' target='_blank' title='"+ 
          titleAttribute + 
          "' class='carbon' id='carbon'>" + 
          carbonFootprint + carbonUnit + 
      "</a> <a class='offset-link' href='http://goo.gl/yd5vh' target='_blank' title='"+ 
          titleAttribute + "'>reduce now!</a>"  
}

function computeCarbonFootprint(distance) {
  return distance * carbonEmission
}

function computeTreesInOneYear(carbonFootprint) {
  return carbonFootprint / treeGrowthPerYear
}