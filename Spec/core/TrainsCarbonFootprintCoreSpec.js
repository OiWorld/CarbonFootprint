describe("Basic Trains Carbon Footprint Core Tests", function() {
	var trainsFootprintCore;
	beforeAll(function() {

		trainsFootprintCore = new TrainsFootprintCore(undefined, undefined);

		//removing console output
		console.log = function () {};

	});

	//fake distance between stations
	distanceBetween = 100;

  it("Get Distance should return 2.9877268824052208 for a set of coordinates 23.8139891,86.4411183 and 23.6770923,85.138333", function() {
    lat1 = 23.8124987;
    lon1 = 86.4411183;
    lat2 = 23.6770923;
    lon2 = 85.138333;
	var result = 150.02016313198786;

	expect(trainsFootprintCore.getDistance(lat1, lon1, lat2, lon2)).toBe(result);
	});

  it("Convert To Train Distance should return [100, 500, 1000, 2000] for distances in [102.89000000000001, 666.45, 1370.9, 2779.8]", function() {
    var distances = [100, 500, 1000, 2000];
	var result = [102.89000000000001, 666.45, 1370.9, 2779.8];

	for(var i = 0; i < distances.length; i++){
		expect(trainsFootprintCore.convertToTrainDistance(distances[i])).toBe(result[i]);
	}
	});
});
