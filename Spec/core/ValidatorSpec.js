describe("Website Validator Tests With Mocks", function() {
  var trainsValidator, flightsValidator;
  beforeAll(function() {
		//removing console output
		console.log = function () {};
    console.error = function () {};

    trainsValidator = new TrainsValidator("test");
    flightsValidator = new FlightsValidator("test");
  });

  it("Verify Train should return [true, false, false, false] for a list of ['tvg', {}, 1000, '']", function() {
		var trains =['tvg', {}, 1000, ''];
		var results = [true, false, false, false];

		for (var i = 0; i < trains.length; i++) {
			expect(trainsValidator.verifyTrain(trains[i])).toBe(results[i]);
		}
	});

  it("Verify Station should return [true, false, false, false] for a list of ['Paris', {}, 1000, '']", function() {
		var stations =['Paris', 1000, ''];
		var results = [true, false, false];

		for (var i = 0; i < stations.length; i++) {
			expect(trainsValidator.verifyStation(stations[i])).toBe(results[i]);
		}
	});

  it("Verify Airplanes should return [true, false, false, false, false] for a list of [['A380', '747'], [], ['A380', 1000], '', ['a_very_long_string']]", function() {
		var airplanes = [['A380', '747'], [], ['A380', 1000], '', ['a_very_long_string']];
		var results = [true, false, false, false, false];

		for (var i = 0; i < airplanes.length; i++) {
			expect(flightsValidator.verifyAirplanes(airplanes[i])).toBe(results[i]);
		}
	});

  it("Verify Airports should return [true, false, false] for a list of ['DEL', '', 'DE']", function() {
		var airports = ['DEL', '', 'DE'];
		var results = [true, false, false];

		for (var i = 0; i < airports.length; i++) {
			expect(flightsValidator.verifyAirports(airports[i])).toBe(results[i]);
		}
	});
});
