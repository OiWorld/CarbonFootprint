var translateProxy = new Proxy({}, {
    get: function(obj, key) {
        if (typeof key != "string")
            return obj[key];

        var value = chrome.i18n.getMessage(key);

        if (value == "")
            return obj[key];

        return value;
    }
});

new Vue({
    el: '#tester',
    data: {
        translated: translateProxy,
        fuelTypes: [
            {
                name:'Diesel',
                value: 0
            },
            {
                name:'Gasoline',
                value: 1
            },
            {
                name:'LPG',
                value: 2
            },
            {
                name:'E10',
                value: 3
            },
            {
                name:'E25',
                value: 4
            },
            {
                name:'E85',
                value: 5
            },
            {
                name:'Ethanol',
                value: 6
            },
            {
                name:'Bio-Diesel',
                value: 7
            }
        ]
    }
});