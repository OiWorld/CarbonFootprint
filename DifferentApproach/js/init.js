new SettingsProvider(function (settingsProvider) {
    var core = new CarbonFootprintCore(settingsProvider);
    var mapsManager = new MapManager(core, settingsProvider);
    mapsManager.init();
});