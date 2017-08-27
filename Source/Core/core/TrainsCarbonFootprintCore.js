var TrainsFootprintCore = function(settingsProvider, helper){
  this.settingsProvider = settingsProvider;
  this.helper = helper;
  console.log("init core");
  this.getData = function(link, cb){
    var req = new XMLHttpRequest();
    var data;
    req.open('GET', link);
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
  distanceBetween = 0;
  var self = this;
};

/**
 * Function for getting the appropriate data according to the website.
 * @param String
 */
TrainsFootprintCore.prototype.storeDataSource = function(dataSource){
  this.getData(this.helper.getFilePath("core/resources/trainEmissions.json"), function(data){
    trainData = data.trainData[dataSource];
    console.log(trainData);
  });
};

/**
 * Geocodes station using google's api.
 * @param Array
 */
TrainsFootprintCore.prototype.geocode = function(toGeocode){
  var self = this;
  console.log("init geocode");
  distanceBetween = 1; //This marks that geocoding request has been sent
  this.getData("https://maps.googleapis.com/maps/api/geocode/json?&address=" + toGeocode[0], function(data1){
    var depart = data1.results[0].geometry.location;
    self.getData("https://maps.googleapis.com/maps/api/geocode/json?&address=" + toGeocode[1], function(data2){
      var arrive = data2.results[0].geometry.location;
      distanceBetween = self.getDistance(depart.lat, depart.lng, arrive.lat, arrive.lng);
      console.log("dist in func " + distanceBetween);
    });
  });
};

/*This formula was generated in skitlearn using the data at 
* https://drive.google.com/file/d/0B4tFHTfBrq9wN2RCd2VxQ1Q0eG8/view?usp=sharing
* It is used to convert straight line distance between 2 train stations into distance travelled
* by a train between these 2 stations, for graph check trainDistance.png in Relevant Docs folder.
* @param Float as straight line distance between 2 train stations.
* @return Float as Distance travelled by train.
*/
TrainsFootprintCore.prototype.convertToTrainDistance = function(distance){
  return 1.4089*distance - 38;
};

/**
 * Calculate distance between two coordinates.
 * @param Float,Float,Float,Float as Coordinates.
 * @return Float as Distance travelled by train.
 */
TrainsFootprintCore.prototype.getDistance = function(lat1, lon1, lat2, lon2){
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;
  var distanceBetweenCoords = 12742 * Math.asin(Math.sqrt(a)); // 12742 km = diameter of earth
  console.log("direct distance = " + distanceBetweenCoords);
  return this.convertToTrainDistance(distanceBetweenCoords);
};

/**
 * Calculate CO2 emission of trains
 * @param Array as different types of trains used for
 * travelling between the two stations.
 * @return Object as HTML element for displaying in the website.
 */
TrainsFootprintCore.prototype.getEmission = function(modeList){
  var modeAverage = 0;
  for(var y = 0, j = modeList.length; y < j; y++){
    mode = trainData[modeList[y]] ? trainData[modeList[y]] : trainData.average;
    console.log("mode = " + modeList[y] + " emission = " + mode);
    modeAverage += trainData[modeList[y]] ? trainData[modeList[y]] : trainData.average;
  }
  modeAverage /= modeList.length;
  var footprint = distanceBetween*modeAverage;
  var emission = this.createHTMLElement(footprint);
  console.log(emission);
  return emission;
};

/**
 * Gives a DOM element to insert in a website.
 * @param Float as emission produced by the path.
 * @return Object as HTML element for displaying in the website.
 */
TrainsFootprintCore.prototype.createHTMLElement =
  function(footprint) {
    var e = document.createElement('div');
    knowMoreUrl = this.helper.getFilePath('pages/knowMore.html');
    e.setAttribute("id", "carbon-footprint-label");
    e.innerHTML = '<a href=' + knowMoreUrl + ' target=\'_blank\' title=\'' +
      "footprint" + '\' class=\'carbon\' id=\'carbon\'>' +
      this.footprintToString(footprint) +
      // question mark icon using svg
      '<svg id="quest_mark_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92"><path d="M45.4 0C20 0.3-0.3 21.2 0 46.6c0.3 25.4 21.2 45.7 46.6 45.4 25.4-0.3 45.7-21.2 45.4-46.6C91.7 20 70.8-0.3 45.4 0zM45.3 74l-0.3 0c-3.9-0.1-6.7-3-6.6-6.9 0.1-3.8 2.9-6.5 6.7-6.5l0.2 0c4 0.1 6.7 3 6.6 6.9C51.9 71.3 49.1 74 45.3 74zM61.7 41.3c-0.9 1.3-2.9 2.9-5.5 4.9l-2.8 1.9c-1.5 1.2-2.5 2.3-2.8 3.4 -0.3 0.9-0.4 1.1-0.4 2.9l0 0.5H39.4l0-0.9c0.1-3.7 0.2-5.9 1.8-7.7 2.4-2.8 7.8-6.3 8-6.4 0.8-0.6 1.4-1.2 1.9-1.9 1.1-1.6 1.6-2.8 1.6-4 0-1.7-0.5-3.2-1.5-4.6 -0.9-1.3-2.7-2-5.3-2 -2.6 0-4.3 0.8-5.4 2.5 -1.1 1.7-1.6 3.5-1.6 5.4v0.5H27.9l0-0.5c0.3-6.8 2.7-11.6 7.2-14.5C37.9 18.9 41.4 18 45.5 18c5.3 0 9.9 1.3 13.4 3.9 3.6 2.6 5.4 6.5 5.4 11.6C64.4 36.3 63.5 38.9 61.7 41.3z" /></svg>';
    e.querySelector('a').addEventListener('click', function(e) {
      e.stopPropagation();
    });
    return e;
  };

/**
 * Changes the unit depending on the emission
 * @param Float as emission produced by the path.
 * @return Float as emission produced by the path after processing.
 */
TrainsFootprintCore.prototype.footprintToString = function(footprint) {
  var unit = " g";
  if(footprint >= 1000){
    unit = " kg";
    footprint /= 1000;
  }
  footprint = footprint.toFixed(1);
  return '' + footprint + unit + ' CO<sub>2</sub> per person';
};

  var trainData, distanceBetween;
  var CarbonFootprintCore = TrainsFootprintCore;
