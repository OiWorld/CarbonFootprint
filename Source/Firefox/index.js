var buttons = require('sdk/ui/button/action');
var pageMod = require('sdk/page-mod');
var tabs = require('sdk/tabs');
var data = require("sdk/self").data;
var locale = require("sdk/l10n").get;
var storage = require("sdk/simple-storage").storage;

var button = buttons.ActionButton({
  id: 'carbon-footprint-link',
  label: 'Carbon Footprint™',
  disabled: true,
  icon: './images/globe-64-off.png',
  onClick: function() {
    tabs.open('./pages/options.html');
  }
});

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
  onAttach: function(wk) {
    wk.port.on('showPageAction', function(ev) {
      console.log('showPageAction received');
      button.state('tab', {
        disabled: false,
        icon: './images/globe-64.png'
      });
    });
    wk.port.on('storageGetRequest', function(stor) {
      if (stor.storageKey in storage)
        wk.port.emit('storageGetResponse', {values: {}[stor.storageKey] = storage[stor.storageKey], tag: stor.tag});
      else
        wk.port.emit('storageGetResponse', {values: {}, tag: stor.tag});
    });
    wk.port.on('openUrl', function(dt) {
      tabs.open(dt.url);
    });
  }
});


//Map Services...


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
      if (stor.storageKey in storage)
        wk.port.emit('storageGetResponse', {values: {}[stor.storageKey] = storage[stor.storageKey], tag: stor.tag});
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
