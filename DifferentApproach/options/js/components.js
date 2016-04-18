//noinspection JSAnnotator
/**
 * Created by Kolpa on 18.04.2016.
 */

//noinspection JSAnnotator
Vue.component('consumption', {
    props: ['translated'],
    template: `<div class="emission-input">
                        <div class="form-group">
                            <label for="consumption">{{{translated.fuelConsumption}}}</label>
                            <input type="number" size="5" style="text-align:center" id="consumption" value="0"/>
                        </div>
                        <div class="form-group">
                            <div class="form-head">{{{translated.fuelConsumptionUnit}}}</div>
                            <div class="unit">
                                <label for="consumption-unit1">{{{translated.volume}}}</label>
                                <select class="selectMUnit" style="text-align:center" id="consumption-unit1">
                                    <option value="L" selected>L</option>
                                    <option value="gal">gal</option>
                                </select>
                            </div>
                            <div class="unitper">/</div>
                            <div class="unit">
                                <label for="consumption-unit2">{{{translated.perDistance}}}</label>
                                <select class="selectDUnit" style="text-align:center" id="consumption-unit2">
                                    <option value="km" selected>km</option>
                                    <option value="mi">mi</option>
                                </select>
                            </div>
                            <span class="note">{{{translated.conversionNote}}}</span>
                        </div>
                    </div>`
});

//noinspection JSAnnotator
Vue.component('efficiency', {
    props: ['translated'],
    template: `<div class="emission-input">
                        <div class="form-group">
                            <label for="efficiency">{{{translated.fuelEfficiency}}}</label>
                            <input type="number" size="5" style="text-align:center" id="efficiency" value="0"/>
                        </div>
                        <div class="form-group">
                            <div class="form-head">{{{translated.fuelEfficiencyUnit}}}</div>
                            <div class="unit">
                                <label for="efficiency-unit1">{{{translated.distance}}}</label>
                                <select class="selectMUnit" style="text-align:center" id="efficiency-unit1">
                                    <option value="km" selected>km</option>
                                    <option value="mi">mi</option>
                                </select>
                            </div>
                            <div class="unitper">/</div>
                            <div class="unit">
                                <label for="efficiency-unit2">{{{translated.perVolume}}}</label>
                                <select class="selectDUnit" style="text-align:center" id="efficiency-unit2">
                                    <option value="L" selected>L</option>
                                    <option value="gal">gal</option>
                                </select>
                            </div>
                            <span class="note">{{{translated.conversionNote}}}</span>
                        </div>
                    </div>`
});

//noinspection JSAnnotator
Vue.component('emission', {
    props: ['translated'],
    template: `<div class="emission-input">
                        <div class="form-group">
                            <label for="emission">{{{translated.coEmission}}}</label>
                            <input id="emission" type="number" size="5" value="0" style="text-align:center"/>
                        </div>
                        <div class="form-group">
                            <div class="form-head">{{{translated.coEmissionUnit}}}</div>
                            <div class="unit">
                                <label for="emission-unit1">{{{translated.mass}}}</label>
                                <select class="selectMUnit" style="text-align:center" id="emission-unit1">
                                    <option value="g" selected>g</option>
                                    <option value="kg">kg</option>
                                    <option value="lbs">lbs</option>
                                </select>
                            </div>
                            <div class="unitper">/</div>
                            <div class="unit">
                                <label for="emission-unit2">{{{translated.perDistance}}}</label>
                                <select class="selectDUnit" style="text-align:center" id="emission-unit2">
                                    <option value="km" selected>km</option>
                                    <option value="mi">mi</option>
                                </select>
                            </div>
                            <span class="note">{{{translated.conversionNote}}}</span>
                        </div>
                    </div>`
});