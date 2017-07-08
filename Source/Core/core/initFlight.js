var flightManager = new FlightManager();
var core = new FlightsFootprintCore();

/**
 * Function for Updating the DOM for flight websites
 */

var flightsUpdate = function(){
    var processedList = flightManager.getList();
    if(core.airplanesData && core.airportsData){
        processedList = flightManager.getCoordinates(processedList);
        processedList = flightManager.getDistances(processedList);
        processedList = flightManager.getEmission(processedList);
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
    childList: true,
    characterData: true,
    subtree: flightManager.subtree
});
