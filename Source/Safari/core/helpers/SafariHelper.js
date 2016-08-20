/**
 * loads extension settings
 * @author Kolpa (Kolya Opahle)
 * @author heychirag (Chirag Arora)
 */

/**
 * SafariHelper namespace
 * @constructor
 * @param {|} argument
 */

var SafariHelper = function(argument) {

};

/**
 * returns file path relative to base URL
 * @param {string} filename
 * @return {string}
 */


SafariHelper.getFilePath = function(filename) {
  return safari.extension.baseURI + filename;
};

/**
 * dispatches a message to open passed URL in Safari
 * @param {string} url
 */

SafariHelper.openUrl = function(url) {
  console.log('openUrl called', url);
  safari.self.tab.dispatchMessage('openUrl', url);
};

/**
 * called when extension intialises on a page
 * @param {function} cb
 */

SafariHelper.showPageAction = function(cb) {
  safari.self.tab.dispatchMessage('Initialised');
  cb();
};

var Helper = SafariHelper;
