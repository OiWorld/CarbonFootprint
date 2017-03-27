/**
 * ViaMichelinMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

var ViaMichelinMapsManager = function(footprintCore, settingsProvider) {
 this.footprintCore = footprintCore;
 this.settingsProvider = settingsProvider;
 this.subtree = true;
 this.update();
};

/**
 * Converts distance string to distance in Km.
 * NOTE: ViaMichelin maps always gives distance in km
 * @return {string}
 */

ViaMichelinMapsManager.prototype.getDistanceString = function(d){
  return d.split(" ")[0];
};

/**
 * Gets All routes.
 * NOTE: ViaMichelin maps only has driving routes, no public transit routes
 * @return {array} routes
 */

ViaMichelinMapsManager.prototype.getAllRoutes = function(){
  var element = document.getElementsByClassName('itinerary-index-summary');
  if(element[0] && element[0].childNodes[0]){
    table = element[0].childNodes[0].childNodes[2];
  }
  else{
    table = false;
  }
  var routes = [];
  //console.log(table);
  if(table){
    for (var i = 0, row; row = table.rows[i]; i++) {
       for (var j = 0, col; col = row.cells[j]; j++) {
         var route = col.getElementsByTagName("p");
         routes.push({
           distance: route[0].innerHTML,
           time: route[1].innerHTML
         });
       }
    }
  }
  return routes;
};

/**
 * Inserts element where footprints will be displayed if not present
 * @param {array} routes
 */

ViaMichelinMapsManager.prototype.insertFootprintElement = function(routes){
  var el = document.getElementsByClassName('summary-header');
  console.log(el);
  if(el){
    for (var i = 0, t = el.length; i < t; i++) {
       var d = this.getDistanceString(routes[i].distance);
       if(el[i].childNodes.length < 3 &&
          el[i].childNodes[el[i].childNodes.length - 1].id !==
          "carbon-footprint-label"){
            el[i].appendChild(this.footprintCore.createFootprintElement(d));
       }
    }
  }
};

/**
 * Inserts element where travel cost will be displayed if not present
 * @param {array} routes
 */

ViaMichelinMapsManager.prototype.insertTravelCostElement = function(routes){
  var el = document.getElementsByClassName('summary-header');
  console.log(el);
  if(el){
    for (var i = 0, t = el.length; i < t; i++) {
         var d = this.getDistanceString(routes[i].distance);
         if(el[i].childNodes.length < 4 &&
            el[i].childNodes[el[i].childNodes.length - 1].id !== ""){
              el[i].appendChild(this.footprintCore.createTravelCostElement(d));
         }
    }
  }
};

/*
 * called by MutationObeserver to update footprints
 */

ViaMichelinMapsManager.prototype.update = function(){
  var routes = this.getAllRoutes();
  this.insertFootprintElement(routes);
  if (this.settingsProvider.showTravelCost()) {
    this.insertTravelCostElement(routes);
  }
};

var MapManager = ViaMichelinMapsManager;
