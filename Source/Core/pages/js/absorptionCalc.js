/**
* Sources:
* Absorption Calculator: 
* https://www.waset.org/downloads/presentations/14/estimation-of-carbon-uptake-of-seoul-city-street-trees-in-seoul-and-plans-for-increase-carbon-uptake-by-improving-species.pdf
* http://www.toronto.ca/legdocs/mmis/2014/pe/bgrd/backgroundfile-70898.pdf
* https://www.reference.com/science/much-co2-human-exhale-3f8cfdd9076c129#
*/

var absorptionForm = {
	treeStats : {},
	emissionRate : 0.255384,
	timeString : function(days) {
		var str = '';
		// Map lengths of `days` to different time periods
		var values = [[' year', 525600], [' month', 43200], [' day', 1440],[' hour', 60],[' min', 1]];
		// Iterate over the values...
		for (var i=0;i<values.length;i++) {
		    var amount = Math.floor(days / values[i][1]);
		    // ... and find the largest days value that fits into the days
		    if (amount >= 1) {
		        // If we match, add to the string ('s' is for pluralization)
		    	str += amount + values[i][0] + (amount > 1 ? 's' : '') + ' ';
		        // and subtract from the days
		    	days -= amount * values[i][1];
		    }
		}
		return str;
	},

	submit : function(form) {
		var data = $('#absorptionForm').serializeObject();
		// console.log(data);
		var emission = data.emission,
		unit = $('#emissionUnit option:selected').text();
		if(data.unitSystem != "metric") {
			emission *= 0.453592;	
		}
		//Get the absorption time in days
		var tree = data.treeType;
		var treeDays = ( emission * 525600 ) / form.treeStats[tree];
		//time in years, months, days for absorpton of given CO2
		var timeStr = 'It will take <b>' + form.timeString(treeDays) + '</b>for a <b>' + tree + '</b> tree to absorb <b>' + data.emission + ' ' + unit + '</b> of CO<sub>2</sub>.';

		var respDays = ( emission / 1.04326 ) * 24 * 60;
		var respStr = 'The same amount of CO<sub>2</sub> will be produced by a human (through respiration) in <b>' + form.timeString(respDays) + '</b>.';

		//gets distance in kilometers
		var distance = emission / form.emissionRate;
		var distUnit = 'km';
		if(data.unitSystem != "metric") {
			//conver to miles
			distance *= 0.621371; 
			distUnit = 'miles';
		}
		var carStr = 'Also, a car would have to travel <b>' + distance + ' ' + distUnit + '</b> to produce <b>' + data.emission + ' ' + unit + '</b> of CO<sub>2</sub>.';
		// console.log(timeStr, respStr, carStr);
		$('#outputAbsorption').html(timeStr + '<br>' + respStr + '<br>' + carStr );
	},

	init : function() {
		// Load tree data
	    var form = this;
		$.getJSON(browserServices.getFilePath('/core/resources/trees.json'), function(response) {
	    	// console.log(response);
	    	form.treeStats = response.treeData;
	    	for (var key in form.treeStats) {
	    		$('#treeType').append('<option value="' + key + '">' + key + '</option>');
	    	}
	    	$('#absorptionFormSubmit').on("click",function(){
	    		form.submit(form);
	    	});
	  	});
	  	browserServices.getStorage('calculationObject', function(data) {
			form.emissionRate = data['calculationObject']['CO2emissionRate'] || 0.255384;
		});	
	},
}

absorptionForm.init();