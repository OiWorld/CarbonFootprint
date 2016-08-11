var buttons = require('sdk/ui/button/action');
var pageMod = require('sdk/page-mod');
var tabs = require('sdk/tabs');
var data = require("sdk/self").data;
var locale = require("sdk/l10n").get;
var storage = require("sdk/simple-storage").storage;
var request = require("sdk/request").Request;
var XMLHttpRequest = require("sdk/net/xhr").XMLHttpRequest;
var { setTimeout } = require("sdk/timers");

var button = buttons.ActionButton({
  id: 'carbon-footprint-link',
  label: 'Carbon Footprint™',
  disabled: true,
  icon: './images/globe-64-off.png',
  onClick: function() {
    tabs.open('./pages/options.html');
  }
});

//Chrome api replacement for options
pageMod.PageMod({
  include: data.url('./pages/options.html'),
  contentScriptWhen: 'start',
  contentScriptFile: './pages/js/firefoxFix.js',
  onAttach: function(wk) {
    wk.port.on('translationRequest', function(dt) {
      wk.port.emit('translationResponse', {key: dt.key, translation: locale(dt.key)});
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
      wk.port.emit('translationResponse', {key: dt.key, translation: locale(dt.key)});
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

function onAttachListener (wk) {
  wk.port.on('showPageAction', function(ev) {
    console.log('showPageAction received');
    button.state('tab', {
      disabled: false,
      icon: './images/globe-64.png'
    });
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
  wk.port.on('openUrl', function(dt) {
    tabs.open(dt.url);
  });
}

// Google Maps
var gmaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?google\..*\/maps.*/,
  contentScriptFile: [
    "./core/CarbonFootprintCore.js",
    "./core/helpers/FirefoxHelper.js",
    "./core/settings/FirefoxSettingsProvider.js",
    "./core/maps/GoogleMapsManager.js",
    "./core/init.js"
  ],
  contentScriptWhen: "start",
  onAttach: onAttachListener
});


//Map Services...
var gmaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?openstreetmap.org\/.*/,
  contentScriptFile: [
    "./core/CarbonFootprintCore.js",
    "./core/helpers/FirefoxHelper.js",
    "./core/settings/FirefoxSettingsProvider.js",
    "./core/maps/OpenMapsManager.js",
    "./core/init.js"
  ],
  contentScriptWhen: "start",
  onAttach: onAttachListener
});

var gmaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?bing.com\/mapspreview.*/,
  contentScriptFile: [
    "./core/CarbonFootprintCore.js",
    "./core/helpers/FirefoxHelper.js",
    "./core/settings/FirefoxSettingsProvider.js",
    "./core/maps/BingMapsManager.js",
    "./core/init.js"
  ],
  contentScriptWhen: "start",
  onAttach: onAttachListener
});

var gmaps = pageMod.PageMod({
  include: /https?:\/\/.*\.here.com\/.*/,
  contentScriptFile: [
    "./core/CarbonFootprintCore.js",
    "./core/helpers/FirefoxHelper.js",
    "./core/settings/FirefoxSettingsProvider.js",
    "./core/maps/HereMapsManager.js",
    "./core/init.js"
  ],
  contentScriptWhen: "start",
  onAttach: onAttachListener
});

var gmaps = pageMod.PageMod({
  include: /https?:\/\/(www\.)?mapquest.com\/.*/,
  contentScriptFile: [
    "./core/CarbonFootprintCore.js",
    "./core/helpers/FirefoxHelper.js",
    "./core/settings/FirefoxSettingsProvider.js",
    "./core/maps/MapQuestMapsManager.js",
    "./core/init.js"
  ],
  contentScriptWhen: "start",
  onAttach: onAttachListener
});



var updater = {};

updater.updateExchangeRates = function() {
  request({
    url: 'http://api.fixer.io/latest?base=USD',
    onComplete: function(response) {
      if(response.status === 200) {
        storage.exchangeRates = response.json;
        var date = new Date();
        storage.time = date.getTime();
      }
    }
  }).get();
}

updater.updateFuelPrices = function() {
  var site = 'http://www.globalpetrolprices.com/api/getGasXML_weekly.php?',
      fuel = 'gasoline_diesel=',
      type = 1,
      cnc = '&rate=USD&countries=all',
      key = '&p=5a27edd1afc39b27ba4ba5d33a73d7fa',
      finalobj = {};

  var done = function() {
    storage.fuelPrices = finalobj;
  }

  var parseXml = function(xml) {
    var countries = xml.getElementsByTagName('mtc:country');

    for(country of countries) {
      if (!(country.getAttribute('id') in finalobj)) {
        finalobj[country.getAttribute('id')] = {};
      }

      var gas_type = country.getElementsByTagName('mtc:gas_type')[0];

      if (gas_type.childNodes[0].nodeValue !== '0') {
        finalobj[country.getAttribute('id')][gas_type.getAttribute('id')] = gas_type.childNodes[0].nodeValue;
      }
    }

    type += 1;
    if (type <= 3)
      doRequest();
    else
      done();
  }

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
    }

    req.send();
  }
  doRequest();
}

updater.updateInt = 7 * 24 * 3600 * 1000;

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

updater.doUpdate = function() {
  updater.updateFuelPrices();
  updater.updateExchangeRates();
}

setTimeout(updater.doUpdate, updater.updateInt);

if ('time' in storage) {
  if (updater.checkLastUpdate(storage.time))
    updater.doUpdate();
} else {
  console.log('updating');
  updater.doUpdate();
}
