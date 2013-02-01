function initializeLocalStorage() {
  if (localStorage["carbonEmission"] == null) {
    localStorage["carbonEmission"] = 217;
  } 
}
initializeLocalStorage();


function S(key) { return localStorage[key]; }

	
function onRequest(request, sender, sendResponse) {
  // alert("got request");	
  if (request.carbonEmission) {
    chrome.pageAction.show(sender.tab.id); // shows icon
    sendResponse({carbonEmission : S("carbonEmission")});
  }
};

chrome.extension.onRequest.addListener(onRequest);

function pageActionClicked() {
  chrome.tabs.create({url:chrome.extension.getURL("options.html")});
}

chrome.pageAction.onClicked.addListener(pageActionClicked);

google_analytics('UA-1471148-10');
