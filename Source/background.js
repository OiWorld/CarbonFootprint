// function to get and set JSON in localStorage
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

//intializing output variable
function initializeLocalStorage() {
  if (!localStorage['emissionRate'] || !localStorage['travelRate']) {
    localStorage.setObj('emissionRate',{
      value: 217,
      unit1: 'g',
      unit2: 'km',
    });
    localStorage.setObj('travelRate',{
      value: 0.4,
      unit1: '$',
      unit2: 'km',
    });
  } 
}

initializeLocalStorage();

function onMessage(request, sender, sendResponse) {
  console.log('Request Received');
  if (request.carbonEmission) {
    console.log('Show pageAction icon in tab: ' + sender.tab.id);
    chrome.pageAction.show(sender.tab.id); // shows icon
    //sending JSON
    sendResponse({emissionRate: localStorage.getObj('emissionRate'),travelRate: localStorage.getObj('travelRate')});
  }
};

chrome.runtime.onMessage.addListener(onMessage);

function pageActionClicked() {
  chrome.tabs.create({url: chrome.extension.getURL('options.html')});
}

chrome.pageAction.onClicked.addListener(pageActionClicked);

googleAnalytics('UA-1471148-10');
