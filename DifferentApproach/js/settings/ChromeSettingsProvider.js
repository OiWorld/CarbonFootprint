/**
 * Created by Kolpa on 22.03.2016.
 */
var ChromeSettingsProvider = function (cb) {
    var self = this;

    chrome.storage.sync.get(null, function (settings) {
        self.settings = settings;
        cb(self);
    });
};

ChromeSettingsProvider.prototype.getCarbonEmission = function() {
    return 20;
};

ChromeSettingsProvider.prototype.getTravelRate = function () {
    return 30;
};

ChromeSettingsProvider.prototype.showTravelCost = function () {
    return true
};

var SettingsProvider = ChromeSettingsProvider;