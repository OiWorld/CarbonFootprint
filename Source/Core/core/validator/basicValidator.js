var BasicValidator = function() {
};

BasicValidator.prototype.counterMeasure = function(msg){
  console.log("Something is wrong");
  console.log(msg);
  this.server.error(msg, this.website);
  this.showNotification();
  this.throwError();
};

BasicValidator.prototype.showNotification = function(){
  console.log("Show A notifiation");
};

BasicValidator.prototype.throwError = function(){
  console.log("Throw an error");
};

BasicValidator.prototype.getByClass = function(c, element = document){
  var toGet = element.getElementsByClassName(c);
  if(toGet.length){
    return toGet;
  }
  else{
    this.counterMeasure("cant get class " + c);
  }
};

BasicValidator.prototype.getById = function(i, element = document){
  var toGet = element.getElementById(i);
  if(toGet){
    return toGet;
  }
  else{
    this.counterMeasure();
  }
};

BasicValidator.prototype.getChildNode = function(children, element){
  for(var x = 0, i = children.length; x < i; x++){
    if(element.childNodes){
      element = element.childNodes[children.shift()];
    }
    else{
      this.counterMeasure();
    }
  }
  return element;
};
