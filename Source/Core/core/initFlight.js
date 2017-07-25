var flightManager = new FlightManager();
var core = new FlightsFootprintCore();

var childList;
if(flightManager.childList !== undefined){
  childList = flightManager.childList;
}
else{
  childList = true;
}
/**
 * Function for Updating the DOM for flight websites
 */

var flightsUpdate = function(){
    var processedList = flightManager.getList();
    if(core.airplanesData && core.airportsData){
        processedList = flightManager.getEmission(
          flightManager.getDistances(
            flightManager.getCoordinates(processedList)));
        flightManager.insertInDom(processedList);
    }
    console.log(processedList);
};

/**
 * Structure to observe for changes
 */

var target = document.getElementsByTagName("body")[0],
    observer = new MutationObserver(function() {
        console.log('Observing!');
        flightsUpdate();
    });

/**
 * Setting the properties for mutation Observer
 */

observer.observe(target, {
  attributes: true,
  childList: childList,
  characterData: true,
  subtree: flightManager.subtree
});
