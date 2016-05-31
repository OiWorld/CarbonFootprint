new SettingsProvider(function (settingsProvider) {

    settingsProvider.addUsingDefaultListener(function() {
        var optionsUrl = chrome.extension.getURL("pages/options.html");
        window.open(optionsUrl);
    });

    var core = new CarbonFootprintCore(settingsProvider);
    var mapsManager = new MapManager(core, settingsProvider);

    chrome.runtime.sendMessage({ showPageAction : 'True'},function(){
        var observer = new MutationObserver(function() {
            mapsManager.update();
        });

        var target = document.getElementsByTagName('body')[0];
        observer.observe(target, {attributes: true, childList: true, characterData: true, subtree: false});
    });
    
});