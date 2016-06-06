function onMessage(request, sender) {
    console.log('Request Received');
    if (request.showPageAction) {
        console.log('Show pageAction icon in tab: ' + sender.tab.id);
        chrome.pageAction.show(sender.tab.id); // shows icon
    }
}

function onAlarm(alarm) {
    if (alarm.name === "CarCheckupAlarm") {
        chrome.notifications.create("CarCheckupNotification", {
            type: 'basic',
            iconUrl: 'images/globe-256.png',
            title: chrome.i18n.getMessage('notificationTitle'),
            message: chrome.i18n.getMessage('notificationMessage'),
            eventTime: Date.now()
        });
    }
}

chrome.alarms.onAlarm.addListener(onAlarm);

chrome.runtime.onMessage.addListener(onMessage);

googleAnalytics('UA-1471148-10');