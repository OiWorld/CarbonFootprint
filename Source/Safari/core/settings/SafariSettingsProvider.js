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

/**
 * CarbonFootprintCore namespace.
 * @param {function} listener
 */

SafariSettingsProvider.prototype.addUsingDefaultListener =
  function(listener) {
    this.usingDefaultListeners.push(listener);
};

/**
 * checks if given 'key' is present
 * @param {string} key
 * @return {boolean}
 */

SafariSettingsProvider.prototype.has = function(key) {
  return key in this.settings;
};

/**
 * returns value stored in given 'key' if it is present
 * else returns 'def' value
 * @param {string} key
 * @param {number} def
 * @return {number}
 */

SafariSettingsProvider.prototype.get = function(key, def) {
  if (this.has(key))
    return this.settings[key];
  for (var i in this.usingDefaultListeners) {
    var listener = this.usingDefaultListeners[i];
    this.usingDefaultListeners.splice(i, 1);
    listener();
  }
  return def;
};

/**
 * returns CO2 emission rate
 * default emission rate provided by:
 * https://www.epa.gov/sites/production/files/2016-02/documents/420f14040a.pdf
 * find a credible source for public transport emission in kg/hr
 * @return {number}
 */

SafariSettingsProvider.prototype.getCarbonEmission = function() {
  return this.get('CO2emissionRate', 0.255384);
};

/**
 * returns CO2 emission rate for public transport in kg/h
 * http://www.catf.us/resources/publications/files/20120227-Diesel_vs_CNG_FINAL_MJBA.pdf
 * http://www.tmb.cat/en/transports-en-xifres
 * @return {number}
 */

SafariSettingsProvider.prototype.getPTCarbonEmission = function() {
  return 0.533148;
};

/**
 * returns CH4 emission rate
 * default emission rate provided by:
 * https://www3.epa.gov/otaq/models/ngm/420p04016.pdf
 * @return {number}
 */

SafariSettingsProvider.prototype.getCH4Emission = function() {
  return this.get('CH4emissionRate', 0.000024917);
};

/**
 * returns N2O emission rate
 * default emission rate provided by:
 * https://www3.epa.gov/otaq/models/ngm/420p04016.pdf
 * @return {number}
 */

SafariSettingsProvider.prototype.getN2OEmission = function() {
  return this.get('N2OemissionRate', 0.000017585);
};

/**
 * returns GHG emission rate
 * default emission rate provided by:
 * https://www.epa.gov/sites/production/files/2016-02/documents/420f14040a.pdf
 * @return {number}
 */

SafariSettingsProvider.prototype.getGHGEmission = function() {
  return this.get('GHGemissionRate', 0.25901);
};


/**
 * returns carbon emission unit
 * @return {number}
 */

SafariSettingsProvider.prototype.getCarbonEmissionUnit = function() {
  return this.get('units', {m: 'kg'}).m;
};

/**
 * returns travel rate for driving
 * @return {number}
 */

SafariSettingsProvider.prototype.getTravelRate = function() {
  return this.get('travelRate', 30);
};

/**
 * returns local currency
 * @return {number}
 */

SafariSettingsProvider.prototype.getCurrency = function() {
  return this.settings.currency;
};

/**
 * whether to show travel cost
 * @return {boolean}
 */

SafariSettingsProvider.prototype.showTravelCost = function() {
  return this.get('showTravelCost', false);
};

var SettingsProvider = SafariSettingsProvider;
