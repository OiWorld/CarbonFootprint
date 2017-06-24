var BasicValidator = function() {
};

BasicValidator.prototype.counterMeasure = function(msg){
  console.log("Something is wrong");
  console.log(msg);
  this.server.error(this.website, msg);
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
    console.log("got class " + c);
    return toGet;
  }
  else{
    this.counterMeasure("cant get class " + c);
  }
};

BasicValidator.prototype.getById = function(i, element = document){
  var toGet = element.getElementById(i);
  if(toGet){
    console.log("got id " + i);
    return toGet;
  }
  else{
    this.counterMeasure("cant get id " + i);
  }
};

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
