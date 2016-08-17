var browserServices = {};

browserServices.checkBrowser = function() {
	var browser;

	if ('chrome' in window)
		browser = 'chrome';
	if ('firefoxApi' in window)
		browser = 'firefox';
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

browserServices.getChromeLocalisation = function(key, index, cb) {
	cb(chrome.i18n.getMessage(key), index);
};

browserServices.getFirefoxLocalisation = function(key, index, cb) {
	firefoxApi.getTranslation(key, index, cb);
};

browserServices.getLocalisation = function(key, index, cb) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.getChromeLocalisation(key, index, cb);
	if (browser == 'firefox')
		browserServices.getFirefoxLocalisation(key, index, cb);
};

browserServices.clearChromeAlarm = function(name) {
	chrome.alarms.clear(name);
};

browserServices.clearFirefoxAlarm = function(name) {
	//chrome.alarms.clear(name);
};

browserServices.clearAlarm = function(name) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.clearChromeAlarm(name);
	if (browser == 'firefox')
		browserServices.clearFirefoxAlarm(name);
};

browserServices.createChromeAlarm = function(name, obj) {
	chrome.alarms.create(name, obj);
};

browserServices.createFirefoxAlarm = function(name, obj) {
	//chrome.alarms.create(name, obj);
};

browserServices.createAlarm = function(name, obj) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.createChromeAlarm(name, obj);
	if (browser == 'firefox')
		browserServices.createFirefoxAlarm(name, obj);
};

browserServices.getChromeStorage = function(key, valuescb) {
	chrome.storage.sync.get(key, valuescb);
};

browserServices.getFirefoxStorage = function(key, valuescb) {
	firefoxApi.getStorage(key, valuescb);
};

browserServices.getStorage = function(key , valuescb) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.getChromeStorage(key, valuescb);
	if (browser == 'firefox')
		browserServices.getFirefoxStorage(key, valuescb);
};

browserServices.setChromeStorage = function(values) {
	chrome.storage.sync.set(values);
};

browserServices.setFirefoxStorage = function(values) {
	firefoxApi.saveStorage(values);
};

browserServices.setStorage = function(values) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.setChromeStorage(values);
	if (browser == 'firefox')
		browserServices.setFirefoxStorage(values);
};

browserServices.getChromeFilePath = function(path) {
	return path;
};

browserServices.getFirefoxFilePath = function(path) {
	return 'resource://carbonfootprint/data' + path;
};

browserServices.getSafariFilePath = function(path) {
  return (safari.extension.baseURI + path).replace(/(\w)\/\//, '$1/');
};

browserServices.getFilePath = function(path) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		return browserServices.getChromeFilePath(path);
	if (browser == 'firefox')
		return browserServices.getFirefoxFilePath(path);
  if (browser == 'safari')
		return browserServices.getSafariFilePath(path);
};
