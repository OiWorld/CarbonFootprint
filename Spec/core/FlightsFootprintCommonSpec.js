describe("Basic Flight Carbon Footprint Tests With Mocks", function() {
	var flightsFootprintCore;
	var MockFlightData = {};
	beforeAll(function() {
		flightsFootprintCore = new FlightsFootprintCore();

		//Sample airports data
		MockFlightData.airportsData = {
			"DEL": {
				"lat": 28.566499710083008,
				"lon": 77.10310363769531
			},
			"NYC":{
		    "lat": 40.730610,
		    "lon": -73.935242
		  },
			"BOM": {
				"lat": 19.0886993408,
				"lon": 72.8678970337
			},
			"LKO": {
				"lat": 26.7605991364,
				"lon": 80.8892974854
			},
			"DUB": {
				"lat": 53.42129898071289,
				"lon": -6.2700700759887695
			}
		};

		//Sample Airplanes data
		MockFlightData.airplanesData = {
			"distances": [125, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 10500, 11000, 11500, 12000],
			"A380": {
				"fuel": [
					5851,
					12016,
					17623,
					24940,
					32211,
					46695,
					61160,
					75638,
					90143,
					104681,
					119255,
					133865,
					148512,
					163196,
					177916,
					192517,
					203465,
					214166,
					224632
				],
		    "capacity": 853,
		    "capacityTwoClass": 500
			}
		};
		//removing console output
		console.log = function () {};

	});
	flightData = MockFlightData;

  it("Get Distance should return 2.9877268824052208 for a set of coordinates 23.8139891,86.4411183 and 23.8207305,86.4695494", function() {
    lat1 = 23.8139891;
    lon1 = 86.4411183;
    lat2 = 23.8207305;
    lon2 = 86.4695494;
	var result = 2.9877268824052208;

	expect(flightsFootprintCore.getDistance(lat1, lon1, lat2, lon2)).toBe(result);
	});

  it("Get Coordinates should return coordinates of airports for a list objects containing IATA airport codes", function() {
    var airports = [{
        depart: "DEL",
        arrive: "NYC",
        stops: ["BOM"]
      },
	  {
        depart: "LKO",
        arrive: "DUB",
        stops: []
	  }
    ];
	var result = [{
		depart: "DEL",
        arrive: "NYC",
        stops: ["BOM"],
		departCoordinates: {
			lat: 28.566499710083008,
			lon: 77.10310363769531
		},
		arriveCoordinates: {
			lat: 40.73061,
			lon: -73.935242
		},
		stopCoordinatesNew: [{
			lat: 19.0886993408,
			lon: 72.8678970337
		}]
	},
	{
		depart: 'LKO',
		arrive: 'DUB',
		stops: [],
		departCoordinates: {
			lat: 26.7605991364,
			lon: 80.8892974854
		},
		arriveCoordinates: {
			lat: 53.42129898071289,
			lon: -6.2700700759887695
		},
		stopCoordinatesNew: []
	}];

	expect(flightsFootprintCore.getCoordinates(airports)).toEqual(result);
	});

  it("Convert Fuel to CO2 should return objects containing CO2 emission for corresponding amount of fuel used and airplane model", function() {
	var fuel = [{
		fuel: 10000,
		aircraft: "A380"
	},
	{
		fuel: 50000,
		aircraft: "A380"
	},
	{
		fuel: 100000,
		aircraft: "A380"
	},
	{
		fuel: 1000,
		aircraft: "A380"
	}]
	var result = [{
		economy: 37,
		business: 63,
		average: 50
	},
	{
		economy: 185,
		business: 316,
		average: 250
	},
	{
		economy: 370,
		business: 632,
		average: 501
	},
	{
		economy: 3,
		business: 6,
		average: 4
	}];
	for(var x = 0; x < fuel.length; x++){
		expect(flightsFootprintCore.convertFuelToCO2(fuel[x].fuel, fuel[x].aircraft)).toEqual(result[x]);
	}
	});

  it("Get Emission should return array of objects containing CO2 emission for an array of objects containing aircraft model and distance of flight", function() {
	var distanceAircraft = [{
		distance: 2500,
		aircraft: "A380"
	},
	{
		distance: 4000,
		aircraft: "A380"
	},
	{
		distance: 7000,
		aircraft: "A380"
	},
	{
		distance: 500,
		aircraft: "A380"
	}]
	var result = [{
		distance: 2500,
		aircraft: "A380",
		co2Emission: {
			economy: 156,
			business: 267,
			average: 211
		}
	},
	{
		distance: 4000,
		aircraft: "A380",
		co2Emission: {
			economy: 243,
			business: 415,
			average: 329
		}
	},
	{
		distance: 7000,
		aircraft: "A380",
		co2Emission: {
			economy: 418,
			business: 713,
			average: 565
		}
	},
	{
		distance: 500,
		aircraft: "A380",
		co2Emission: {
			economy: 46,
			business: 78,
			average: 62
		}
	}];
	for(var x = 0; x < distanceAircraft.length; x++){
		expect(flightsFootprintCore.getEmission(distanceAircraft)).toEqual(result);
	}
	});

  	it("Get Total Distance should return array of objects containing ditance for array of objects containing coordinates", function() {
    coords = [{
    	departCoordinates: {
    		lat: 28.566499710083008,
			lon: 77.10310363769531
    	},
    	arriveCoordinates: {
    		lat: 53.42129898071289,
			lon: -6.2700700759887695
    	},
    	stopCoordinatesNew: []
    },
    {
    	departCoordinates: {
    		lat: 26.7605991364,
			lon: 80.8892974854
    	},
    	arriveCoordinates: {
    		lat: 19.0886993408,
			lon: 72.8678970337
    	},
    	stopCoordinatesNew: [{
    		lat: 28.566499710083008,
			lon: 77.10310363769531
    	}]
    },
    {
    	departCoordinates: {
    		lat: 26.7605991364,
			lon: 80.8892974854
    	},
    	arriveCoordinates: {
    		lat: 28.566499710083008,
			lon: 77.10310363769531
    	},
    	stopCoordinatesNew: [{
    		lat: 53.42129898071289,
			lon: -6.2700700759887695
    	},
    	{
    		lat: 19.0886993408,
			lon: 72.8678970337
    	}]
    }
    ];
	var result = coords;
	result[0].distance =  7073.704336353663;
	result[1].distance =  1561.7050674270845;
	result[2].distance =  16209.02516678047;
	expect(flightsFootprintCore.getTotalDistance(coords)).toEqual(result);
	});
});
