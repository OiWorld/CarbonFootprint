function initMap() {
  var startPos;
  var geoSuccess = function(position) {
    startPos = position;
    var lat = startPos.coords.latitude || 51.505,
        long = startPos.coords.longitude || -0.09;
    console.log(startPos);
    var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(lat, long),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 11 });
    var t = new Date().getTime();
    var waqiMapOverlay = new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom) {
        return 'http://tiles.aqicn.org/tiles/usepa-aqi/' +
          zoom + '/' + coord.x + '/' + coord.y +
          '.png?token=99a82d982d2bbcacc291962fba93d7535029ba17';
      },
      name: 'Air Quality'
    });
    map.overlayMapTypes.insertAt(0, waqiMapOverlay);
  };
  navigator.geolocation.getCurrentPosition(geoSuccess);
}

function loadMapsAPI() {
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js' +
    '?sensor=false&callback=initMap';
  document.body.appendChild(script);
}

window.onload = loadMapsAPI;
