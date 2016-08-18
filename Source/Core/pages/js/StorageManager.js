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
  /**
   * detecting SAFARI browser
   * 'chrom' filters down (chrom)e as well as (chrom)ium
   */
  if (navigator.userAgent.toLowerCase().indexOf('chrom') != -1) {
    self.isSafari = false;
  }
  else {
    if (navigator.userAgent.toLowerCase().indexOf('safari') != -1)
      self.isSafari = true;
  }
  if (!self.isSafari) {
    browserServices.getStorage(self.storageKey, function(storeValues) {
      if (storeValues[self.storageKey])
        self.storeValues = storeValues[self.storageKey];
      else
        self.storeValues = {};
      cb();
    });
  }
  else {
    safari.self.tab.dispatchMessage(self.storageKey, {
      type: 'getItem'
    });
    safari.self.addEventListener('message', function(response) {
      if (response.name === self.storageKey) {
        console.log(response.message);
        if (response.message !== null)
          self.storeValues = response.message;
        else
          self.storeValues = {};
        cb();
      }
    }, false);
  }
};

/**
 * writes/saves storeValues
 */

StorageManager.prototype.store = function() {
  if (!this.isSafari) {
    var storeObject = {};
    storeObject[this.storageKey] = this.storeValues;
    browserServices.setStorage(storeObject);
  }
  else {
    safari.self.tab.dispatchMessage(this.storageKey, {
      type: 'setItem',
      item: this.storeValues
    });
  }
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
