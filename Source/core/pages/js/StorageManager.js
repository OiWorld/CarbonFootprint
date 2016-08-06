/**
 * storage manager for chrome
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * StorageManager namespace
 * @constructor
 * @param {string} key
 * @param {function} cb
 */

var StorageManager = function(key, cb) {
  var self = this;
  self.storageKey = key;
  browserServices.getStorage(self.storageKey, function(storeValues) {
    if (storeValues[self.storageKey])
      self.storeValues = storeValues[self.storageKey];
    else
      self.storeValues = {};
    cb();
  });
};

/**
 * writes/saves storeValues
 */

StorageManager.prototype.store = function() {
  var storeObject = {};
  storeObject[this.storageKey] = this.storeValues;
  browserServices.setStorage(storeObject);
};

/**
 * adds data to storeValues
 * @param {string} key
 * @param {string|number|object} value
 */

StorageManager.prototype.set = function(key, value) {
  console.log(key, value);
  this.storeValues[key] = value;
};

/**
 * return value stored in given 'key'
 * @param {string} key
 * @return {string|number|object}
 */

StorageManager.prototype.get = function(key) {
  return this.storeValues[key];
};

/**
 * checks if given 'key' is present
 * @param {string} key
 * @return {boolean}
 */

StorageManager.prototype.has = function(key) {
  return key in this.storeValues;
};
