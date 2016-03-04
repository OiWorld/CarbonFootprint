function initializeLocalStorage() {
  if (localStorage['carbonEmission'] == null) {
    localStorage['carbonEmission'] = 217;
  }
  if (localStorage['vehicleAverage'] == null) {
    localStorage['vehicleAverage'] = 15;
  }
  if (localStorage['vehicleFuelPrice'] == null) {
    localStorage['vehicleFuelPrice'] = 70;
  }
}
initializeLocalStorage();

function S(key) { return localStorage[key]; }

function onRequest(request, sender, sendResponse) {
  console.log('Request Received');
  if (request.carbonEmission) {
    console.log('Show pageAction icon in tab: ' + sender.tab.id);
    chrome.pageAction.show(sender.tab.id); // shows icon
    sendResponse(
      {carbonEmission: S('carbonEmission'),
       vehicleAverage: S('vehicleAverage'),
       vehicleFuelPrice: S('vehicleFuelPrice')
      });
  }
};

chrome.extension.onRequest.addListener(onRequest);

function pageActionClicked() {
  chrome.tabs.create({url: chrome.extension.getURL('options.html')});
}

chrome.pageAction.onClicked.addListener(pageActionClicked);

googleAnalytics('UA-1471148-10');
