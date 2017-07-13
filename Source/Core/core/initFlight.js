/**
 * Initialises the extension when flights webpage is open
 * @author vaibsharma (Vaibhav Sharma)
 */

var flightManager = new FlightManager();
var core = new FlightsFootprintCore();
var Inform = new inform();
var flightsInit = function(){
};

flightsInit.prototype.update = function(){
    var processedList = flightManager.getList();
    if(core.airplanesData && core.airportsData){
        processedList = flightManager.getCoordinates(processedList);
        processedList = flightManager.getDistances(processedList);
        processedList = flightManager.getEmission(processedList);
        flightManager.insertInDom(processedList);
    }
    console.log(processedList);
};

var serviceManager = new flightsInit();
var target = document.getElementsByTagName("body")[0],
    observer = new MutationObserver(function() {
        console.log('Observing!');
        Inform.permission(serviceManager);
    });

observer.observe(target, {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: flightManager.subtree
});
