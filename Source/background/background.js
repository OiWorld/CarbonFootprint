function onMessage(request, sender) {
  console.log('Request Received');
  if (request.showPageAction) {
    console.log('Show pageAction icon in tab: ' + sender.tab.id);
    chrome.pageAction.show(sender.tab.id); // shows icon
  }
};

chrome.runtime.onMessage.addListener(onMessage);

googleAnalytics('UA-1471148-10');