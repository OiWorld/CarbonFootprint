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
 this.validator = new MapsValidator("viaMichelin");
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
    table = this.validator.getChildNode([0,2], element[0]);
  }
  else{
    table = false;
  }
  var routes = [];
  //console.log(table);
  if(table){
    for (var i = 0, row; row = table.rows[i]; i++) {
       for (var j = 0, col; col = row.cells[j]; j++) {
         var route = this.validator.getByTag("p", col);
         routes.push({
           distance: route[0].innerHTML,
         });
         this.validator.isString(route[0].innerHTML);
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
  var el = this.validator.getByClass('summary-header');
  console.log(el);
  if(el){
    for (var i = 0, t = el.length; i < t; i++) {
       var d = this.getDistanceString(routes[i].distance);
       this.validator.isNumber(parseFloat(d));
       if(el[i].getElementsByClassName('carbon').length === 0){
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
  var el = this.validator.getByClass('summary-header');
  console.log(el);
  if(el){
    for (var i = 0, t = el.length; i < t; i++) {
         var d = this.getDistanceString(routes[i].distance);
         if(el[i].getElementsByClassName('travelCost').length === 0){
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
  if(routes.length){
    this.insertFootprintElement(routes);
    if (this.settingsProvider.showTravelCost()) {
      this.insertTravelCostElement(routes);
    }
  }
};

var WebsiteManager = ViaMichelinMapsManager;
