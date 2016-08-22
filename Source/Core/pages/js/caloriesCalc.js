/**
 * Sources:
 * Calories Calculator:
 * https://www.valdosta.edu/administration/finance-admin/campus-wellness/documents/calorie-and-exercise-burned.pdf
 * http://www.sustrans.org.uk/what-you-can-do/use-your-car-less/walking
 * Benfits Source:
 * http://www.tmr.qld.gov.au/Travel-and-transport/Cycling/Benefits.aspx
 * http://www.sustrans.org.uk/what-you-can-do/use-your-car-less/health-benefits-walking-and-cycling
 * http://livehealthy.chron.com/sedentary-lifestyle-calorie-intake-3186.html
 */

/**
 * @this {formData}
 * @return {object} serialized form data as JSON
 */

$.fn.serializeObject = function() {
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

var caloriesForm = {

  submit: function(form) {
    var data = $('#caloriesForm').serializeObject();
    var time = +data.unitVal;
    // Convert data to US customary
    if (data.unitSystem == 'metric') {
      data.speed *= 0.621371;
      data.weight *= 2.20462;
      if (data.unit == 'distance') {
        data.unitVal *= 0.621371;
        time = data.unitVal / data.speed;
      }
    }
    //  Non-Negative value check
    if (data.speed <= 0 || data.weight <= 0 || time <= 0) {
      alert('Invalid Data! Negative and Zero value not possible.');
      return;
    }

    var caloriesPerHour;
    if (data.mode == 'cycling') {
      if (data.speed < 5.5) {
        alert(
          'Speed for cycling should be greater than 5.5mph or 8.9kph!'
        );
        return;
      }
      /**
       * Equation made from best fit line across two dimension (weight,speed)
       * based of data from sources for cycling
       */
      caloriesPerHour = (((data.weight - 130) / 75) * ((34 * data
        .speed) - 135)) + ((59 * data.speed) - 236);
    } else {
      /**
       * Equation made from best fit line across two dimension (weight,speed)
       * based of data from sources for running/walking
       */
      caloriesPerHour = (((data.weight - 130) / 75) * ((54.45 *
        data.speed) + 13.65)) + ((94.3 * data.speed) + 24.6);
    }
    var caloriesBurnt = caloriesPerHour * time;

    $('#outputCalories').html(
      'Congratulations! You have burnt <b>' + Math.round(caloriesBurnt) +
        ' Calories</b>.<br> Moreover, a sedentary women ' +
        'require 1,600 to 2,000 calories a day, while sedentary men need ' +
        'about 2,000 to 2,600 calories daily to maintain their current weight.'
    );
  },

  init: function() {

    /**
     * Get unitSystem as specified in options page
     */
    browserServices.getStorage('calculationObject', function(data) {
      var unitSystem = data['calculationObject']['unitSystem'] ||
        'metric';
      $('input:radio[name="unitSystem"]').filter('[value=' +
        unitSystem + ']').click();

      // Default time
      $('#caloriesForm input[value="time"]').click();
    });

    /**
     * Handle change in unitSystem selection
     */
    $('input:radio[name="unitSystem"]').change(function() {
      var unit = $(this).val();
      $('input:radio[name="unitSystem"]').filter('[value=' +
        unit + ']').click();
      $('input:radio[name="unit"]').filter(
        '[value="distance"]').prop('checked', true);
      $('#unitSel').val(unit).prop('disabled', true);
      $('.form-unit').val(unit);
    });
    /**
     * Handle change in time/distance radio for calories calc
     */
    $('#caloriesForm input:radio[name="unit"]').change(function() {
      if ($(this).val() == 'distance') {
        $('.timeOpt').hide();
        $('.distanceOpt').show();
        $('#unitSel').val($('input:radio[name="unitSystem"]')
          .val()).prop('disabled', true);
      } else {
        $('.timeOpt').show();
        $('.distanceOpt').hide();
        $('#unitSel').val('hour').prop('disabled', false);
      }
    });

    // Reset form output on close
    $('.close-modal').click(function() {
      $('.outputDiv').html('');
    });

    // Click handler for submit
    var form = this;
    $('#caloriesFormSubmit').on('click', function() {
      form.submit(form);
    });

  }
};

caloriesForm.init();
