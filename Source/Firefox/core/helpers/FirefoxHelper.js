var FirefoxHelper = function (argument) {

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
var Helper = FirefoxHelper;