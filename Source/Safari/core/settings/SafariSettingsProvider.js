/**
 * loads extension settings
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * SafariSettingsProvider namespace
 * @constructor
 * @param {function} cb
 */

var SafariSettingsProvider = function(cb) {
  var self = this;
  self.usingDefaultListeners = [];
  safari.self.tab.dispatchMessage('calculationObject', {
    type: 'getItem'
  });
  safari.self.tab.dispatchMessage('fuelPrices', {
    type: 'getItem'
  });
  safari.self.tab.dispatchMessage('exchangeRates', {
    type: 'getItem'
  });
  safari.self.addEventListener('message', function(response) {
    if (response.name === 'calculationObject') {
      if (response.message !== null)
        self.settings = response.message;
      else
        self.settings = {};
      console.log(self.settings);
      cb(self);
    }
    else if (response.name === 'exchangeRates') {
      if (response.message !== null)
        self.exchangeRates = response.message.rates;
      console.log(self.exchangeRates);
    }
    else if (response.name === 'fuelPrices') {
      if (response.message !== null)
        self.fuelPrices = response.message;
    }
    else if (response.name === 'reload') {
      window.location.reload();
    }
  }, false);
};

SafariSettingsProvider.prototype = Object.create(SettingsProviderCore.prototype);

var SettingsProvider = SafariSettingsProvider;
