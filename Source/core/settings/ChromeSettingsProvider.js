/**
 * Created by Kolpa on 22.03.2016.
 * Contributed by PrateekGupta1509
 */
var ChromeSettingsProvider = function (cb) {
    var self = this;

    self.usingDefaultListeners = [];

    chrome.storage.sync.get('calculationObject', function (settings) {
        if (settings.calculationObject)
            self.settings = settings.calculationObject;
        else
            self.settings = {};
        console.log(self.settings);
        cb(self);
    });
};

ChromeSettingsProvider.prototype.addUsingDefaultListener = function (listener) {
    this.usingDefaultListeners.push(listener);
};

ChromeSettingsProvider.prototype.has = function (key) {
    return key in this.settings;
};

ChromeSettingsProvider.prototype.get = function (key, def) {
    if (this.has(key))
        return this.settings[key];

    for (var i in this.usingDefaultListeners) {
        var listener = this.usingDefaultListeners[i];
        this.usingDefaultListeners.splice(i, 1);

        listener();
    }

    return def;
};

ChromeSettingsProvider.prototype.getCarbonEmission = function() {
    return this.get('emissionRate', 217);
};

ChromeSettingsProvider.prototype.getCarbonEmissionUnit = function() {
  return this.get('units',{m: 'kg'}).m;
};

ChromeSettingsProvider.prototype.getTravelRate = function () {
    return this.get('travelRate', 30);
};

ChromeSettingsProvider.prototype.showTravelCost = function () {
    return this.get('showTravelCost', false);
};

var SettingsProvider = ChromeSettingsProvider;
