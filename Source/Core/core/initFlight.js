var flightManager = new FlightManager();
var core = new FlightsFootprintCore();
var target = document.getElementsByClassName(flightManager.refresh)[0],
    observer = new MutationObserver(function() {
      console.log('Observing!');
      flightManager.update();
    });
observer.observe(target, {
  attributes: true,
  childList: false,
  characterData: true,
  subtree: flightManager.subtree
});
