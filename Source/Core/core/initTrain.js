console.log("engage init");
var trainManager = new TrainManager(),
    core = new TrainsFootprintCore(),
    Inform = new inform(),
    target = document.getElementsByTagName("body")[0],
    observer = new MutationObserver(function() {
      console.log('Observing!');
        Inform.permission(trainManager);
    });
observer.observe(target, {
  attributes: true,
  childList: false,
  characterData: true,
  subtree: trainManager.subtree
});
