var Server = function(){

};

Server.prototype.error = function(website, error){
  console.log(error + " on " + website);
};

Server.prototype.warning = function(website, warning){
  console.log(warning + " on " + website);
};
