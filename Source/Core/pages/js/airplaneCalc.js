var airports, airplanes;

var AirplaneEmissionForm = {
  emissionRate: 3.16,
  nmi_to_km: 1.852,
  submit: function() {
    var data = $('#AirplaneEmissionForm').serializeObject();
    console.log(data);
    var departure = airports[data.depPort];
    var destination = airports[data.desPort];
    var distance;
    console.log(departure);
    if(data.stopPort != 'none'){
      console.log("a stop in between");
      var stop = airports[data.stopPort];
      distance = AirplaneEmissionForm.distance(departure.lat, departure.lon, stop.lat, stop.lon) +
        AirplaneEmissionForm.distance(stop.lat, stop.lon, destination.lat, destination.lon);
    }
    else{
      console.log("direct flight");
      distance = AirplaneEmissionForm.distance(departure.lat, departure.lon, destination.lat, destination.lon);
    }
    var emission = AirplaneEmissionForm.distanceToCO2(distance, data.airplane);
    console.log(emission);
    if(data.trip == "round"){
      emission *= 2;
    }
    $('#outputEmission').html(emission + "kg of CO<sub>2</sub> per person");
  },

  distance: function(lat1, lon1, lat2, lon2){
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  },

  distanceToCO2: function(distance, airplane){
    if(distance === 0){
      return 0;
    }
    var fuelConsumptionFloor, fuelConsumptionCeil;
        var distanceFloor, distanceCeil;
    for(var y = 0, j = airplanes.distances.length; y < j; y++){
        if(airplanes.distances[y]*AirplaneEmissionForm.nmi_to_km > distance){
          fuelConsumptionFloor = airplanes[airplane].fuel[y-1];
          fuelConsumptionCeil = airplanes[airplane].fuel[y];
          distanceFloor = airplanes.distances[y-1]*AirplaneEmissionForm.nmi_to_km;
          distanceCeil = airplanes.distances[y]*AirplaneEmissionForm.nmi_to_km;
          break;
        }
    }
    var fuelConsumption = fuelConsumptionFloor + ((fuelConsumptionCeil - fuelConsumptionFloor)/
                          (distanceCeil - distanceFloor))*(distance - distanceFloor);
    console.log("fuelConsumption = " + fuelConsumption);
    return AirplaneEmissionForm.convertFuelToCO2(fuelConsumption, airplane);
  },

  convertFuelToCO2: function(fuel, airplane){
    return Math.floor(fuel*AirplaneEmissionForm.emissionRate/airplanes[airplane].capacity);
  },

  init: function() {
    // Load airports data
    $.getJSON(browserServices.getFilePath(
        '/core/resources/airportNames.json'),
      function(data) {
        airports = data;
        for (var key in airports) {
          $('#depPort').append('<option value="' + key + '">' +
            key +
            '</option>');
          $('#stopPort').append('<option value="' + key + '">' +
            key +
            '</option>');
          $('#desPort').append('<option value="' + key + '">' +
            key +
            '</option>');
        }
        $('#airplaneFormSubmit').on('click', function() {
          AirplaneEmissionForm.submit();
        });
      });
      $.getJSON(browserServices.getFilePath(
          '/core/resources/airplanes.json'),
          function(data){
            airplanes = data;
            for (var key in airplanes) {
              if(key != "distances" && key != "_comment"){
                $('#airplane').append('<option value="' + key + '">' +
                  key +
                  '</option>');
              }
            }
        });
  }
};

AirplaneEmissionForm.init();
