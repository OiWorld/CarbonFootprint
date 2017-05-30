/**
 * initialises the extension when maps webpage is opened
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

new SettingsProvider(function(settingsProvider) {
  settingsProvider.addUsingDefaultListener(function() {
    var optionsUrl = Helper.getFilePath('pages/options.html');
    Helper.openUrl(optionsUrl);
    console.log('calling window open on ' + optionsUrl);
  });
  var core = new CarbonFootprintCore(settingsProvider, Helper);
  var mapsManager = new MapManager(core, settingsProvider);
  Helper.showPageAction(function() {
    console.log('Page Action Visible!');
  });

    var target = document.getElementsByTagName('body')[0],
      observer = new MutationObserver(function() {
        console.log('Observing!');
        mapsManager.update();
      });
  observer.observe(target, {
    attributes: true,
    characterData: true,
    subtree: mapsManager.subtree
  });
});
