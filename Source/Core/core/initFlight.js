var flightManager = new FlightManager();
var core = new FlightsFootprintCore();
var target = document.getElementsByTagName("body")[0],
    observer = new MutationObserver(function() {
      console.log('Observing!');
      flightManager.update();
    });
observer.observe(target, {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: flightManager.subtree
});
