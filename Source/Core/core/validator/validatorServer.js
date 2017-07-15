/**
 * Server namespace.
 * @constructor
 */
var Server = function(){

};

/**
 * Send error report to server
 * @param {string} website
 * @param {string} error
 */
 
Server.prototype.error = function(website, error){
  console.log(error + " on " + website);
};
