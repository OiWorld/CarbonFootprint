/**
 * initialises the extension when maps webpage is opened
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

new SettingsProvider(function(settingsProvider) {
  settingsProvider.addUsingDefaultListener(function() {
    var optionsUrl = Helper.getFilePath('pages/options.html');
    console.log('calling window open on ' + optionsUrl);
    window.open(optionsUrl);
  });
  var core = new CarbonFootprintCore(settingsProvider, Helper);
  var mapsManager = new MapManager(core, settingsProvider);
  Helper.showPageAction(function() {
    var target = document.getElementsByTagName('body')[0],
        observer = new MutationObserver(function() {
          mapsManager.update();
          console.log('observing!');
        });
    observer.observe(target, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
  });
});
