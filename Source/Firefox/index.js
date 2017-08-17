var buttons = require('sdk/ui/button/toggle');
var pageMod = require('sdk/page-mod');
var tabs = require('sdk/tabs');
var data = require('sdk/self').data;
var panels = require('sdk/panel');
var locale = require('sdk/l10n').get;
var storage = require('sdk/simple-storage').storage;
var request = require('sdk/request').Request;
var XMLHttpRequest = require('sdk/net/xhr').XMLHttpRequest;
var { setTimeout } = require('sdk/timers');
var notifications = require('sdk/notifications');


/**
 * patching date functions because original js sucks
 */

/**
 * Checks if given year is a leap year
 * @param {int} year
 * @return {boolean}
 */

Date.isLeapYear = function(year) {
  return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

/**
 * Returns the amount of days in the month of the year
 * @param {int} year
 * @param {int} month
 * @return {int}
 */

Date.getDaysInMonth = function(year, month) {
  return [
    31, (Date.isLeapYear(year) ? 29 : 28),
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ][month];
};

/**
 * Adds the leap year check to the Date prototype
 * @return {Date}
 */

Date.prototype.isLeapYear = function() {
  return Date.isLeapYear(this.getFullYear());
};

/**
 * Adds the day in month to the Date prototype
 * @return {Date}
 */

Date.prototype.getDaysInMonth = function() {
  return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

/**
 * Add months amount of months to the current date
 * @param {int} months
 * @return {Date}
 */

Date.prototype.addMonths = function(months) {
  var n = this.getDate();
  this.setDate(1);
  this.setMonth(this.getMonth() + months);
  this.setDate(Math.min(n, this.getDaysInMonth()));
  return this;
};

/**
 * Add years amount of years to the current date
 * @param {int} years
 * @return {Date}
 */

Date.prototype.addYears = function(years) {
  return this.addMonths(years * 12);
};


var panel = panels.Panel({
  width: 200,
  height: 129,
  contentURL: './pages/popup.html',
  contentScriptFile: './pages/js/popupPanel.js',
  onHide: function() {
    button.state('window', {checked: false});
  }
});

panel.port.on('link', function(url) {
  tabs.open('./pages/' + url + '.html');
  panel.hide();
});

var button = buttons.ToggleButton({
  id: 'carbon-footprint-link',
  label: 'Carbon Footprint™',
  icon: './images/globe-64.png',
  onChange: function(state) {
    if (state.checked) {
      panel.show({
        position: button
      });
    }
  }
});

//Chrome api replacement for options
pageMod.PageMod({
  include: data.url('./pages/options.html'),
  contentScriptWhen: 'start',
  contentScriptFile: './pages/js/firefoxFix.js',
  onAttach: function(wk) {
    wk.port.on('translationRequest', function(dt) {
      wk.port.emit('translationResponse',
        {
          key: dt.key,
          translation: locale(dt.key)
        }
      );
    });
    wk.port.on('storageGetRequest', function(stor) {
      if (stor.storageKey in storage) {
        var values = {};
        values[stor.storageKey] = storage[stor.storageKey];
        wk.port.emit('storageGetResponse', {values: values, tag: stor.tag});
      }
      else
        wk.port.emit('storageGetResponse', {values: {}, tag: stor.tag});
    });
    wk.port.on('storageSetRequest', function(stor) {
      for (var i in stor.data)
        storage[i] = stor.data[i];
      console.log(storage);
    });
  }
});

//Chrome api replacement for know more
pageMod.PageMod({
  include: data.url('./pages/knowMore.html'),
  contentScriptWhen: 'start',
  contentScriptFile: './pages/js/firefoxFix.js',
  onAttach: function(wk) {
    wk.port.on('translationRequest', function(dt) {
      wk.port.emit('translationResponse',
        {
          key: dt.key,
          translation: locale(dt.key)
        }
      );
    });
    wk.port.on('storageGetRequest', function(stor) {
      if (stor.storageKey in storage) {
        var values = {};
        values[stor.storageKey] = storage[stor.storageKey];
        wk.port.emit('storageGetResponse', {values: values, tag: stor.tag});
      }
      else
        wk.port.emit('storageGetResponse', {values: {}, tag: stor.tag});
    });
    wk.port.on('storageSetRequest', function(stor) {
      for (var i in stor.data)
        storage[i] = stor.data[i];
      console.log(storage);
      alarm.checkTrigger();
    });
  }
});

function onAttachListener(wk) {
  wk.port.on('storageGetRequest', function(stor) {
    if (stor.storageKey in storage) {
      var values = {};
      values[stor.storageKey] = storage[stor.storageKey];
      wk.port.emit('storageGetResponse', {values: values, tag: stor.tag});
    }
    else
      wk.port.emit('storageGetResponse', {values: {}, tag: stor.tag});
  });
  wk.port.on('openUrl', function(dt) {
    tabs.open(dt.url);
  });
}

// Google Maps
var gmaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?google\..*\/maps.*/,
  contentScriptFile: [
    './core/CarbonFootprintCore.js',
    './core/SettingsProviderCore.js',
    './core/helpers/FirefoxHelper.js',
    './core/settings/FirefoxSettingsProvider.js',
    './core/maps/GoogleMapsManager.js',
    './core/init.js'
  ],
  contentStyleFile: './core/css/main.css',
  contentScriptWhen: 'ready',
  onAttach: onAttachListener
});


//Map Services...
var osmaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?openstreetmap.org\/.*/,
  contentScriptFile: [
    './core/CarbonFootprintCore.js',
    '.core/SettingsProviderCore.js',
    './core/helpers/FirefoxHelper.js',
    './core/settings/FirefoxSettingsProvider.js',
    './core/maps/OpenMapsManager.js',
    './core/init.js'
  ],
  contentStyleFile: './core/css/main.css',
  contentScriptWhen: 'ready',
  onAttach: onAttachListener
});

var bmaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?bing.com\/maps.*/,
  contentScriptFile: [
    './core/CarbonFootprintCore.js',
    '.core/SettingsProviderCore.js',
    './core/helpers/FirefoxHelper.js',
    './core/settings/FirefoxSettingsProvider.js',
    './core/maps/BingMapsManager.js',
    './core/init.js'
  ],
  contentStyleFile: './core/css/main.css',
  contentScriptWhen: 'ready',
  onAttach: onAttachListener
});

var hmaps = pageMod.PageMod({
  include: /https?:\/\/.*\.here.com\/.*/,
  contentScriptFile: [
    './core/CarbonFootprintCore.js',
    '.core/SettingsProviderCore.js',
    './core/helpers/FirefoxHelper.js',
    './core/settings/FirefoxSettingsProvider.js',
    './core/maps/HereMapsManager.js',
    './core/init.js'
  ],
  contentStyleFile: './core/css/main.css',
  contentScriptWhen: 'ready',
  onAttach: onAttachListener
});

var mqmaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?mapquest.com\/.*/,
  contentScriptFile: [
    './core/CarbonFootprintCore.js',
    '.core/SettingsProviderCore.js',
    './core/helpers/FirefoxHelper.js',
    './core/settings/FirefoxSettingsProvider.js',
    './core/maps/MapQuestMapsManager.js',
    './core/init.js'
  ],
  contentStyleFile: './core/css/main.css',
  contentScriptWhen: 'ready',
  onAttach: onAttachListener
});

var ymaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?yandex.*\/maps\/.*/,
  contentScriptFile: [
    './core/CarbonFootprintCore.js',
    '.core/SettingsProviderCore.js',
    './core/helpers/FirefoxHelper.js',
    './core/settings/FirefoxSettingsProvider.js',
    './core/maps/YandexMapsManager.js',
    './core/init.js'
  ],
  contentStyleFile: './core/css/main.css',
  contentScriptWhen: 'ready',
  onAttach: onAttachListener
});

var wmaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?waze.com\/livemap.*/,
  contentScriptFile: [
    './core/CarbonFootprintCore.js',
    '.core/SettingsProviderCore.js',
    './core/helpers/FirefoxHelper.js',
    './core/settings/FirefoxSettingsProvider.js',
    './core/maps/WazeMapsManager.js',
    './core/init.js'
  ],
  contentStyleFile: './core/css/main.css',
  contentScriptWhen: 'ready',
  onAttach: onAttachListener
});

var vmmaps = pageMod.PageMod({
  include: /https?:\/\/.*\.viamichelin.*/,
  contentScriptFile: [
    './core/CarbonFootprintCore.js',
    './core/helpers/FirefoxHelper.js',
    './core/settings/FirefoxSettingsProvider.js',
    './core/maps/ViaMichelinMapsManager.js',
    './core/init.js'
  ],
  contentStyleFile: './core/css/main.css',
  contentScriptWhen: 'ready',
  onAttach: onAttachListener
});
var skyscanner = pageMod.PageMod({
  include: /https?:\/\/(www\.)?skyscanner\..*\/transport.*/,
  contentScriptFile: [
    "./core/helpers/flightDataHelper.js",
    "./core/helpers/FirefoxHelper.js",
    "./core/FlightsFootprintCore.js",
    "./core/flights/skyscanner.js",
    "./core/initFlight.js"
  ],
  contentScriptWhen: 'ready',
  onAttach: flightsDataListener
});

function flightsDataListener(worker){
  worker.port.on("loadAirplanesData", function(){
    console.log("recieved airplanes req");
    var json = JSON.parse(data.load("./core/resources/airplanes.json"));
    worker.port.emit('airplanesDataLoaded', json);
  });
  worker.port.on("loadAirportsData", function(){
    console.log("recieved airports req");
    var json = JSON.parse(data.load("./core/resources/airports.json"));
    worker.port.emit('airportsDataLoaded', json);
  });
}

var updater = {};

/**
 * calls fixer.io api to get exchange rates
 */

updater.updateExchangeRates = function() {
  request({
    url: 'http://api.fixer.io/latest?base=USD',
    onComplete: function(response) {
      if (response.status === 200) {
        storage.exchangeRates = response.json;
        var date = new Date();
        storage.time = date.getTime();
      }
    }
  }).get();
};

/**
 * calls globalpetrolprices.com api to get fuel prices
 */

updater.updateFuelPrices = function() {
  var site = 'http://www.globalpetrolprices.com/api/getGasXML_weekly.php?',
      fuel = 'gasoline_diesel=',
      type = 1,
      cnc = '&rate=USD&countries=all',
      key = '&p=5a27edd1afc39b27ba4ba5d33a73d7fa',
      finalobj = {};

  var done = function() {
    storage.fuelPrices = finalobj;
  };

  var parseXml = function(xml) {
    var countries = xml.getElementsByTagName('mtc:country');

    for (country of countries) {
      if (!(country.getAttribute('id') in finalobj)) {
        finalobj[country.getAttribute('id')] = {};
      }

      var gas_type = country.getElementsByTagName('mtc:gas_type')[0];

      if (gas_type.childNodes[0].nodeValue !== '0') {
        finalobj[country.getAttribute('id')][gas_type.getAttribute('id')] =
        gas_type.childNodes[0].nodeValue;
      }
    }

    type += 1;
    if (type <= 3)
      doRequest();
    else
      done();
  };

  var doRequest = function() {
    var url = site + fuel + type + cnc + key;

    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onreadystatechange = function(ev) {
      if (req.readyState == 4) {
        if (req.status == 200) {
          parseXml(req.responseXML);
        }
      }
    };

    req.send();
  };
  doRequest();
};

/**
 * update interval (1 week in ms)
 * @const
 */

updater.updateInt = 7 * 24 * 3600 * 1000;

/**
 * checks how long ago the data was last updated
 * @param {number} prevTime
 * @return {boolean}
 */

updater.checkLastUpdate = function(prevTime) {
  var now = new Date();
  now = now.getTime();
  var weeks = Math.abs(now - prevTime) / background.updateInt;
  console.log((now - prevTime) / 60000);
  if (weeks > 1)
    return true;
  else
    return false;
};

/**
 * run the Fuel and Exchange rate updates
 */

updater.doUpdate = function() {
  updater.updateFuelPrices();
  updater.updateExchangeRates();
};

setTimeout(updater.doUpdate, updater.updateInt);

if ('time' in storage) {
  if (updater.checkLastUpdate(storage.time))
    updater.doUpdate();
} else {
  console.log('updating');
  updater.doUpdate();
}


var alarm = {};

/**
 * displays the checkup notification
 */

alarm.showNotification = function() {
  notifications.notify({
    title: locale('notificationTitle'),
    text: locale('notificationMessage') +
    ' ' + locale('notificationInfoText'),
    iconUrl: './images/globe-256.png'
  });
};

/**
 * checks if the checkup notification should be displayed
 */

alarm.checkTrigger = function() {
  if (storage.calculationObject) {
    if (storage.calculationObject.showCheckupNotification) {
      var last = storage.calculationObject.lastCheckup;
      var next = new Date(last);
      var now = new Date();

      next.addMonths(storage.calculationObject.nextCheckupMonth);
      next.addYears(storage.calculationObject.nextCheckupYear);

      var diff = next.getTime() - now.getTime();

      if (diff <= 0) {
        alarm.showNotification();
        var dd = next.getDate();
        var mm = next.getMonth() + 1;
        var yyyy = next.getFullYear();

        if (dd < 10) {
          dd = '0' + dd;
        }
        if (mm < 10) {
          mm = '0' + mm;
        }

        var newlastCheckup = mm + '/' + dd + '/' + yyyy;
        storage.calculationObject.lastCheckup = newlastCheckup;
      } else {
        setTimeout(alarm.showNotification, diff);
      }
    }
  }
};

alarm.checkTrigger();
