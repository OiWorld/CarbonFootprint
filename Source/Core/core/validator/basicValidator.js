/**
 * BasicValidator namespace.
 * @constructor
 */
var BasicValidator = function() {
};

/**
 * used to run funtions when something fails
 * in any website.
 * @param {string} msg
 */

BasicValidator.prototype.counterMeasure = function(msg){
  console.error("Something is wrong");
  console.error(msg);
  this.server.error(this.website, msg);
};

/**
 * Wrapper function for document.getElementsByClassName()
 * @param {string} c
 * @param {object} element
 */

BasicValidator.prototype.getByClass = function(c, element = document){
  var toGet = element.getElementsByClassName(c);
  if(toGet.length){
    console.log("got class " + c);
  }
  else{
    this.counterMeasure("cant get class " + c);
  }
  return toGet;
};

/**
 * Wrapper function for document.getElementById()
 * @param {string} i
 * @param {object} element
 */

BasicValidator.prototype.getById = function(i, element = document){
  var toGet = element.getElementById(i);
  if(toGet){
    console.log("got id " + i);
  }
  else{
    this.counterMeasure("cant get id " + i);
  }
  return toGet;
};

/**
 * Wrapper function for document.getElementsByTagNameById()
 * @param {string} t
 * @param {object} element
 */

BasicValidator.prototype.getByTag = function(t, element = document){
  var toGet = element.getElementsByTagName(t);
  if(toGet.length){
    console.log("got tag " + t);
  }
  else{
    this.counterMeasure("cant get tag " + t);
  }
  return toGet;
};

/**
 * Wrapper function for document.querySelector()
 * @param {string} q
 * @param {object} element
 */

BasicValidator.prototype.querySelector = function(q, element = document){
  var e = element.querySelector(q);
  if(!e){
    this.counterMeasure("invalid element");
  }
  return e;
};

/**
 * Wrapper function for .childNodes[], gets
 * children of children as in the array
 * @param {array} children
 * @param {object} element
 */

BasicValidator.prototype.getChildNode = function(children, element = document){
  for(var x = 0, i = children.length; x < i; x++){
    if(element && element.childNodes.length){
      element = element.childNodes[children.shift()];
    }
    else{
      this.counterMeasure("invalid childNodes");
    }
  }
  if(element){
    return element;
  }
  else{
    this.counterMeasure("invalid childNodes");
  }
};

/**
 * check if argument is a string
 * @param {all} s
 */

BasicValidator.prototype.isString = function(s){
  if(typeof s !== 'string' || s.length === 0){
    this.counterMeasure("not a string");
  }
};

/**
 * check if argument is a numerical value
 * @param {all} i
 */

BasicValidator.prototype.isNumber = function(i){
  if(typeof i !== 'number'){
    this.counterMeasure("not a number");
  }
};
