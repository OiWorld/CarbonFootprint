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

		//Fake CH4 Emission Rate
		MockSettingsProvider.prototype.getCH4Emission = function () {
			return 10;
		}

		//Fake GHG emission Rate
		MockSettingsProvider.prototype.getGHGEmission = function () {
			return 5;
		}

		//Fake NO2 emission Rate
		MockSettingsProvider.prototype.getN2OEmission = function () {
			return 20;
		}

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

	it("Compute Trees should return [24.1, 12.05, 602.41, 6024.1] for a list of [200, 100, 5000, 50000] footprints and a tree growth per year of 8300", function() {
		var footprints = [200, 100, 5000, 50000];
		var results = [24.1, 12.05, 602.41, 6024.1];

		for (var i = 0; i < footprints.length; i++) {
			expect(carbonFootprintCore.computeTrees(footprints[i])).toBe(results[i]);
		}
	});

	//travel cost check
	it("Compute Travel Cost should return [6000, 3000, 150000, 1500000] for a list of [200, 100, 5000, 50000] distances and a default travel cost of 30", function() {
		var distances = [200, 100, 5000, 50000];
		var results = [6000, 3000, 150000, 1500000];

		for (var i = 0; i < distances.length; i++) {
			expect(carbonFootprintCore.computeTravelCost(distances[i])).toBe(results[i]);
		}
	});

	//Other gases string
	it("Compute Other Gases String should return value in resuls for a list of [200,100,1700,20] and a CH4,NO2 and GHG value of 10,20,5", function() {
		var distances = [200,100,1700,20];
		var results = ["CH₄: 2000000.000g CO₂e,  N₂O: 4000000.000g CO₂e,  GHG: 1000.000kg CO₂e\n",
									"CH₄: 1000000.000g CO₂e,  N₂O: 2000000.000g CO₂e,  GHG: 500.000kg CO₂e\n",
									"CH₄: 17000000.000g CO₂e,  N₂O: 34000000.000g CO₂e,  GHG: 8500.000kg CO₂e\n",
									"CH₄: 200000.000g CO₂e,  N₂O: 400000.000g CO₂e,  GHG: 100.000kg CO₂e\n"];
		for (var i = 0; i < distances.length; i++) {
			expect(carbonFootprintCore.otherGasesString(distances[i])).toEqual(results[i]);
		}
	});

});
