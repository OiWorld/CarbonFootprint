/*
 * Function to initialze google maps with tiles from aqicn
 */

function initMap() {
  var startPos;
  var mapCode = document.getElementById('map-type').value;
  var geoSuccess = function(position) {
    startPos = position;
    var lat = startPos.coords.latitude || 51.505,
        long = startPos.coords.longitude || -0.09;
    // console.log(startPos,mapCode);
    /**
     * Load google maps
     */
    var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(lat, long),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 8 });
    var t = new Date().getTime();

     /**
     * Load overlay tiles from aqicn of choosen mapType
     */
    var waqiMapOverlay = new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom) {
        return 'http://tiles.aqicn.org/tiles/' + mapCode + '/' +
          zoom + '/' + coord.x + '/' + coord.y +
          '.png?token=99a82d982d2bbcacc291962fba93d7535029ba17';
      },
      name: 'Air Quality'
    });
    map.overlayMapTypes.insertAt(0, waqiMapOverlay);
    /**
     * Error fix in case map cannot evaluate div size
     */
    setTimeout(function() {
      google.maps.event.trigger(map, 'resize');
    },1500);
  };
  /**
   * Use geolocation to get user coordinates for map
   */
  navigator.geolocation.getCurrentPosition(geoSuccess);
}

function loadMapsAPI() {
  // Get country of user
  $.getJSON('http://freegeoip.net/json/', function(data) {
    var country = data.country_name.toLowerCase();//your country
    console.log(country);
    var script = document.createElement('script');
    /**
      * Load from '.cn' is country is china
      * Callback to init to load maps and overlay tiles
      */
    script.src = 'https://maps.googleapis.' +
      (country === 'china' ? 'cn' : 'com') + '/maps/api/js' +
      '?&callback=initMap';
    document.body.appendChild(script);
  }).fail(function() {
    // default maps api if freegeoip fails
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js' +
      '?&callback=initMap';
    document.body.appendChild(script);
  });
  // Call initMap when a map type is changes
  document.getElementById('map-type').onchange = initMap;
}

/**
 * Loads google map api on window.onload
 */

window.onload = loadMapsAPI;
