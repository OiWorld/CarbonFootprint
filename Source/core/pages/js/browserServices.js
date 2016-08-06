var browserServices = {};

browserServices.checkBrowser = function() {
	var browser;

	if ('chrome' in window)
		browser = 'chrome';
	if ('firefoxApi' in window)
		browser = 'firefox';
	if ('safariApi' in window)
		browser = 'safari';

	return browser;
}

browserServices.getChromeLocalisation = function(key, index, cb) {
	cb(chrome.i18n.getMessage(key), index);
}

browserServices.getFirefoxLocalisation = function(key, index, cb) {
	firefoxApi.getTranslation(key, index, cb);
}

browserServices.getLocalisation = function (key, index, cb) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.getChromeLocalisation(key, index, cb);
	if (browser == 'firefox')
		browserServices.getFirefoxLocalisation(key, index, cb);
}

browserServices.clearChromeAlarm = function(name) {
	chrome.alarms.clear(name);
}

browserServices.clearFirefoxAlarm = function(name) {
	//chrome.alarms.clear(name);
}

browserServices.clearAlarm = function(name) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.clearChromeAlarm(name);
	if (browser == 'firefox')
		browserServices.clearFirefoxAlarm(name);
}

browserServices.createChromeAlarm = function(name, obj) {
	chrome.alarms.create(name, obj);
}

browserServices.createFirefoxAlarm = function(name, obj) {
	//chrome.alarms.create(name, obj);
}

browserServices.createAlarm = function(name, obj) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.createChromeAlarm(name, obj);
	if (browser == 'firefox')
		browserServices.createFirefoxAlarm(name, obj);
}

browserServices.getChromeStorage = function(key, valuescb) {
	chrome.storage.sync.get(key, valuescb);
}

browserServices.getFirefoxStorage = function(key, valuescb) {
	valuescb({});
}

browserServices.getStorage = function(key , valuescb) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.getChromeStorage(key, valuescb);
	if (browser == 'firefox')
		browserServices.getFirefoxStorage(key, valuescb);
}

browserServices.setChromeStorage = function(values) {
	chrome.storage.sync.set(values);
}

browserServices.setFirefoxStorage = function(values) {
	//chrome.storage.sync.set(values);
}

browserServices.setStorage = function(values) {
	var browser = browserServices.checkBrowser();
	if (browser == 'chrome')
		browserServices.setChromeStorage(values);
	if (browser == 'firefox')
		browserServices.setFirefoxStorage(values);
}