var airports, airplanes, calculator;
calculator = new FlightsFootprintCommon();


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
      distance = calculator.getDistance(departure.lat, departure.lon, stop.lat, stop.lon) +
        calculator.getDistance(stop.lat, stop.lon, destination.lat, destination.lon);
    }
    else{
      console.log("direct flight");
      distance = calculator.getDistance(departure.lat, departure.lon, destination.lat, destination.lon);
    }
    var emission = calculator.getEmission([{
      aircraft: data.airplane,
      distance: distance
    }])[0].co2Emission;
    console.log(emission);
    if(data.trip == "round"){
      emission *= 2;
    }
    $('#outputEmission').html(emission + "kg of CO<sub>2</sub> per person");
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
