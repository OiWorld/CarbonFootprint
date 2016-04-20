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

var vue = new Vue({
    el: '#tester',
    data: {
        translated: translateProxy,
        fuelTypes: [
            {
                name:'Diesel',
                CO2Emission: 2614
            },
            {
                name:'Gasoline',
                CO2Emission: 2328
            },
            {
                name:'LPG',
                CO2Emission: 1533
            },
            {
                name:'E10',
                CO2Emission: 2245  // (0.10 * 1503) + (0.90 * 2328) = 2245.5
            },
            {
                name:'E25',
                CO2Emission: 2121  // (0.25 * 1503) + (0.75 * 2328) = 2121.75
            },
            {
                name:'E85',
                CO2Emission: 1626  //  (0.85 * 1503) + (0.15 * 2328) = 1626.75
            },
            {
                name:'Ethanol',
                CO2Emission: 1503
            },
            {
                name:'BioDiesel',
                CO2Emission: 2486
            }
        ],
        selectedFuelType: 'Diesel',
        fuelCost: 0,
        fuelCostUnit: 'L',
        selected: 'consumption'
    },
    watch: {
        'fuelCostUnit': function (nval, oldval) {
            this.fuelCost = Utils.Converter.convert(this.fuelCost, 'none', 'none', oldval, nval);
        }
    }
});