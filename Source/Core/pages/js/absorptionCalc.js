/**
 * Sources:
 * Absorption Calculator:
 * https://www.waset.org/downloads/presentations/14/estimation-of-carbon-uptake-of-seoul-city-street-trees-in-seoul-and-plans-for-increase-carbon-uptake-by-improving-species.pdf
 * http://www.toronto.ca/legdocs/mmis/2014/pe/bgrd/backgroundfile-70898.pdf
 * https://www.reference.com/science/much-co2-human-exhale-3f8cfdd9076c129#
 */

var absorptionForm = {
  treeStats: {},
  emissionRate: 0.255384,
  timeString: function(mins) {
    var str = '';
    // Map lengths of `mins` to different time periods
    var values = [
      [' year', 525600],
      [' month', 43200],
      [' day', 1440],
      [' hour', 60],
      [' min', 1]
    ];
    // Iterate over the values...
    for (var i = 0; i < values.length; i++) {
      var amount = Math.floor(mins / values[i][1]);
      // ... and find the largest mins value that fits into the mins
      if (amount >= 1) {
        // If we match, add to the string ('s' is for pluralization)
        str += amount + values[i][0] + (amount > 1 ? 's' : '') +
          ' ';
        // and subtract from the mins
        mins -= amount * values[i][1];
      }
    }
    return str;
  },

  submit: function(form) {
    var data = $('#absorptionForm').serializeObject();
    // console.log(data);
    var emission = (data.unitSystem != 'metric' ? 0.453592 : 1) *
      data.emission,
      unit = $('#emissionUnit option:selected').text();

    var tree, treeRate;

    if ($('#customTreeCheckbox').is(':checked')) {
      // Conversion for height in feets and diameter in inches
      var height = (data.unitSystem == 'metric' ? 3.28084 : 1) *
        data.treeHeight,
        diameter = (data.unitSystem == 'metric' ? 0.393701 : 1) *
        data.treeDiameter,
        age = data.treeAge;

      var weight = (diameter >= 11 ? 0.15 : 0.25) * height *
        diameter *
        diameter;

      tree = 'given custom';

      /**
       * CO2 Sequestered by tree till its current age
       * Tree mass (kg of fresh biomass) x 120% (Weight below ground) x
           72.5% (dry mass) x 50% (carbon %) x 3.67 * LBS_to_KG
       * Avg. CO2 sequestered per year = CO2 sequestered / Age
       */
      treeRate = weight * 1.2 * 0.725 * 0.5 * 3.67 * 0.453592 /
        age;
    } else {
      //Get the absorption time in days
      tree = data.treeName;
      treeRate = form.treeStats[tree];
    }

    var treeMins = (emission * 525600) / treeRate;
    //time in years, months, days for absorpton of given CO2
    var timeStr = 'It will take <b>' + form.timeString(treeMins) +
      '</b>for a <b>' + tree + '</b> tree to absorb <b>' + data.emission +
      ' ' + unit + '</b> of CO<sub>2</sub>.';

    var respMins = (emission / 1.04326) * 24 * 60;
    var respStr =
      'The same amount of CO<sub>2</sub> will be produced by a human ' +
      '(through respiration) in <b>' + form.timeString(respMins) + '</b>.';

    //gets distance in kilometers
    var distance = emission / form.emissionRate;
    var distUnit = 'km';
    if (data.unitSystem != 'metric') {
      //conver to miles
      distance *= 0.621371;
      distUnit = 'miles';
    }
    var carStr = 'Also, a car would have to travel <b>' +
      distance.toFixed(
        2) + ' ' + distUnit + '</b> to produce <b>' + data.emission +
      ' ' +
      unit + '</b> of CO<sub>2</sub>.';
    // console.log(timeStr, respStr, carStr);
    $('#outputAbsorption').html(timeStr + '<br>' + respStr +
      '<br>' +
      carStr);
  },

  init: function() {
    // Load tree data
    var form = this;
    $.getJSON(browserServices.getFilePath(
        '/core/resources/trees.json'),
      function(response) {
        // console.log(response);
        form.treeStats = response.treeData;
        for (var key in form.treeStats) {
          $('#treeName').append('<option value="' + key + '">' +
            key +
            '</option>');
        }
        $('#absorptionFormSubmit').on('click', function() {
          form.submit(form);
        });
      });
    browserServices.getStorage('calculationObject', function(data) {
      form.emissionRate = data['calculationObject'][
          'CO2emissionRate'
        ] ||
        0.255384;
    });
    $('#customTreeCheckbox').change(function() {
      if ($(this).is(':checked')) {
        $('#customTreeInput').show();
        $('#treeName').prop('disabled', true);
      } else {
        $('#customTreeInput').hide();
        $('#treeName').prop('disabled', false);
      }
      $('.outputDiv').html('');
    });
  }
};

absorptionForm.init();
