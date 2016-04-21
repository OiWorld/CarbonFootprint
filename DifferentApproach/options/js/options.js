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

new StorageManager('calculationObject', function (calcObject) {
    new Vue({
        el: '#tester',
        data: {
            translated: translateProxy,
            selected: 'consumption',
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
            showTravelCost: false
        },
        ready: function() {
            if (calcObject.has('selectedFuelType'))
                this.selectedFuelType = calcObject.get('selectedFuelType');

            if (calcObject.has('fuelCost'))
                this.fuelCost = calcObject.get('fuelCost');

            if (calcObject.has('fuelCostUnit'))
                this.fuelCostUnit = calcObject.get('fuelCostUnit');

            if (calcObject.has('selected'))
                this.selected = calcObject.get('selected');

            if (calcObject.has('showTravelCost'))
                this.showTravelCost = calcObject.get('showTravelCost');

            if (calcObject.has('oldValue') && calcObject.has('unit1') && calcObject.has('unit2') && calcObject.has('selected'))
                this.$broadcast(this.selected + 'LoadValues', calcObject.get('oldValue'), calcObject.get('unit1'), calcObject.get('unit2'));
        },
        methods: {
            save: function () {
                calcObject.set('selectedFuelType', this.selectedFuelType);
                calcObject.set('fuelCost', this.fuelCost);
                calcObject.set('fuelCostUnit', this.fuelCostUnit);
                calcObject.set('selected', this.selected);
                calcObject.set('showTravelCost', this.showTravelCost);

                this.$broadcast(this.selected + 'Emission', this.fuelCost);
            }
        },
        events: {
            'emission': function(carbonEmission, oldValue, unit1, unit2, consumption) {
                calcObject.set('carbonEmission', carbonEmission);
                calcObject.set('oldValue', oldValue);
                calcObject.set('unit1', unit1);
                calcObject.set('unit2', unit2);

                var travelRate = this.fuelCost * Utils.Converter.convert(consumption, 'L', this.fuelCostUnit);

                calcObject.set('travelRate', Math.round(travelRate * 10000) / 10000);
                calcObject.update();
            }
        },
        watch: {
            'fuelCostUnit': function (nval, oldval) {
                this.fuelCost = Utils.Converter.convert(this.fuelCost, 'none', 'none', oldval, nval);
            }
        }
    });
});