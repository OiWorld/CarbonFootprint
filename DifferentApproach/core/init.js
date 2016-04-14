new SettingsProvider(function (settingsProvider) {

    settingsProvider.addUsingDefaultListener(function() {
        alert("Please Set the plugin options");
    });

    var core = new CarbonFootprintCore(settingsProvider);
    var mapsManager = new MapManager(core, settingsProvider);
    mapsManager.init();
});