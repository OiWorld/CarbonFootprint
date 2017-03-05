/**
 * loads extension settings
 * @author Kolpa (Kolya Opahle)
 * @author heychirag (Chirag Arora)
 */

/**
 * ChromeHelper namespace
 * @constructor
 * @param {|} argument
 */

var ChromeHelper = function(argument) {

};

/**
 * returns file path relative to base URL
 * @param {string} filename
 * @return {string}
 */

ChromeHelper.getFilePath = function(filename) {
  return chrome.runtime.getURL(filename);
};

/**
 * called when extension intialises on a page
 * @param {function} cb
 */

ChromeHelper.showPageAction = function(cb) {
  chrome.runtime.sendMessage({
    showPageAction: 'True'
  }, cb);
};

/**
 * dispatches a message to open passed URL in Safari
 * @param {string} url
 */

ChromeHelper.openUrl = function(url) {
  window.open(url);
};

var Helper = ChromeHelper;
