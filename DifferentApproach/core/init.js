new SettingsProvider(function (settingsProvider) {

    settingsProvider.addUsingDefaultListener(function() {
        var optionsUrl = chrome.extension.getURL("options/options.html");
        window.open(optionsUrl);
    });

    var core = new CarbonFootprintCore(settingsProvider);
    var mapsManager = new MapManager(core, settingsProvider);
    mapsManager.init();
});