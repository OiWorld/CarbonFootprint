var ChromeFlightDataHelper = function(){

};

ChromeFlightDataHelper.prototype.getData = function(link, cb){
  var req = new XMLHttpRequest();
  var data;
  req.open('GET', Helper.getFilePath(link));
  req.onreadystatechange = function(ev) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        cb(JSON.parse(req.responseText));
      }
    }
  };
  req.send();
  return data;
};

var DataHelper = ChromeFlightDataHelper;
