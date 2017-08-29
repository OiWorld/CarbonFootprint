describe("Basic inform.js Tests With Mocks", function() {
	var serviceManagerMock, resultMock = {}
	beforeAll(function() {

		//mock for result
		var result = {}
		result.data = {}
		result.data.id = {}
		result.data.id.someKey = {}
		result.data.id.someKey.active = false;
		result.data.id.someKey.regex = 'https:\/\/www.w3schools.com\/jsref*';
		resultMock = result;

		//mock for service manager
		var serviceManager = {
			update: function() {}
		};
		serviceManagerMock = serviceManager;
	});

	it("cb should return true", function() {
		expect(cb(resultMock, serviceManagerMock)).toBe(true);
	});

});
