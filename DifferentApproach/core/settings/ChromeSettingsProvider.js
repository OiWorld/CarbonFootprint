/**
 * Created by Kolpa on 22.03.2016.
 */
var ChromeSettingsProvider = function (cb) {
    var self = this;

    self.usingDefaultListeners = [];

    chrome.storage.sync.get('calculationObject', function (settings) {
        self.settings = settings;
        cb(self);
    });
};

ChromeSettingsProvider.prototype.addUsingDefaultListener = function (listener) {
    this.usingDefaultListeners.push(listener);
};

ChromeSettingsProvider.prototype.has = function (key) {
    return !!this.settings[key];
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
    return this.get('carbonEmission', 20);
};

ChromeSettingsProvider.prototype.getTravelRate = function () {
    return this.get('travelRate', 30);
};

ChromeSettingsProvider.prototype.showTravelCost = function () {
    return this.get('showTravelCost', true);
};

var SettingsProvider = ChromeSettingsProvider;