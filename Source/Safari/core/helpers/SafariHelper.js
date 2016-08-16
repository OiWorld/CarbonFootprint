var SafariHelper = function (argument) {

};

SafariHelper.getFilePath = function(filename) {
	return safari.extension.baseURI + filename;
};

SafariHelper.openUrl = function(url) {
	console.log('openUrl called');
  safari.self.tab.dispatchMessage("openUrl", url);
};

SafariHelper.showPageAction = function(cb) {
	//chrome.runtime.sendMessage({showPageAction: 'True'}, cb);
  safari.self.tab.dispatchMessage('Initialised');
  cb();
};

var Helper = SafariHelper;
