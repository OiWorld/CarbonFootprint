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
  var self = this;
  self.usingDefaultListeners = [];
  self.settings = {};
  cb(self);
};

/**
 * CarbonFootprintCore namespace.
 * @param {function} listener
 */

FirefoxSettingsProvider.prototype.addUsingDefaultListener =
  function(listener) {
    this.usingDefaultListeners.push(listener);
};

/**
 * checks if given 'key' is present
 * @param {string} key
 * @return {boolean}
 */

FirefoxSettingsProvider.prototype.has = function(key) {
  return key in this.settings;
};

/**
 * returns value stored in given 'key' if it is present
 * else returns 'def' value
 * @param {string} key
 * @param {number} def
 * @return {number}
 */

FirefoxSettingsProvider.prototype.get = function(key, def) {
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
 * @return {number}
 */

FirefoxSettingsProvider.prototype.getCarbonEmission = function() {
  return this.get('CO2emissionRate', 0.255384);
};

/**
 * returns CH4 emission rate
 * default emission rate provided by:
 * https://www3.epa.gov/otaq/models/ngm/420p04016.pdf
 * @return {number}
 */

FirefoxSettingsProvider.prototype.getCH4Emission = function() {
  return this.get('CH4emissionRate', 0.000024917);
};

/**
 * returns N2O emission rate
 * default emission rate provided by:
 * https://www3.epa.gov/otaq/models/ngm/420p04016.pdf
 * @return {number}
 */

FirefoxSettingsProvider.prototype.getN2OEmission = function() {
  return this.get('N2OemissionRate', 0.000017585);
};

/**
 * returns GHG emission rate
 * default emission rate provided by:
 * https://www.epa.gov/sites/production/files/2016-02/documents/420f14040a.pdf
 * @return {number}
 */

FirefoxSettingsProvider.prototype.getGHGEmission = function() {
  return this.get('GHGemissionRate', 0.25901);
};


/**
 * returns carbon emission unit
 * @return {number}
 */

FirefoxSettingsProvider.prototype.getCarbonEmissionUnit = function() {
  return this.get('units',{m: 'kg'}).m;
};

/**
 * returns travel rate
 * @return {number}
 */

FirefoxSettingsProvider.prototype.getTravelRate = function() {
  return this.get('travelRate', 30);
};

/**
 * whether to show travel cost
 * @return {boolean}
 */

FirefoxSettingsProvider.prototype.showTravelCost = function() {
  return this.get('showTravelCost', false);
};

var SettingsProvider = FirefoxSettingsProvider;
