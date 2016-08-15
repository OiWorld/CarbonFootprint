/**
 * Background listeners of the extension
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

googleAnalytics('UA-1471148-10');

/**
 * namespace for background
 */

var background = {};

/**
 * check if the browser is chrome or safari
 */

background.isChrome = (function(){
  if(navigator.userAgent.toLowerCase().indexOf("chrome") != -1){
    background.isSafari = false; 
    return true;
  }
  else {
    if(navigator.userAgent.toLowerCase().indexOf("safari") != -1)
      background.isSafari = true;
    return false;
  }
})();

/**
 * array where active tabs are stored
 */

background.tabs = [];

/**
 * CHROME APIs
 */

if(background.isChrome){

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
  
  chrome.runtime.onMessage.addListener(
    function(request, sender) {
      console.log('Request Received');
      if (request.showPageAction) {
        console.log('Show pageAction icon in tab: ' + sender.tab.id);
        chrome.pageAction.show(sender.tab.id); // shows icon
      }
    }
  );
  
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
}

/**
 * SAFARI APIs
 */

if(background.isSafari){
  safari.application.addEventListener('message', function(response) {
    if (response.message) {
      if (response.message.type === 'getItem') {
        response
          .target
          .page
          .dispatchMessage(response.name,
                           safari.extension.settings.getItem(response.name));
      }
      if (response.message.type === 'setItem') {
        safari
          .extension
          .settings
          .setItem(response.name, response.message.item);
      }
    }
    if (response.name === 'Initialised') {
      console.log('Working in tab: ', response.target);
      background.tabs.push(response.target);
      response.target.addEventListener('close', function(response) {
        background.tabs.splice(background.tabs.indexOf(response.target), 1);
      }, false);
    }
  }, false);

  safari.extension.settings.addEventListener('change', function(response) {
    var temp = background.tabs;
    background.tabs = [];
    for (var i in temp) {
      if (temp[i].page)
        temp[i].page.dispatchMessage('reload');
    }
  }, false);

  /**
   * sets alarm for showing notification
   * note: basic implementation due to unavailability of alarms API in safari
   */

  background.setNotificationAlarm = function() {
    var settings = safari.extension.settings.getItem('calculationObject');
    if (settings)
      if (settings.showCheckupNotification) {
        var lastCheckupDate = new Date(settings.lastCheckup);
        var now = new Date();
        var nextCheckupDate = new Date(settings.lastCheckup);
        nextCheckupDate.addMonths(settings.nextCheckupMonth);
        nextCheckupDate.addYears(settings.nextCheckupYear);
        //shows notification 3 days prior
        var threeDays = 3 * 24 * 3600 * 1000;// in milliseconds
        var prior = new Date(nextCheckupDate.getTime() - threeDays);
        // time difference between 'now' and when to show notification
        var diff = prior.getTime() - now.getTime();
        if (diff <= 0) {
          background.showNotification();
        }
        // reset lastcheckup when 'now' has passed checkup date
        if (now.getTime > nextCheckupDate.getTime) {
          var dd = nextCheckupDate.getDate();
          var mm = nextCheckupDate.getMonth() + 1;
          var yyyy = nextCheckupDate.getFullYear();
          if (dd < 10) {
            dd = '0' + dd;
          }
          if (mm < 10) {
            mm = '0' + mm;
          }
          var newlastCheckup = mm + '/' + dd + '/' + yyyy;
          settings.lastCheckup = newlastCheckup;
          safari.extension.settings.setItem('calculationObject', settings);
        }
      }
  };

  /**
   * shows checkup notification when called
   */

  background.showNotification = function() {
    if (!'Notification' in window) {
      // If the browser version is unsupported, remain silent.
      console.log('Browser Not Supprted');
      return;
    }
    console.log(Notification.permission);
    if (Notification.permission === 'default') {
      Notification.requestPermission(function() {
        background.showNotification();
      });
    }
    else if (Notification.permission === 'granted') {
      var n = new Notification(
        background.getMessage('notificationTitle'),
        {
          'body': background.getMessage('notificationInfoText'),
          'tag' : 'checkupNotification'
        }
      );
      n.onclick = function() {
        safari.application.activeBrowserWindow.openTab().url =
          safari.extension.baseURI + 'pages/knowMore.html';
      };
    }
  };

  /**
   * return requested message with ID
   * @param {string} ID
   * @return {string}
   */

  background.getMessage = function(ID) {
    return background.messages[ID].message;
  };

  /**
   * loads locale messages since safari has no support for i18n
   * loads en locale messages as default
   */

  background.loadMessages = function() {
    var URL = safari.extension.baseURI;
    var locale = (/(\w*)-/).exec(navigator.language)[1];
    $.ajax({
      type: 'GET',
      url: URL + '_locales/' + locale + '/messages.json',
      success: function(response) {
        background.messages = JSON.parse(response);
      },
      complete: function() {
        background.setNotificationAlarm();
      },
      error: function() {
        $.ajax({
          type: 'GET',
          url: URL + '_locales/en/messages.json',
          success: function(response) {
            background.messages = JSON.parse(response);
          },
          complete: function() {
            background.setNotificationAlarm();
          }
        });
      }
    });
  };
}

/**
 * update interval (1 week in ms)
 * @const
 */

background.updateInt = 7 * 24 * 3600 * 1000;

/**
 * calls fixer.io api to get exchange rates
 */

console.log(background.isChrome,background.isSafari);

background.updateExchangeRates = function() {
  var exchangeRates;
  $.ajax({
    type: 'GET',
    url: 'http://api.fixer.io/latest?base=USD',
    success: function(response) {
      exchangeRates = response;
    },
    complete: function() {
      console.log(exchangeRates);
      if(background.isChrome){
        var storeObj = {};
        storeObj.exchangeRates = exchangeRates;
        chrome.storage.sync.set(storeObj);
      }
      else if(background.isSafari){
        safari.extension.settings.setItem('exchangeRates',exchangeRates);
      }
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
              if(background.isChrome){
                var storeObj;
                storeObj.fuelPrices = finalObj;
                chrome.storage.sync.set(storeObj);
              }
              else if(background.isSafari){
                safari.extension.settings.setItem('fuelPrices', finalObj); 
              }
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
  background.updateFuelPrices();
  background.updateExchangeRates();
  var time = new Date();
  time = time.getTime();
  if(background.isChrome){
    var storeObj = {};
    storeObj.time = time;
    chrome.storage.sync.set(storeObj);
  }
  if(background.isSafari){
    safari.extension.settings.setItem('time', time);
  }
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
 * in CHROME only
 */

if(background.isChrome){
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
}

/**
 * checks if apis need to be called after jQuery is loaded
 * in SAFARI only
 */

if(background.isSafari){
  window.onload = function() {
    background.loadMessages();
    var time = safari.extension.settings.getItem('time');
    if (time === null) {
      background.updateResources();
    }
    else if (background.checkLastUpdate(time)) {
      background.updateResources();
    }
    else {
      console.log(safari.extension.settings.getItem('fuelPrices'));
      console.log(safari.extension.settings.getItem('exchangeRates'));
    }
    window.setTimeout(background.updateResources, background.updateInt);
  };
}
