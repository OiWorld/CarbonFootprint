/**
 * Background listeners of the extension
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

googleAnalytics('UA-1471148-10');

chrome.alarms.onAlarm.addListener(
  function(alarm) {
    if (alarm.name === 'CarCheckupAlarm') {
      chrome.notifications.create('CarCheckupNotification', {
        type: 'basic',
        iconUrl: 'images/globe-256.png',
        title: chrome.i18n.getMessage('notificationTitle'),
        message: chrome.i18n.getMessage('notificationMessage') +
          ' ' + chrome.i18n.getMessage('notificationInfoText'),
        eventTime: alarm.scheduledTime,
        requireInteraction: true
      });
    }
  }
);

/**
 * namespace for background
 */

var background = {};

/**
 * script element for xml2json
 */

background.xml2json = document.createElement('script');

/**
 * binds source of xml2json script
 * @const
 */

background.xml2json.src = '/background/xml2json.min.js';

/**
 * loads xml2json converter library
 */

document.getElementsByTagName('head')[0].appendChild(background.xml2json);

/**
 * script element for jQuery
 */

background.jQuery = document.createElement('script');

/**
 * binds source of jQuery script
 * @const
 */

background.jQuery.src = '/pages/js/jquery.min.js';

/**
 * loads jQuery
 */

document.getElementsByTagName('head')[0].appendChild(background.jQuery);

/**
 * update interval (1 week in ms)
 * @const
 */

background.updateInt = 7 * 24 * 3600 * 1000;

/**
 * calls fixer.io api to get exchange rates
 */

background.updateExchangeRates = function() {
  $.ajax({
    type: 'GET',
    url: 'http://api.fixer.io/latest?base=USD',
    success: function(response) {
      background.storeObj.exchangeRates = response;
    },
    complete: function() {
      var date = new Date();
      background.storeObj.time = date.getTime();
      chrome.storage.sync.set(background.storeObj);
      console.log(background.storeObj);
    }
  });
};

/**
 * calls globalpetrolprices.com api to get fuel prices
 */

background.updateFuelPrices = function() {
  var site = 'http://www.globalpetrolprices.com/api/getGasXML_weekly.php?',
      fuel = 'gasoline_diesel=',
      type = 1,
      cnc = '&rate=USD&countries=all',
      key = '&p=5a27edd1afc39b27ba4ba5d33a73d7fa',
      url,
      x2js = new X2JS(),
      finalObj = {},
      callServer = function() {
        url = site + fuel + type + cnc + key;
        $.ajax({
          type: 'GET',
          url: url,
          dataType: 'xml',
          success: function(response) {
            var xmlString = (new XMLSerializer()).serializeToString(response);
            var jsonObj = x2js.xml_str2json(xmlString);
            jsonObj = jsonObj.data.country;
            for (var i in jsonObj) {
              if (!finalObj[jsonObj[i]._id]) {
                finalObj[jsonObj[i]._id] = {};
              }
              if (jsonObj[i].gas_type.__text !== '0')
                finalObj[jsonObj[i]._id][jsonObj[i].gas_type._id] =
                jsonObj[i].gas_type.__text;
            }
            type += 1;
          },
          complete: function() {
            if (type <= 3) {
              callServer();
            }
            else {
              background.storeObj.fuelPrices = finalObj;
              background.updateExchangeRates();
            }
          }
        });
      };
  callServer();
};

/**
 * calls apis and updates data
 */

background.updateResources = function() {
  background.storeObj = {};
  background.updateFuelPrices();
};

/**
 * checks how long ago the data was last updated
 * @param {number} prevTime
 * @return {boolean}
 */

background.checkLastUpdate = function(prevTime) {
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
 * checks if apis need to be called after jQuery is loaded
 */

background.jQuery.onload = function() {
  chrome.storage.sync.get('time', function(response) {
    if (!response.time) {
      background.updateResources();
    }
    else if (background.checkLastUpdate(response.time)) {
      background.updateResources();
    }
  });
  window.setTimeout(background.updateResources, background.updateInt);
};


/**
 * Array to maintain tabIds of tabs using extension
 */

background.tabids = [];

/**
 * Function to show pageAction and update pageAction Title
 * Also push tabIds in background.tabids if it doesnt exist
 */

chrome.runtime.onMessage.addListener(
  function(request, sender) {
    console.log('Request Received');
    if (request.showPageAction) {
      console.log('Show pageAction icon in tab: ' + sender.tab.id);
      if(background.tabids.indexOf(sender.tab.id) == -1) {
        background.tabids.push(sender.tab.id);
      }
      chrome.pageAction.show(sender.tab.id); // shows icon
    chrome.pageAction.setTitle({tabId:sender.tab.id,title:'Carbon Footprint'}); //update title
    }
  }
);


/**
 * Function called if tab is closed
 * deletes the tabId of closed tab
 */

chrome.tabs.onRemoved.addListener(function(tabid, removed) {
  // console.log(tabid,removed);
  var index = background.tabids.indexOf(tabid);
  if (index > -1) {
    background.tabids.splice(index, 1);
  }
})

/**
 * Function called if tabInfo (url,load status) is updated
 * deletes the tabId if the extension is no longer used by checking with updated title of pageAction
 */

chrome.tabs.onUpdated.addListener(function(tabid,changeInfo,Tab) {
  // console.log(tabid,changeInfo,Tab);
  chrome.pageAction.getTitle({tabId:tabid},function(title) {
    if(title != "Carbon Footprint") {
      var index = background.tabids.indexOf(tabid);
      if (index > -1) {
        background.tabids.splice(index, 1);
      }
    }
  })
})

/**
 * Function called if storage is updated
 * reloads all the tabs in backgrounds.tabids
 */

chrome.storage.onChanged.addListener(function(changes, namespace) {
  // console.log("Change Received!",changes,namespace);
  if( 'calculationObject' in changes && namespace == 'sync') {
    for(var i = 0; i < background.tabids.length; ++i) {
      chrome.tabs.reload(background.tabids[i]);
    }     
  }
});