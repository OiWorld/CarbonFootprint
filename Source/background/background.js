googleAnalytics('UA-1471148-10'); // was this supposed to be removed?

chrome.runtime.onMessage.addListener(
    function (request, sender) {
        console.log('Request Received');
        if(request.showPageAction) {
            console.log('Show pageAction icon in tab: ' + sender.tab.id);
            chrome.pageAction.show(sender.tab.id); // shows icon
        }
    }
);

chrome.alarms.onAlarm.addListener(
    function () {
        if (alarm.name === 'CarCheckupAlarm') {
            chrome.notifications.create('CarCheckupNotification', {
                type: 'basic',
                iconUrl: 'images/globe-256.png',
                title: chrome.i18n.getMessage('notificationTitle'),
                message: chrome.i18n.getMessage('notificationMessage'),
                eventTime: Date.now()
            });
        }
    }
);