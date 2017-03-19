/**
 * loads extension settings
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * FirefoxSettingsProvider namespace
 * @constructor
 * @param {function} cb
 */

var FirefoxSettingsProvider = function(cb) {
  var selfe = this;
  selfe.usingDefaultListeners = [];
  self.port.emit('storageGetRequest',
    {
      tag: 9001,
      storageKey: 'calculationObject'
    }
  );
  self.port.on('storageGetResponse', function(storage) {
    if (storage.tag === 9001) {
      if (storage.values.calculationObject)
        selfe.settings = storage.values.calculationObject;
      else
        selfe.settings = {};
    cb(selfe);
    }
  });
};

FirefoxSettingsProvider.prototype = Object.create(SettingsProviderCore.prototype);

var SettingsProvider = FirefoxSettingsProvider;
