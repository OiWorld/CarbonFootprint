function initMap() {
    var mapCode = document.getElementById('map-type').value;
    var formattedMap = '<div id="map"></div>';

    $('#map-container').html(formattedMap);

    // Loads overlay tiles from aqicn for Leaflet Maps
    // for details regarding implementation visit: Load overlay tiles from aqicn of choosen mapType
    var OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var OSM_ATTRIB = '&copy;  <a  href="http://openstreetmap.org/copyright">OpenStreetMap</a>  contributors';
    var osmLayer = L.tileLayer(OSM_URL, {
        attribution: OSM_ATTRIB
    });
    var WAQI_URL = 'http://tiles.aqicn.org/tiles/' + mapCode + '/' + '{z}/{x}/{y}.png?token=99a82d982d2bbcacc291962fba93d7535029ba17';
    var WAQI_ATTR = 'Air  Quality  Tiles  &copy;  <a  href="http://waqi.info">waqi.info</a>';
    var waqiLayer = L.tileLayer(WAQI_URL, {
        attribution: WAQI_ATTR
    });

    //Loads  Leaflet maps || Documentation: http://leafletjs.com/examples/quick-start/
    var map = L.map('map');

    //Use HTML5 geolocation to get user coordinates for map
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setView([pos.lat, pos.lng], 11);
            map.addLayer(osmLayer).addLayer(waqiLayer);
        });
    } else {
        handleLocationError(false);
    }

    // addressing the issue - when the map is created, the container width/height for leaflet's `map-canvas' element is not adjusted
    // to the width/height of the modal dialog. This causes the map size to be incorrect (smaller) than what it should be.
    // map.invalidateSize() will work to re-adjust the width/height bounds of the L.Map's container.
    // map.invalidateSize() official documentation here: http://leafletjs.com/reference.html#map-invalidatesize
    //The timeout is because there may be some animation/transition time for the modal to display and be added to the DOM.
    $('#tileModal1').on('show.bs.modal', function() {
        setTimeout(function() {
            map.invalidateSize();
        }, 200);
    });
} // initMap ends

// fallback for browsers that doesn't support geolocation
function handleLocationError(browserHasGeolocation) {
    $('#map').append('<p class="geolocation-failure">Error: The Geolocation service failed. Your browser doesn\'t support geolocation.</p>');
}

function loadMapsAPI() {
    //calling initMap function
    initMap();
    // Call initMap when a map type is changes
    document.getElementById('map-type').onchange = initMap;
}

/**
 * Loads Leaflet maps api on window.onload
 */
window.onload = loadMapsAPI;
