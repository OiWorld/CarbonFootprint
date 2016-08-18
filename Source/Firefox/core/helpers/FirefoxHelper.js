var FirefoxHelper = function(argument) {

};

FirefoxHelper.getFilePath = function(filename) {

	return 'resource://carbonfootprint/data/' + filename;
};

FirefoxHelper.showPageAction = function(cb) {
	//chrome.runtime.sendMessage({showPageAction: 'True'}, cb);
	console.log('showPageAction Called');
	self.port.emit('showPageAction', {
		showPageAction: true
	});
	cb();
};

FirefoxHelper.openUrl = function(url) {
	console.log('openUrl called');
	self.port.emit('openUrl', {url: url});
};

var Helper = FirefoxHelper;
