/**
 * loads extension settings
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * ChromeSettingsProvider namespace
 * @constructor
 * @param {function} cb
 */

var ChromeSettingsProvider = function(cb) {
  var self = this;
  self.usingDefaultListeners = [];
  chrome.storage.sync.get('calculationObject', function(settings) {
    if (settings.calculationObject)
      self.settings = settings.calculationObject;
    else
      self.settings = {};
    console.log(self.settings);
    cb(self);
  });
};

ChromeSettingsProvider.prototype = Object.create(SettingsProviderCore.prototype);

var SettingsProvider = ChromeSettingsProvider;
