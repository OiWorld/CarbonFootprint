/**
* Sources:
* Calories Calculator: http://www.ilovebicycling.com/how-many-calories-do-you-burn-when-cycling/
* Benfits Source:
* http://www.sustrans.org.uk/what-you-can-do/use-your-car-less/walking
* http://www.tmr.qld.gov.au/Travel-and-transport/Cycling/Benefits.aspx
* http://www.sustrans.org.uk/what-you-can-do/use-your-car-less/health-benefits-walking-and-cycling
* http://livehealthy.chron.com/sedentary-lifestyle-calorie-intake-3186.html
*/

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// $('#caloriesFormSubmit').click(function(){
// 	var data = $('#caloriesForm').serializeObject();
// 	var time = +data.unitVal;
// 	if(data.unitSystem == "metric") {
// 		data.speed *= 0.621371;
// 		data.weight *= 2.20462;
// 		if( data.unit == "distance" ) {
// 			data.unitVal *= 0.621371;
// 			time = data.unitVal/data.speed;
// 		}
// 	}
	
// 	if( data.speed <= 0 || data.weight <= 0 || time <=0 ) {
// 		alert("Invalid Data! Negative and Zero value not possible.");
// 		return;
// 	}

// 	var caloriesPerHour ;
// 	if( data.mode == "cycling" ) {
// 		if(data.speed < 5.5) {
// 			alert("Speed for cycling should be greater than 5.5mph !");
// 			return;
// 		}
// 		caloriesPerHour = (((data.weight - 130)/75) * ((34*data.speed) - 135)) + ((59*data.speed)-236);
// 	}
// 	else {
// 		caloriesPerHour = (((data.weight - 130)/75) * ((54.45*data.speed) + 13.65)) + ((94.3*data.speed)+24.6);
// 	}
// 	var caloriesBurnt = caloriesPerHour * time;
	
// 	$('#outputCalories').html('Congratulations! You have burnt <b>' + caloriesBurnt + ' Calories</b>.<br>'
// 		+ ' Moreover, a sedentary women require 1,600 to 2,000 calories a day, while'
// 		+ ' sedentary men need about 2,000 to 2,600 calories daily to maintain their current weight. ');

// });

// (function(){

// })();




var caloriesForm = {

	submit: function(form) {
		var data = $('#caloriesForm').serializeObject();
		var time = +data.unitVal;
		if(data.unitSystem == "metric") {
			data.speed *= 0.621371;
			data.weight *= 2.20462;
			if( data.unit == "distance" ) {
				data.unitVal *= 0.621371;
				time = data.unitVal/data.speed;
			}
		}
		
		if( data.speed <= 0 || data.weight <= 0 || time <=0 ) {
			alert("Invalid Data! Negative and Zero value not possible.");
			return;
		}

		var caloriesPerHour ;
		if( data.mode == "cycling" ) {
			if(data.speed < 5.5) {
				alert("Speed for cycling should be greater than 5.5mph !");
				return;
			}
			caloriesPerHour = (((data.weight - 130)/75) * ((34*data.speed) - 135)) + ((59*data.speed)-236);
		}
		else {
			caloriesPerHour = (((data.weight - 130)/75) * ((54.45*data.speed) + 13.65)) + ((94.3*data.speed)+24.6);
		}
		var caloriesBurnt = caloriesPerHour * time;
		
		$('#outputCalories').html('Congratulations! You have burnt <b>' + Math.round(caloriesBurnt) + ' Calories</b>.<br>'
			+ ' Moreover, a sedentary women require 1,600 to 2,000 calories a day, while'
			+ ' sedentary men need about 2,000 to 2,600 calories daily to maintain their current weight. ');
	},

	init : function() {
		chrome.storage.sync.get('calculationObject', function(data) {
			var unitSystem = data['calculationObject']['unitSystem'] || 'metric';
			$('input:radio[name="unitSystem"]').filter('[value=' + unitSystem + ']').click();
		});	

		$('input:radio[name="unitSystem"]').change(function(){
			var unit = $(this).val();
			$('input:radio[name="unitSystem"]').filter('[value=' + unit + ']').click();
			$('input:radio[name="unit"]').filter('[value="distance"]').prop("checked", true);
			$('#unitSel').val( unit ).prop('disabled', true);
			$('.form-unit').val( unit );
		});

		$('#caloriesForm input:radio[name="unit"]').change(function(){
			if( $(this).val() == "distance" ) {
				$('.timeOpt').hide();
				$('.distanceOpt').show();
				$('#unitSel').val( $('input:radio[name="unitSystem"]').val() ).prop('disabled', true);
			}
			else {
				$('.timeOpt').show();
				$('.distanceOpt').hide();
				$('#unitSel').val('hour').prop('disabled', false);
			}
		});

		$('#caloriesForm input[value="time"]').click();
		$('.close-modal').click(function(){
			$('.outputDiv').html('');
		})
		var form = this;
		$('#caloriesFormSubmit').on("click",function(){
	    		form.submit(form);
	    });
	},
}

caloriesForm.init();