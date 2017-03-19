/**
 * CarbonFootprintCore namespace.
 * @param {function}
 */

var SettingsProviderCore = function(){}

SettingsProviderCore.prototype.addUsingDefaultListener =
  function(listener) {
    this.usingDefaultListeners.push(listener);
};

/**
 * checks if given 'key' is present
 * @param {string} key
 * @return {boolean}
 */

SettingsProviderCore.prototype.has = function(key) {
  return key in this.settings;
};

/**
 * returns value stored in given 'key' if it is present
 * else returns 'def' value
 * @param {string} key
 * @param {number} def
 * @return {number}
 */

SettingsProviderCore.prototype.get = function(key, def) {
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

SettingsProviderCore.prototype.getCarbonEmission = function() {
  return this.get('CO2emissionRate', 0.255384);
};

/**
 * returns CO2 emission rate for public transport in kg/h
 * http://www.catf.us/resources/publications/files/20120227-Diesel_vs_CNG_FINAL_MJBA.pdf
 * http://www.tmb.cat/en/transports-en-xifres
 * @return {number}
 */

SettingsProviderCore.prototype.getPTCarbonEmission = function() {
  return 0.533148;
};

/**
 * returns CH4 emission rate
 * default emission rate provided by:
 * https://www3.epa.gov/otaq/models/ngm/420p04016.pdf
 * @return {number}
 */

SettingsProviderCore.prototype.getCH4Emission = function() {
  return this.get('CH4emissionRate', 0.000024917);
};

/**
 * returns N2O emission rate
 * default emission rate provided by:
 * https://www3.epa.gov/otaq/models/ngm/420p04016.pdf
 * @return {number}
 */

SettingsProviderCore.prototype.getN2OEmission = function() {
  return this.get('N2OemissionRate', 0.000017585);
};

/**
 * returns GHG emission rate
 * default emission rate provided by:
 * https://www.epa.gov/sites/production/files/2016-02/documents/420f14040a.pdf
 * @return {number}
 */

SettingsProviderCore.prototype.getGHGEmission = function() {
  return this.get('GHGemissionRate', 0.25901);
};


/**
 * returns carbon emission unit
 * @return {number}
 */

SettingsProviderCore.prototype.getCarbonEmissionUnit = function() {
  return this.get('units', {m: 'kg'}).m;
};

/**
 * returns travel rate
 * @return {number}
 */

SettingsProviderCore.prototype.getTravelRate = function() {
  return this.get('travelRate', 30);
};

/**
 * returns local currency
 * @return {number}
 */

SettingsProviderCore.prototype.getCurrency = function() {
  return this.get('currency', 3);
};

/**
 * whether to show travel cost
 * @return {boolean}
 */

SettingsProviderCore.prototype.showTravelCost = function() {
  return this.get('showTravelCost', false);
};
