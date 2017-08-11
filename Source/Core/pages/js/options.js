/**
 * script for options page
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

var options = {};

/**
 * @const {boolean}
 */

options.isSafari = false;

/**
 * detecting SAFARI browser
 * 'chrom' filters down (chrom)e as well as (chrom)ium
 */

if (!(navigator.userAgent.toLowerCase().indexOf('chrom') != -1)) {
  if (navigator.userAgent.toLowerCase().indexOf('safari') != -1) {
    options.isSafari = true;
    $('head,body').css('font-size', '0.78em');
  }
}

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
  var distance = parseFloat($('#distance-value').val()),
      fuel = parseFloat($('#fuel-value').val()),
      co = parseFloat($('#emission').val()),
      cost = parseFloat($('#fuel-cost').val()),
      curr = $('#currency-codes').val(),
      lastCheckup = $('#last-checkup').val(),
      nextCheckupYear = parseInt($('#next-checkup-year').val()),
      nextCheckupMonth = parseInt($('#next-checkup-month').val()),
      PTCost = parseFloat($('#cities').val()),
      consumption;
  options.data.set('co', co);
  options.data.set('currency', curr);
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
    if (options.data.get('unitSystem') == 'uscustomary' ||
       options.data.get('unitSystem') == 'imperial') {
      if (options.fuels[options.fType].measuredBy == 'v') {
        if (options.data.get('unitSystem') == 'uscustomary') {
          consumption *= options.USGAL_TO_L / options.MI_TO_KM;
        }
        else {
          consumption *= options.IMPGAL_TO_L / options.MI_TO_KM;
        }
      }
      else if (options.fuels[options.fType].measuredBy == 'm') {
        consumption /= (options.MI_TO_KM * options.KG_TO_LBS);
      }
      else if (options.fuels[options.fType].measuredBy == 'e') {
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
    if (options.data.get('unitSystem') == 'uscustomary' ||
       options.data.get('unitSystem') == 'imperial') {
      co /= (options.KG_TO_LBS * options.MI_TO_KM);
    }
    consumption = co / options.fuels[options.fType].CO2Emission;
    break;
  }
  options.data.set('CO2emissionRate', co);
  var CH4emissionRate = options.fuels[options.fType].CH4Emission * consumption;
  options.data.set('CH4emissionRate', CH4emissionRate);
  var N2OemissionRate = options.fuels[options.fType].N2OEmission * consumption;
  options.data.set('N2OemissionRate', N2OemissionRate);
  var GHGemissionRate = options.fuels[options.fType].GHGEmission * consumption;
  options.data.set('GHGemissionRate', GHGemissionRate);

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
    browserServices.clearAlarm('CarCheckupAlarm');
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

  browserServices.createAlarm('CarCheckupAlarm', {
    delayInMinutes: diffMinutes,
    periodInMinutes: diffMinutes
  });
};

/**
 * returns message corresponding to given ID
 * for safari only
 * @param {string} ID
 * @return {string}
 */

options.getMessage = function(ID) {
  return options.messages[ID].message;
};

/**
 * Shows status in #message
 * @param {string} msgcode
 * @param {string} type
 */

options.showMessage = function(msgcode, type) {
  var status = $('#message');
  if (!options.isSafari) {
    browserServices.getLocalisation(msgcode, 0, function(trans, id) {
      switch (type) {
      case 'error':
        status
          .html(trans)
          .css('display', 'block')
          .css('background-color', '#e74c3c');
        break;
      case 'good':
        status
          .html(trans)
          .css('display', 'block')
          .css('background-color', '#27ae60');
        setTimeout(function() {
          status.css('display', 'none');
        }, 1200);
        break;
      }
    });
  }
  else {
    switch (type) {
    case 'error':
      status
        .html(options.getMessage(msgcode))
        .css('display', 'block')
        .css('background-color', '#e74c3c');
      break;
    case 'good':
      status
        .html(options.getMessage(msgcode))
        .css('display', 'block')
        .css('background-color', '#27ae60');
      setTimeout(function() {
        status.css('display', 'none');
      }, 1200);
      break;
    }
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
      console.log("ABOUT TO BEGIN");
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
      $('#reLocation').css('pointer-events', 'auto');
      $('#reLocation').css('animation', 'none');
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
               .country).replace(/ undefined,|undefined,/g, ''));
      options.data.set('currency', options.countries[
        options.data.get('geoData').country_short].currency);
      // Selects the default currency of the user's location
      $('#currency-codes').val(options.data.get('currency'));
      // Update GET PRICE button based on the location and type of fuel
      options.checkFuelPrice();
      options.data.store();
    });
  },
  // If unable to get location
  function(error) {
    console.log(error);
    options.data.set('geoData', null);
    $('#reLocation').css('pointer-events', 'auto');
    $('#reLocation').css('animation', 'none');
    $('#location').html("Unable to retrieve location");
    $('#load-prices-button').prop('disabled', true);
    // Fallback to USD if location is not available
    options.data.set('currency', 'USD');
    $('#currency-codes').val(options.data.get('currency'));
  });
};

/**
 * Loads fuel prices
 */

options.loadFuelPrices = function() {
  var country = options.data.get('geoData');
  if (!country)
    return;
  country = country.country_short;
  console.log(options.settings.fuelPrices, options.settings.exchangeRates);
  var prices = options.settings.fuelPrices[country];
  var exchangeRate = options.settings.exchangeRates[
            $('#currency-codes').val()];
  if (!exchangeRate) {
    exchangeRate = options.defaultRates.rates[
      $('#currency-codes').val()];
  }
  console.log(prices, options.fType, options.settings, exchangeRate);
  if (prices) {
    if (options.fType == 'Diesel') {
      $('#fuel-cost').val((prices.diesel * exchangeRate).toFixed(2));
    }
    else if (options.fType == 'Gasoline' ||
             options.fType == 'Petrol') {
      $('#fuel-cost').val((prices.gasoline * exchangeRate).toFixed(2));
    }
    else if (options.fType == 'LPG' ||
             options.fType == 'CNG') {
      $('#fuel-cost').val((prices.LPG * exchangeRate).toFixed(2));
    }
  }
};

/**
 * Disable the GET PRICE button and change if prices
 * are not available for a selected fuel type
 */

options.checkFuelPrice = function() {
  var country = options.data.get('geoData');
  if (!country){
    $('#load-prices-button').prop('disabled', true);
    return;
  }
  country = country.country_short;
  var prices = options.settings.fuelPrices[country];
  // Set price of petrol same as gasoline
  if(prices.gasoline)
    prices.petrol = prices.gasoline;
  if(prices.LPG)
    prices.CNG = prices.LPG;
  console.log(prices);
  for(var key in prices) {
    if (key.toLowerCase() == options.fType.toLowerCase()) {
      $('#load-prices-button').prop('disabled', false);
      return;
    }
  }
  // GET PRICE button disabled by default
  $('#load-prices-button').prop('disabled', true);
}

/**
 * Loads data that is already been saved by user
 */

options.loadSavedData = function() {
  //if not saved once
  if (options.data.get('geoData')) {
    $('#green-electricity input').val(options.data.get('renPer').wiki);
    $('#location').html((options.data.get('geoData')
                         .locality + ', ' + options.data.get('geoData')
                         .administrative_area_level_1 + ', ' +
                         options.data.get('geoData').country)
                        .replace(/ undefined,|undefined,/g, ''));
    $('#reLocation').css('pointer-events', 'auto');
    $('#reLocation').css('animation', 'none');
    // Selects the saved currency
    $('#currency-codes').val(options.data.get('currency'));
  }
  else {
    $('#reLocation').css('pointer-events', 'auto');
    $('#reLocation').css('animation', 'none');
    $('#location').html("Unable to retrieve location");
    $('#load-prices-button').prop('disabled', true);
    $('#currency-codes').val(options.data.get('currency'));
  }
  options.fType = $('#fuel-type').val();
  //restore only if values were saved once
  if (options.data.has('init')) {
    $('[id="fuel-type"]').val(options.data.get('fuelType'));
    options.fType = $('#fuel-type').val();
    // Enable or disable the GET PRICE button on page load
    options.checkFuelPrice();
    $('#fuel-cost').val(options.data.get('fuelCost').value);
    $('[id="currency-codes"]').val(options.data.get('fuelCost').curr);
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
    $('#currency-codes').val(options.data.get('currency'));
  }
};

/**
 * Returns an array containing all the currencies
 * @param {Object} options.countries
 * @returns {Array} List of all currencies
 */

function getAllCurrencies(countries) {
  var currencies = [];
  for (var country in countries){
    if(countries[country].currency)
      currencies.push(countries[country].currency);
  }
  // Sort the currencies in lexical order
  currencies.sort();
  // Remove duplicate currencies in the array
  currencies = currencies.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
  });
  return currencies;
}

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
      browserServices.getLocalisation('feMessage', 0, function(trans, id) {
        if (!options.isSafari) {
          $('#usage-message').html(trans);
        }
        else {
          $('#usage-message').html(options.getMessage('feMessage'));
        }
      });
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
      browserServices.getLocalisation('fcpMessage', 0, function(trans, id) {
        if (!options.isSafari) {
          $('#usage-message').html(trans);
        }
        else {
          $('#usage-message').html(options.getMessage('fcpMessage'));
        }
      });
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
      browserServices.getLocalisation('cvMessage', 0, function(trans, id) {
        if (!options.isSafari) {
          $('#usage-message').html(trans);
        }
        else {
          $('#usage-message').html(options.getMessage('cvMessage'));
        }
      });
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
  options.fType = $(elem).val();
  $('[id="fuel-type"]').val(options.fType);
  options.toggleUnits($('.save>:checkbox:checked'));
};

/**
 * makes change in currency reflect in both drop-downs
 * @param {Element} elem
 */

options.mirrorCurrency = function(elem) {
  $('[id="currency-codes"]').val(elem.prop('value'));
};

/**
 * Loads data from external resources
 */

options.loadResources = function() {
  /**
   * Sources:
   * https://www.epa.gov/sites/production/files/2015-11/documents/emission-factors_nov_2015.pdf
   * http://www.biomassenergycentre.org.uk/portal/page?_pageid=75,163182&_dad=portal&_schema=PORTAL
   */
   $.ajaxSetup({'beforeSend': function(xhr){
       if (xhr.overrideMimeType)
           xhr.overrideMimeType("application/json");
       }
   });
  var locale;

  try {
    locale = (/(\w*)-/).exec(navigator.language)[1];
  } catch (err) {
    locale = 'en';
  }
  $.when(
  $.getJSON(browserServices.getFilePath('/_locales/' + locale +
                                        '/messages.json'), function(response) {
    options.messages = response;
  }).fail(function() {
    $.getJSON(browserServices.getFilePath('/_locales/en/messages.json'),
              function(response) {
      options.messages = response;
    });
  }),
  $.getJSON(browserServices.getFilePath('/core/resources/fuels.json'),
            function(response) {
    options.fuels = response;
  }),
  $.getJSON(browserServices.getFilePath('/core/resources/currencyCodes.json'),
            function(response) {
    options.currencyCodes = response.currencyCodes;
  }),
  $.getJSON(browserServices.getFilePath('/core/resources/countries.json'),
            function(response) {
    options.countries = response;
  }),
  $.getJSON(browserServices.getFilePath('/core/resources/exchangeRates.json'),
            function(response) {
    options.defaultRates = response;
  })
  ).then(function() {
    if (options.fuelsinit === true &&
      options.currencyCodesinit === true &&
      options.countriesinit === true &&
      options.messagesinit === true &&
      options.data.has('geoData') &&
      !options.firstRun
      ) {
      options.populateMenus();
      options.loadMessages();
      options.loadSavedData();
    } else {
      options.firstRun = false;
      options.populateMenus();
      options.loadMessages();
      options.loadSavedData();
    }
      options.populated=true;
  });
  $.getScript('https://maps.googleapis.com/maps/api/js')
      .done(function() {
        if (!options.data.has('geoData')) {
          options.saveLocation();
        }
      });
};


/**
 * Event listeners for the page
 */

options.listeners = function() {
  $('#save-button').on('click', function() {
    options.saveOptions();
  });
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
    options.checkFuelPrice();
  });
  $('#currency-codes').on('change', function() {
    options.mirrorCurrency($(this));
  });
  $('#load-prices-button').on('click', function() {
    options.loadFuelPrices();
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
 * @param {function} cb
 */

options.initStorageManager = function(cb) {
  options.data = new StorageManager('calculationObject', function() {
    console.log('StorageManager Initialised');
    cb();
  });
};

/**
 * Initialises settingsProvider
 * @param {function} cb
 */

options.initSettings = function(cb) {
  if (!options.isSafari) {
    options.settings = new BackgroundDataAdapter(function() {
      console.log('BackgroundDataAdapter initialised');
    });
  }
  else {
    options.settings = {};
    safari.self.tab.dispatchMessage('fuelPrices', {
      type: 'getItem'
    });
    safari.self.tab.dispatchMessage('exchangeRates', {
      type: 'getItem'
    });
    safari.self.addEventListener('message', function(response) {
      if (response.name === 'exchangeRates') {
        if (response.message !== null)
          options.settings.exchangeRates = response.message.rates;
        console.log(options.settings.exchangeRates);
      }
      else if (response.name === 'fuelPrices') {
        if (response.message !== null)
          options.settings.fuelPrices = response.message;
        console.log(options.settings.fuelPrices);
      }
    }, false);
  }
  cb();
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
  // Populate all currencies
  var currencies = getAllCurrencies(options.countries);
  for(i=0; i<currencies.length; i++){
          $('#currency-codes').append($('<option></option>')
                              .val(currencies[i])
                              .html(currencies[i]));
  }
};

/**
 * Loads messages for the language specified
 */

options.loadMessages = function() {
  console.log(options.messages);
  var i;
  for (i = 0; i < $('[data-language]').length; i++) {
    if (!options.isSafari) {
      browserServices
        .getLocalisation($($('[data-language]')[i]).data('language'),
                         i,
                         function(trans, index) {
          var elm = $($('[data-language]')[index]);
          elm.html(trans);
        });
    }
    else {
      $($('[data-language]')[i])
        .html(options.getMessage($($('[data-language]')[i]).data('language')));
    }
  }
};

$(document).on('DOMContentLoaded', function() {
  options.listeners();
});

$(document).ajaxComplete(function(event, xhr, settings) {
  if ((/\w\/(\w*)\.json/).exec(settings.url) !== null)
    options[(/\w\/(\w*)\./).exec(settings.url)[1] + 'init'] = true;
  if ((/maps.googleapis.com/).exec(settings.url) !== null)
    options.mapsAPIloaded = true;
  if (options.fuelsinit === true &&
      options.currencyCodesinit === true &&
      options.countriesinit === true &&
      options.messagesinit === true &&
      options.mapsAPIloaded === true &&
      !options.populated) {
    options.populated = true;
    options.populateMenus();
    options.loadMessages();
    options.loadSavedData();
  }
  /*if (options.exchangeRatesinit === true &&
      !options.priceLoaded) {
    options.priceLoaded = true;
    options.loadFuelPrices();
  }*/
});

options.initStorageManager(function() {
  options.initSettings(function() {
    options.loadResources();
    //googleAnalytics('UA-1471148-11');
  });
});
