//noinspection JSAnnotator
/**
 * Created by Kolpa on 18.04.2016.
 */

Vue.component('consumption', {
    props: [
        'translated',
        'selectedFuelType',
        'fuelTypes'
    ],
    data: function () {
        return {
            fuelValue: 0,
            fuelUnit1: 'L',
            fuelUnit2: 'km'
        }
    },
    template:
        `<div class="emission-input">
            <div class="form-group">
                <label for="consumption">{{{translated.fuelConsumption}}}</label>
                <input v-model="fuelValue" type="number" size="5" style="text-align:center" id="consumption"/>
            </div>
            <div class="form-group">
                <div class="form-head">{{{translated.fuelConsumptionUnit}}}</div>
                <div class="unit">
                    <label for="consumption-unit1">{{{translated.volume}}}</label>
                    <select v-model="fuelUnit1" class="selectMUnit" style="text-align:center" id="consumption-unit1">
                        <option value="L">L</option>
                       <option value="gal">gal</option>
                    </select>
                </div>
                <div class="unitper">/</div>
                <div class="unit">
                    <label for="consumption-unit2">{{{translated.perDistance}}}</label>
                    <select v-model="fuelUnit2" class="selectDUnit" style="text-align:center" id="consumption-unit2">
                        <option value="km">km</option>
                        <option value="mi">mi</option>
                    </select>
                </div>
                <span class="note">{{{translated.conversionNote}}}</span>
            </div>
        </div>`
    ,
    computed: {
        usedFuelType: function () {
            for (var i in this.fuelTypes) {
                if (this.selectedFuelType == this.fuelTypes[i].name)
                    return this.fuelTypes[i];
            }
            return null;
        },
        carbonEmission: function () {
            var emissionRate = Utils.Converter.convert(this.fuelValue, this.fuelUnit1, 'L', this.fuelUnit2, 'km');
            emissionRate = emissionRate * this.usedFuelType['CO2Emission'];
            emissionRate = Utils.Converter.convert(emissionRate, 'g', 'g', 'km', this.fuelUnit2);
            return Math.round(emissionRate * 10000) / 10000;
        }
    },
    events: {
        'consumptionEmission': function() {
            this.$dispatch('emission', this.carbonEmission, this.fuelValue, this.fuelUnit1, this.fuelUnit2, this.fuelValue);
        },
        'consumptionLoadValues': function(fuelValue, unit1, unit2) {
            this.fuelValue = fuelValue;
            this.fuelUnit1 = unit1;
            this.fuelUnit2 = unit2;
        }
    },
    watch: {
        'fuelUnit1' : function (nval, oldval) {
            this.fuelValue = Utils.Converter.convert(this.fuelValue, oldval, nval, 'none', 'none');
        },
        'fuelUnit2' : function (nval, oldval) {
            this.fuelValue = Utils.Converter.convert(this.fuelValue, 'none', 'none', oldval, nval);
        }
    }
});

//noinspection JSAnnotator
Vue.component('efficiency', {
    props: [
        'translated',
        'selectedFuelType',
        'fuelTypes'
    ],
    data: function () {
        return {
            efficiencyValue: 0,
            efficiencyUnit1: 'km',
            efficiencyUnit2: 'L'
        }
    },
    template:
        `<div class="emission-input">
            <div class="form-group">
                <label for="efficiency">{{{translated.fuelEfficiency}}}</label>
                <input v-model="efficiencyValue" type="number" size="5" style="text-align:center" id="efficiency"/>
            </div>
            <div class="form-group">
                <div class="form-head">{{{translated.fuelEfficiencyUnit}}}</div>
                <div class="unit">
                    <label for="efficiency-unit1">{{{translated.distance}}}</label>
                    <select v-model="efficiencyUnit1" class="selectMUnit" style="text-align:center" id="efficiency-unit1">
                        <option value="km">km</option>
                        <option value="mi">mi</option>
                    </select>
                </div>
                <div class="unitper">/</div>
                <div class="unit">
                    <label for="efficiency-unit2">{{{translated.perVolume}}}</label>
                    <select v-model="efficiencyUnit2" class="selectDUnit" style="text-align:center" id="efficiency-unit2">
                        <option value="L">L</option>
                        <option value="gal">gal</option>
                    </select>
                </div>
                <span class="note">{{{translated.conversionNote}}}</span>
            </div>
        </div>`
    ,
    computed: {
        usedFuelType: function () {
            for (var i in this.fuelTypes) {
                if (this.selectedFuelType == this.fuelTypes[i].name)
                    return this.fuelTypes[i];
            }
            return null;
        },
        consumption: function () {
            return 1 / this.efficiencyValue;
        },
        carbonEmission: function () {
            var emissionRate = Utils.Converter.convert(this.consumption, this.efficiencyUnit1, 'L', this.efficiencyUnit2, 'km');
            emissionRate = emissionRate * this.usedFuelType['CO2Emission'];
            emissionRate = Utils.Converter.convert(emissionRate, 'g', 'g', 'km', this.efficiencyUnit2);
            return Math.round(emissionRate * 10000) / 10000;
        }
    },
    events: {
        'efficiencyEmission': function() {
            this.$dispatch('emission', this.carbonEmission, this.efficiencyValue, this.efficiencyUnit1, this.efficiencyUnit2, this.consumption);
        },
        'efficiencyLoadValues': function(efficiencyValue, unit1, unit2) {
            this.efficiencyValue = efficiencyValue;
            this.efficiencyUnit1 = unit1;
            this.efficiencyUnit2 = unit2;
        }
    },
    watch: {
        'efficiencyUnit1' : function (nval, oldval) {
            this.efficiencyValue = Utils.Converter.convert(this.efficiencyValue, oldval, nval, 'none', 'none');
        },
        'efficiencyUnit2' : function (nval, oldval) {
            this.efficiencyValue = Utils.Converter.convert(this.efficiencyValue, 'none', 'none', oldval, nval);
        }
    }
});

Vue.component('emission', {
    props: [
        'translated',
        'selectedFuelType',
        'fuelTypes'
    ],
    data: function () {
        return {
            emissionValue: 0,
            emissionUnit1: 'g',
            emissionUnit2: 'km'
        }
    },
    template:
        `<div class="emission-input">
            <div class="form-group">
                <label for="emission">{{{translated.coEmission}}}</label>
                <input v-model="emissionValue" id="emission" type="number" size="5" style="text-align:center"/>
            </div>
            <div class="form-group">
                <div class="form-head">{{{translated.coEmissionUnit}}}</div>
                <div class="unit">
                    <label for="emission-unit1">{{{translated.mass}}}</label>
                    <select v-model="emissionUnit1" class="selectMUnit" style="text-align:center" id="emission-unit1">
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                    </select>
                </div>
                <div class="unitper">/</div>
                <div class="unit">
                    <label for="emission-unit2">{{{translated.perDistance}}}</label>
                        <select v-model="emissionUnit2" class="selectDUnit" style="text-align:center" id="emission-unit2">
                            <option value="km">km</option>
                            <option value="mi">mi</option>
                        </select>
                </div>
                <span class="note">{{{translated.conversionNote}}}</span>
            </div>
        </div>`
    ,
    computed: {
        usedFuelType: function () {
            for (var i in this.fuelTypes) {
                if (this.selectedFuelType == this.fuelTypes[i].name)
                    return this.fuelTypes[i];
            }
            return null;
        },
        consumption: function () {
            var emission = Utils.Converter.convert(this.emissionValue, this.emissionUnit1, 'g');
            return emission / this.usedFuelType['CO2Emission'];
        },
        carbonEmission: function () {
            var emissionRate = Utils.Converter.convert(this.consumption, 'L', 'L', this.emissionUnit2, 'km');
            emissionRate = emissionRate * this.usedFuelType['CO2Emission'];
            emissionRate = Utils.Converter.convert(emissionRate, 'g', this.emissionUnit1, 'km', this.emissionUnit2);
            return Math.round(emissionRate * 10000) / 10000;
        }
    },
    events: {
        'emissionEmission': function() {
            this.$dispatch('emission', this.carbonEmission, this.emissionValue, this.emissionUnit1, this.emissionUnit2, this.consumption);
        },
        'emissionLoadValues': function(emissionValue, unit1, unit2) {
            this.emissionValue = emissionValue;
            this.emissionUnit1 = unit1;
            this.emissionUnit2 = unit2;
        }
    },
    watch: {
        'emissionUnit1' : function (nval, oldval) {
            this.emissionValue = Utils.Converter.convert(this.emissionValue, oldval, nval, 'none', 'none');
        },
        'emissionUnit2' : function (nval, oldval) {
            this.emissionValue = Utils.Converter.convert(this.emissionValue, 'none', 'none', oldval, nval);
        }
    }
});