var browserServices = {};

/**
 * checks which browser is used
 * @return {string}
 */

browserServices.checkBrowser = function() {
  var browser;

  if ('chrome' in window || 'firefoxApi' in window)
    browser = 'chrome';
  // if ('firefoxApi' in window)
    // browser = 'firefox';
  /**
   * detecting SAFARI browser
   * 'chrom' filters down (chrom)e as well as (chrom)ium
   */
  if (!(navigator.userAgent.toLowerCase().indexOf('chrom') != -1)) {
    if (navigator.userAgent.toLowerCase().indexOf('safari') != -1)
      browser = 'safari';
  }
  console.log(browser);
  return browser;
};

/**
 * Calls the given callback with the chrome localisation
 * @param {string} key
 * @param {string} index
 * @param {function} cb
 */

browserServices.getChromeLocalisation = function(key, index, cb) {
  cb(chrome.i18n.getMessage(key), index);
};

/**
 * Calls the given callback with the firefox localisation
 * @param {string} key
 * @param {string} index
 * @param {function} cb
 */

browserServices.getFirefoxLocalisation = function(key, index, cb) {
  firefoxApi.getTranslation(key, index, cb);
};

/**
 * Calls the given callback with the needed localisation
 * @param {string} key
 * @param {string} index
 * @param {function} cb
 */

browserServices.getLocalisation = function(key, index, cb) {
  var browser = browserServices.checkBrowser();
  if (browser == 'chrome' || browser == 'firefox')
    browserServices.getChromeLocalisation(key, index, cb);
  // if (browser == 'firefox')
    // browserServices.getFirefoxLocalisation(key, index, cb);
};

/**
 * Clears the given alarm in chrome
 * @param {string} name
 */

browserServices.clearChromeAlarm = function(name) {
  chrome.alarms.clear(name);
};

/**
 * Clears the given alarm in firefox
 * @param {string} name
 */

browserServices.clearFirefoxAlarm = function(name) {
  //these are not needed
  //firefoxApi.clearAlarm(name);
};

/**
 * Calls the clear alarm api for the current browser
 * @param {string} name
 */

browserServices.clearAlarm = function(name) {
  var browser = browserServices.checkBrowser();
  if (browser == 'chrome' || browser == 'firefox')
    browserServices.clearChromeAlarm(name);
  // if (browser == 'firefox')
    // browserServices.clearFirefoxAlarm(name);
};

/**
 * Creates a new alarm in Chrome
 * @param {string} name
 * @param {object} obj
 */

browserServices.createChromeAlarm = function(name, obj) {
  chrome.alarms.create(name, obj);
};

/**
 * Creates a new alarm in Firefox
 * @param {string} name
 * @param {object} obj
 */

browserServices.createFirefoxAlarm = function(name, obj) {
  //these are not needed
  //firefoxApi.createAlarm(obj);
};

/**
 * Calls the create alarm api for the current browser
 * @param {string} name
 * @param {object} obj
 */

browserServices.createAlarm = function(name, obj) {
  var browser = browserServices.checkBrowser();
  if (browser == 'chrome' || browser == 'firefox')
    browserServices.createChromeAlarm(name, obj);
  // if (browser == 'firefox')
    // browserServices.createFirefoxAlarm(name, obj);
};

/**
 * Gets a storage object for chrome
 * @param {string} key
 * @param {function} valuescb
 */

browserServices.getChromeStorage = function(key, valuescb) {
  chrome.storage.sync.get(key, valuescb);
};

/**
 * Gets a storage object for firefox
 * @param {string} key
 * @param {function} valuescb
 */

browserServices.getFirefoxStorage = function(key, valuescb) {
  firefoxApi.getStorage(key, valuescb);
};

/**
 * Gets a storage object for the current browser
 * @param {string} key
 * @param {function} valuescb
 */

browserServices.getStorage = function(key, valuescb) {
  var browser = browserServices.checkBrowser();
  if (browser == 'chrome' || browser == 'firefox')
    browserServices.getChromeStorage(key, valuescb);
  // if (browser == 'firefox')
    // browserServices.getFirefoxStorage(key, valuescb);
};

/**
 * Sets a storage object for Chrome
 * @param {object} values
 */

browserServices.setChromeStorage = function(values) {
  chrome.storage.sync.set(values);
};

/**
 * Sets a storage object for Firefox
 * @param {object} values
 */

browserServices.setFirefoxStorage = function(values) {
  firefoxApi.saveStorage(values);
};

/**
 * Sets a storage object for the current browser
 * @param {object} values
 */

browserServices.setStorage = function(values) {
  var browser = browserServices.checkBrowser();
  if (browser == 'chrome' || browser == 'firefox')
    browserServices.setChromeStorage(values);
  // if (browser == 'firefox')
    // browserServices.setFirefoxStorage(values);
};

/**
 * Returns a Chrome specific plugin filepath
 * @param {string} path
 * @return {string}
 */

browserServices.getChromeFilePath = function(path) {
  return path;
};

/**
 * Returns a Firefox specific plugin filepath
 * @param {string} path
 * @return {string}
 */

browserServices.getFirefoxFilePath = function(path) {
  return 'resource://carbon-footprint/data' + path;
};

/**
 * Returns a Safari specific plugin filepath
 * @param {string} path
 * @return {string}
 */

browserServices.getSafariFilePath = function(path) {
  return (safari.extension.baseURI + path).replace(/(\w)\/\//,
    '$1/');
};

/**
 * Returns a browser specific plugin filepath
 * @param {string} path
 * @return {string}
 */

browserServices.getFilePath = function(path) {
  var browser = browserServices.checkBrowser();
  if (browser == 'chrome' || browser == 'firefox')
    return browserServices.getChromeFilePath(path);
  // if (browser == 'firefox')
    // return browserServices.getFirefoxFilePath(path);
  if (browser == 'safari')
    return browserServices.getSafariFilePath(path);
};
