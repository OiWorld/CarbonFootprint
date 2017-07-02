var Server = function(){

};

Server.prototype.error = function(website, error){
  console.log(error + " on " + website);
};
