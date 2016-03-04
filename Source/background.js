function initializeLocalStorage() {
  if (localStorage['carbonEmission'] == null) {
    localStorage['carbonEmission'] = 217;
  }

  if (localStorage['fuelCost'] == null) {
    localStorage['fuelCost'] = 2.74;
  }

  if (localStorage['displayTravelCost'] == null) {
    localStorage['displayTravelCost'] = true;
  }

  if (localStorage['averageMileage'] == null) {
    localStorage['averageMileage'] = 20;
  }

}
initializeLocalStorage();

function S(key) { return localStorage[key]; }

function onRequest(request, sender, sendResponse) {
  console.log('Request Received');
  if (request.carbonEmission) {
    console.log('Show pageAction icon in tab: ' + sender.tab.id);
    chrome.pageAction.show(sender.tab.id); // shows icon
    sendResponse({carbonEmission: S('carbonEmission')});
  }

  if (request.fuelCost) {
    console.log('Show pageAction icon in tab: ' + sender.tab.id);
    chrome.pageAction.show(sender.tab.id); // shows icon
    sendResponse({fuelCost: S('fuelCost')});
  }

  if (request.displayTravelCost) {
    console.log('Show pageAction icon in tab: ' + sender.tab.id);
    chrome.pageAction.show(sender.tab.id); // shows icon
    sendResponse({displayTravelCost: S('displayTravelCost')});
  }

  if (request.averageMileage) {
    console.log('Show pageAction icon in tab: ' + sender.tab.id);
    chrome.pageAction.show(sender.tab.id); // shows icon
    sendResponse({averageMileage: S('averageMileage')});
  }

};

chrome.extension.onRequest.addListener(onRequest);

function pageActionClicked() {
  chrome.tabs.create({url: chrome.extension.getURL('options.html')});
}

chrome.pageAction.onClicked.addListener(pageActionClicked);

googleAnalytics('UA-1471148-10');
