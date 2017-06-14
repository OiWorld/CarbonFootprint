console.log("engage init");
var trainManager = new TrainManager();
var core = new TrainsFootprintCore();
var target = document.getElementsByTagName("body")[0],
    observer = new MutationObserver(function() {
      console.log('Observing!');
      trainManager.update();
    });
observer.observe(target, {
  attributes: true,
  childList: false,
  characterData: true,
  subtree: trainManager.subtree
});
