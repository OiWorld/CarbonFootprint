function initializeLocalStorage() {
  if (!localStorage.carbonEmission || !localStorage.carbonEmissionUnit) {
    localStorage.carbonEmission = 217;
    carbonEmissionUnit = 'g/km';
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
};

chrome.extension.onRequest.addListener(onRequest);

function pageActionClicked() {
  chrome.tabs.create({url: chrome.extension.getURL('options.html')});
}

chrome.pageAction.onClicked.addListener(pageActionClicked);

googleAnalytics('UA-1471148-10');
