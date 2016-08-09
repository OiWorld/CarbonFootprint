function initMap() {
  var startPos;
  var mapCode = document.getElementById('map-type').value;
  var geoSuccess = function(position) {
    startPos = position;
    var lat = startPos.coords.latitude || 51.505,
        long = startPos.coords.longitude || -0.09;
    console.log(startPos,mapCode);
    var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(lat, long),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 8 });
    var t = new Date().getTime(); 
    var waqiMapOverlay = new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom) {
        return 'http://tiles.aqicn.org/tiles/' + mapCode + '/' +
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
  $.getJSON("http://freegeoip.net/json/", function (data) {
    var country = data.country_name.toLowerCase();//your country
    console.log(country);
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.' + ( country==='china'?'cn':'com' ) + '/maps/api/js' +
      '?sensor=false&callback=initMap';
    document.body.appendChild(script);
  }).fail(function(){
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js' +
      '?sensor=false&callback=initMap';
    document.body.appendChild(script);
  });
  document.getElementById('map-type').onchange = initMap;
}

window.onload = loadMapsAPI;
