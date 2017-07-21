/**
 * MapsValidator namespace.
 * @constructor
 * @param {string} website
 */
var MapsValidator = function(website) {
  BasicValidator.call(this);
  this.server = new Server();
  this.website = website;
};

MapsValidator.prototype = Object.create(BasicValidator.prototype);
MapsValidator.prototype.constructor = MapsValidator;
