var FirefoxHelper = function(argument) {

};

/**
 * Returns a Firefox specific plugin filepath
 * @param {string} filename
 * @return {string}
 */

FirefoxHelper.getFilePath = function(filename) {
  return 'resource://carbon-footprint/data/' + filename;
};

/**
 * Emits a show page action event for the background pagw
 * @param {function} cb
 */

FirefoxHelper.showPageAction = function(cb) {
  //chrome.runtime.sendMessage({showPageAction: 'True'}, cb);
  console.log('showPageAction Called');
  self.port.emit('showPageAction', {
    showPageAction: true
  });
  cb();
};

/**
 * Emits a open url event for the background pagw
 * @param {string} url
 */

FirefoxHelper.openUrl = function(url) {
  console.log('openUrl called');
  self.port.emit('openUrl', {
    url: url
  });
};

var Helper = FirefoxHelper;
