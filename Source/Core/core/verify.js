var Verifier = function() {

};

Verifier.prototype.counterMeasure = function(){
  console.log("Something is wrong");
  this.showNotification();
  this.throwError();
};

Verifier.prototype.showNotification = function(){
  console.log("Show A notifiation");
};

Verifier.prototype.throwError = function(){
  console.log("Throw an error");
};

Verifier.prototype.getByClass = function(c, element = document){
  var toGet = element.getElementsByClassName(c);
  if(toGet.length){
    return get;
  }
  else{
    this.counterMeasure();
  }
};

Verifier.prototype.getById = function(i, element = document){
  var toGet = element.getElementById(i);
  if(toGet){
    return toGet;
  }
  else{
    this.counterMeasure();
  }
};

Verifier.prototype.getChildNode = function(element, children){
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

Verifier.prototype.verifyAirports = function(airport){
  if(typeof airport !== 'string' || airport.length != 3){
    this.counterMeasure();
  }
};

Verifier.prototype.verifyStops = function(list){
  if(!Array.isArray(list)){
    this.counterMeasure();
  }
  else{
    for(var x = 0, i = list.length; x < i; x++){
      this.verifyAirports(list[x]);
    }
  }
};

Verifier.prototype.verifyAirplanes = function(list){
  if(!Array.isArray(list)){
    this.counterMeasure();
  }
  else{
    for(var x = 0, i = list.length; x < i; x++){
      if(typeof airport !== 'string' && list[x].length > 15){ //15 is an experimental value right now
        this.counterMeasure();
      }
    }
  }
};
