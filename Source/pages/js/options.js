/**
 * script for options page
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

var options = {};

/**
 * defines initial unit system
 */

options.units = {
  m: 'kg',
  v: 'L',
  d: 'km',
  e: 'kWh'
};

/**
 * 1 Imperial Gallon to Litres
 * @const
 */

options.IMPGAL_TO_L = 4.54609;

/**
 * 1 US Gallon to Litres
 * @const
 */

options.USGAL_TO_L = 3.785411784;

/**
 * 1 Mile to Kilometers
 * @const
 */

options.MI_TO_KM = 1.609344;

/**
 * 1 Kilogram to Pounds
 * @const
 */

options.KG_TO_LBS = 2.204622621848775;

/**
 * Validates and Saves data provided by user
 */

options.saveOptions = function() {
  var distance = parseFloat($('#distance-value').val());
  var fuel = parseFloat($('#fuel-value').val());
  var co = parseFloat($('#emission').val());
  var cost = parseFloat($('#fuel-cost').val());
  var curr = $('#currency-codes').val();
  var lastCheckup = $('#last-checkup').val();
  var nextCheckupYear = parseInt($('#next-checkup-year').val());
  var nextCheckupMonth = parseInt($('#next-checkup-month').val());
  var consumption;
  options.data.set('co', co);
  options.data.set('distance', distance);
  options.data.set('fuel', fuel);
  options.data.set('fuelType', options.fType);
  options.data.set('unitSystem', $('.save>:checkbox:checked').attr('id'));
  options.data.set('inputType', $('.inputType>:checkbox:checked').attr('id'));
  options.data.set('units', options.units);
  options.data.set('inputSource', $('.tab>>:checkbox:checked').attr('id'));
  options.data.set('fuelCost', {
    value: cost,
    curr: curr
  });
  options.data.set('emissionDisplayUnit', $('#emission-unit-mass').val());
  switch (options.data.get('inputSource')) {
    // co in kg/km always
    // consumption in (L/kg/kWh)/km always
  case 'by-fuel-consumption':
    if (distance <= 0 || fuel <= 0) {
      options.showMessage('error', 'error');
      return;
    }
    consumption = fuel / distance;
    //normalising consumption to (L/kg/kWh)/km for all cases
    if(options.data.get('unitSystem') == 'uscustomary' ||
       options.data.get('unitSystem') == 'imperial'){
      if(options.fuels[options.fType].measuredBy=='v'){
        if (options.data.get('unitSystem') == 'uscustomary') {
          consumption *= options.USGAL_TO_L / options.MI_TO_KM;
        }
        else {
          consumption *= options.IMPGAL_TO_L / options.MI_TO_KM;
        }
      }
      else if(options.fuels[options.fType].measuredBy=='m'){
        consumption /= (options.MI_TO_KM * options.KG_TO_LBS);
      }
      else if(options.fuels[options.fType].measuredBy=='e'){
        consumption /= options.MI_TO_KM;
      }
    }
    co = consumption * options.fuels[options.fType].CO2Emission;
    break;
  case 'direct-co-emission':
    if (co <= 0) {
      options.showMessage('error', 'error');
      return;
    }
    //normalising co to kg/km for all cases
    if(options.data.get('unitSystem') == 'uscustomary' ||
       options.data.get('unitSystem') == 'imperial'){
      co /= (options.KG_TO_LBS * options.MI_TO_KM);
    }
    consumption = co / options.fuels[options.fType].CO2Emission;
    break;
  }
  options.data.set('emissionRate', co);
  options.data.set('consumptionRate', consumption);
  options.data.set('showTravelCost',
                  document.getElementById('display-travel-cost').checked
                  );
  if (options.data.get('showTravelCost')) {
    if (cost <= 0) {
      options.showMessage('error', 'error');
      return;
    }
    else {
      options.data.set('travelRate', consumption * cost);
    }
  }

  options.data.set('showCheckupNotification',
                  document.getElementById('display-checkup-notify').checked
                  );
  if (options.data.get('showCheckupNotification')) {
    var lastCheckupDate = new Date(lastCheckup);

    var nextCheckupDate = lastCheckupDate.addMonths(nextCheckupMonth);
    nextCheckupDate = lastCheckupDate.addYears(nextCheckupYear);

    options.data.set('lastCheckup', lastCheckup);
    options.data.set('nextCheckupMonth', nextCheckupMonth);
    options.data.set('nextCheckupYear', nextCheckupYear);

    options.setAlarm(nextCheckupDate);
  } else {
    chrome.alarms.clear('CarCheckupAlarm');
  }

  options.showMessage('saved', 'good');
  options.storeData();
};

/**
 * Set the CarCheckupAlarm to a given Interval
 * @param {date} time
 */

options.setAlarm = function(time) {
  //milliseconds between now and the next check
  var diffMillis = Math.abs(new Date() - time);
  //minutes between now and the next checkup
  var diffMinutes = Math.floor((diffMillis / 1000) / 60);

  chrome.alarms.create('CarCheckupAlarm', {
    delayInMinutes: diffMinutes,
    periodInMinutes: diffMinutes
  });
};

/**
 * Shows status in #message
 * @param {string} msgcode
 * @param {string} type
 */

options.showMessage = function(msgcode, type) {
  var status = $('#message');
  switch (type) {
  case 'error':
    status
      .html(chrome.i18n.getMessage(msgcode))
      .css('display', 'block')
      .css('background-color', '#fb5151');
    break;
  case 'good':
    status
      .html(chrome.i18n.getMessage(msgcode))
      .css('display', 'block')
      .css('background-color', '#a6ff4d');
    setTimeout(function() {
      status.css('display', 'none');
    }, 1200);
    break;
  }
};

/**
 * Stores data if data validates
 */

options.storeData = function() {
  options.data.set('init', true);
  options.data.store();
};

/**
 * Saves user location based on coordinates
 * provided by navigator.geolocation
 */

options.saveLocation = function() {
  var geoData = {},
      city = 'locality,political',
      country = 'country,political',
      state = 'administrative_area_level_1,political',
      gc = new google.maps.Geocoder();
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude,
        lng = position.coords.longitude,
        latlng = new google.maps.LatLng(lat, lng);
    gc.geocode({'latLng': latlng}, function(results, status) {
      var addComps = results[0].address_components;
      for (var i = 0; i < addComps.length; i++) {
        if (addComps[i].types == city ||
           addComps[i].types == state ||
           addComps[i].types == country) {
          geoData[addComps[i].types[0]] = addComps[i].long_name;
          geoData[addComps[i].types[0] + '_short'] = addComps[i].short_name;
        }
      }
      $('#reLocation').show();
      options.data.set('geoData', geoData);
      options.data.set('renPer',
                      {'wiki': options.countries[options.data
                                 .get('geoData')
                                 .country_short]
                       .RenewablePer});
      $('#green-electricity input').val(options.data.get('renPer').wiki);
      $('#location')
        .html((options.data.get('geoData')
               .locality + ', ' + options.data.get('geoData')
               .administrative_area_level_1 + ', ' + options.data.get('geoData')
               .country).replace(/ undefined,/g, ''));
      $('#currency-codes')
        .val(
          options.countries[options.data.get('geoData').country_short].currency
        );
      options.data.store();
    });
  });
};

/**
 * Loads data that is already been saved by user
 */

options.loadSavedData = function() {
  //if not saved once
  if (options.data.has('geoData')) {
    $('#green-electricity input').val(options.data.get('renPer').wiki);
    $('#location').html((options.data.get('geoData')
                         .locality + ', ' + options.data.get('geoData')
                         .administrative_area_level_1 + ', ' + options.data
                         .get('geoData').country).replace(/ undefined,/g, ''));
    $('#reLocation').show();
    $('#currency-codes')
      .val(options
           .countries[options.data.get('geoData').country_short].currency);
  }
  options.fType = $('#fuel-type').val();
  //restore only if values were saved once
  if (options.data.has('init')) {
    $('[id="fuel-type"]').val(options.data.get('fuelType'));
    options.fType = $('#fuel-type').val();
    $('#fuel-cost').val(options.data.get('fuelCost').value);
    $('#currency-codes').val(options.data.get('fuelCost').curr);
    $('#distance-value').val(options.data.get('distance'));
    $('#fuel-value').val(options.data.get('fuel'));
    $('#emission').val(options.data.get('co'));
    $('#last-checkup').val(options.data.get('lastCheckup'));
    $('#next-checkup-month').val(options.data.get('nextCheckupMonth'));
    $('#next-checkup-year').val(options.data.get('nextCheckupYear'));
    options.fType = $('#fuel-type').val();
    if (options.data.get('showTravelCost')) {
      $('#display-travel-cost').attr('checked', true);
      options.toggleTravelCost($('#display-travel-cost'));
    }
    if (options.data.get('showCheckupNotification')) {
      $('#display-checkup-notify').attr('checked', true);
      options.toggleCheckupNotification($('#display-checkup-notify'));
    }
    $('#' + options.data.get('inputSource')).attr('checked', true);
    options.toggleInputSource($('#' + options.data.get('inputSource')));
    $('#' + options.data.get('unitSystem')).attr('checked', true);
    options.toggleUnits($('#' + options.data.get('unitSystem')));
  }
};

/**
 * switches tabs in main view
 * @param {Element} elem
 */

options.switchTab = function(elem) {
  $('.tab-button.selected').removeClass('selected');
  elem.addClass(' selected');
  $('.tab.open').removeClass('open');
  $('.tab:nth-child(' + ($('.tab-button.selected').index() + 1) + ')')
    .addClass('open');
};

/**
 * Toggles the input source (co2 emission/fuel consumption)
 * @param {Element} elem
 */

options.toggleInputSource = function(elem) {
  if (elem.prop('id') === 'by-fuel-consumption') {
    if (elem.prop('checked')) {
      $('#direct-co-emission').prop('checked', false);
      $('.by-fuel input,.by-fuel select').prop('disabled', false);
      $('.by-co input,.by-co select').prop('disabled', true);
      if (options.data.has('init')) {
        $('#' + options.data.get('inputType')).prop('checked', true);
        options.toggleInputType($('#' + options.data.get('inputType')));
      }else {
        options.toggleInputType($('.inputType>:checkbox:checked'));
      }
      $('.cost-fields :eq(0)').hide();
    }
    else {
      elem.prop('checked', true);
    }
  }
  if (elem.prop('id') === 'direct-co-emission') {
    if (elem.prop('checked')) {
      $('#by-fuel-consumption').prop('checked', false);
      $('.by-fuel input,.by-fuel select').prop('disabled', true);
      $('.by-co input,.by-co select').prop('disabled', false);
      $('.cost-fields :eq(0)').show();
    }
    else {
      elem.prop('checked', true);
    }
  }
};

/**
 * Toggles the input type (efficiency/consumption/custom)
 * @param {Element} elem
 */

options.toggleInputType = function(elem) {
  if (elem.prop('id') === 'fuel-efficiency') {
    if (elem.prop('checked')) {
      $('#fuel-value').val(1).prop('disabled', true);
      $('#distance-value').prop('disabled', false);
      $('#fuel-consumed-per').prop('checked', false);
      $('#custom-values').prop('checked', false);
      $('#usage-message').html(chrome.i18n.getMessage('feMessage'));
    }
    else {
      elem.prop('checked', true);
    }
  }
  else if (elem.prop('id') === 'fuel-consumed-per') {
    if (elem.prop('checked')) {
      $('#distance-value').val(100).prop('disabled', true);
      $('#fuel-value').prop('disabled', false);
      $('#fuel-efficiency').prop('checked', false);
      $('#custom-values').prop('checked', false);
      $('#usage-message').html(chrome.i18n.getMessage('fcpMessage'));
    }
    else {
      elem.prop('checked', true);
    }
  }
  else {
    if (elem.prop('checked')) {
      $('#distance-value').prop('disabled', false);
      $('#fuel-value').prop('disabled', false);
      $('#fuel-consumed-per').prop('checked', false);
      $('#fuel-efficiency').prop('checked', false);
      $('#usage-message').html(chrome.i18n.getMessage('cvMessage'));
    }
    else {
      elem.prop('checked', true);
    }
  }
};

/**
 * Toggles travel cost calculation
 * @param {Element} elem
 */

options.toggleTravelCost = function(elem) {
  if (elem.prop('checked')) {
    $('.cost-fields select,.cost-fields input').prop('disabled', false);
  }
  else {
    $('.cost-fields select,.cost-fields input').prop('disabled', true);
  }
};

/**
 * Toggles checkup notification
 * @param {Element} elem
 */

options.toggleCheckupNotification = function(elem) {
  if (elem.prop('checked')) {
    $('#last-checkup,#next-checkup input').prop('disabled', false);
  }
  else {
    $('#last-checkup,#next-checkup input').prop('disabled', true);
  }
};

/**
 * Toggles unit system (metric/us customary/imperial)
 * @param {Element} elem
 */

options.toggleUnits = function(elem) {
  if (elem.prop('id') === 'metric') {
    options.units.m = 'kg';
    options.units.v = 'L';
    options.units.d = 'km';
    if (elem.prop('checked')) {
      $('#uscustomary,#imperial').prop('checked', false);
    }
    else {
      elem.prop('checked', true);
    }
  }
  else {
    if (elem.prop('checked')) {
      options.units.m = 'lbs';
      options.units.v = 'gal';
      options.units.d = 'mi';
      $('#metric').prop('checked', false);
      if (elem.prop('id') === 'uscustomary') {
        $('#imperial').prop('checked', false);
      }
      else {
        $('#uscustomary').prop('checked', false);
      }
    }
    else {
      elem.prop('checked', true);
    }
  }
  $('[id="distance-unit"]')
    .val(options.units.d)
    .html(options.units.d);
  $('#mass-unit').val(options.units.m).html(options.units.m);
  $('[id="fuel-unit"]')
    .val(options.units[options.fuels[options.fType].measuredBy])
    .html(options.units[options.fuels[options.fType].measuredBy]);
  if (options.fuels[options.fType].measuredBy == 'e') {
    $('#green-electricity').show();
  }
  else {
    $('#green-electricity').hide();
  }
};

/**
 * makes change in fuel type reflect in both drop-downs
 * @param {Element} elem
 */

options.mirrorFuelValues = function(elem) {
  options.fType = elem.prop('value');
  $('[id="fuel-type"]').val(options.fType);
  options.toggleUnits($('.save>:checkbox:checked'));
};

/**
 * Loads data from external resources
 */

options.loadResources = function() {
  $.getJSON('/core/resources/fuels.json', function(response) {
    options.fuels = response;
  });
  $.getJSON('/core/resources/currencyCodes.json', function(response) {
    options.currencyCodes = response.currencyCodes;
  });
  $.getJSON('/core/resources/countries.json', function(response) {
    options.countries = response;
  });
  $.getScript('https://maps.googleapis.com/maps/api/js')
    .done(function(){
      if (!options.data.has('geoData')) {
        options.saveLocation();
      }
    });
};


/**
 * Event listeners for the page
 */

options.listeners = function() {
  $('#save-button').on('click', options.saveOptions);
  $('.tab-button').on('click', function() {
    options.switchTab($(this));
  });
  $('#by-fuel-consumption,#direct-co-emission').on('click', function() {
    options.toggleInputSource($(this));
  });
  $('#fuel-efficiency,#fuel-consumed-per,#custom-values')
    .on('click', function() {
      options.toggleInputType($(this));
    });
  $('#display-travel-cost').on('click', function() {
    options.toggleTravelCost($(this));
  });
  $('#display-checkup-notify').on('click', function() {
    options.toggleCheckupNotification($(this));
  });
  $('#metric,#uscustomary,#imperial').on('click', function() {
    options.toggleUnits($(this));
  });
  $('#reLocation').on('click', function() {
    options.saveLocation();
  });
  $('[id="fuel-type"]').on('change', function() {
    options.mirrorFuelValues($(this));
  });
  //Prevents adding Hyphen(-) in the input field.
  $('#distance-value,#emission,#fuel-value,#fuel-cost')
    .on('keypress', function(evtmin) {
      if (evtmin.which === 45) {
        evtmin.preventDefault();
      }
    });
};


/**
 * Initialises the StorageManager
 */

options.initStorageManager = function() {
  options.data = new StorageManager('calculationObject', function() {
    console.log('StorageManager Initialised');
  });
};

/**
 * Populates the drop-down menus from data loaded from external sources
 */

options.populateMenus = function() {
  var i;
  for (i in options.fuels) {
    $('[id="fuel-type"]')
      .append($('<option></option>')
              .val(i)
              .attr('data-language', options.fuels[i].langKey)
             );
  }
  for (i = 0; i < options.currencyCodes.length; i++) {
    $('#currency-codes')
      .append($('<option></option>')
              .html(options.currencyCodes[i])
              .val(options.currencyCodes[i])
             );
  }
};

/**
 * Loads messages for the language specified
 */

options.loadMessages = function() {
  var i;
  for (i = 0; i < $('[data-language]').length; i++) {
    $($('[data-language]')[i])
      .html(chrome.i18n.getMessage($($('[data-language]')[i])
                                   .data('language')));
  }
};

$(document).on('DOMContentLoaded', function() {
  options.listeners();
});

$(document).ajaxComplete(function(event, xhr, settings) {
  options[(/\/(\w*)\./).exec(settings.url)[1] + 'init'] = true;
  if (options.fuelsinit === true &&
     options.currencyCodesinit === true &&
     !options.populated) {
    options.populated = true;
    options.populateMenus();
    options.loadMessages();
  }
  if (options.countriesinit === true) {
    options.loadSavedData();
  }
});

options.initStorageManager();
options.loadResources();

googleAnalytics('UA-1471148-11');
