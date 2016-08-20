/**
 * loads data from background
 * @author Kolpa (Kolya Opahle)
 */

/**
 * ChromeBackroundDataAdapter namespace
 * @constructor
 * @param {function} cb
 */

var BackgroundDataAdapter = function(cb) {
  var self = this;

  browserServices.getStorage('exchangeRates', function(response) {
    if (response)
      self.exchangeRates = response.exchangeRates;
  });
  browserServices.getStorage('fuelPrices', function(response) {
    if (response)
      self.fuelPrices = response.fuelPrices;
  });
  cb();
};
