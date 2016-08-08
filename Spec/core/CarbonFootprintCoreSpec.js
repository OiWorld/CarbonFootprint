/**
 * Created by Kolpa on 29.05.2016.
 */

describe("Basic Carbon Footprint Core Tests With Mocks", function() {
	var carbonFootprintCore;

	beforeAll(function() {
		//removing console output
		console.log = function () {};

		// Mocking the settings provider
		var MockSettingsProvider = function () {};

		// Fake Carbon Emission of 20
		MockSettingsProvider.prototype.getCarbonEmission = function () {
			return 20;
		}

		// Fake Carbon unit of gramms
		MockSettingsProvider.prototype.getCarbonEmissionUnit = function() {
    		return 'g';
		};

		//Fake Travel Rate of 30
		MockSettingsProvider.prototype.getTravelRate = function () {
    		return 30;
		};

		//Fake Showing the travel Rate
		MockSettingsProvider.prototype.showTravelCost = function () {
    		return true;
		};

		var settingsProvider = new MockSettingsProvider();

		carbonFootprintCore  = new CarbonFootprintCore(settingsProvider);
	});

	it("Compute Footprint should return [400, 200, 10000, 100000] for a list of [20, 10, 500, 5000] distances and a carbon emission of 20", function() {
		var distances = [20, 10, 500, 5000];
		var results = [400, 200, 10000, 100000];

		for (var i = 0; i < distances.length; i++) {
			expect(carbonFootprintCore.computeFootprint(distances[i])).toBe(results[i]);
		}
	});

	it("Compute Trees should return [0, 0, 1, 6] for a list of [200, 100, 5000, 50000] footprints and a tree growth per year of 8300", function() {
		var footprints = [200, 100, 5000, 50000];
		var results = [24, 12, 602, 6024];

		for (var i = 0; i < footprints.length; i++) {
			expect(carbonFootprintCore.computeTrees(footprints[i])).toBe(results[i]);
		}
	});

});