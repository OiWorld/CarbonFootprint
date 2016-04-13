/**
 * Created by Kolpa on 23.03.2016.
 */
$(document).ready(function () {
    new StorageManager('storeValues', function (restoreManager) {

        function restoreOptions() {
            $('#fuel-type').val(restoreManager.get('fuelType'));
            $($('.emission-input-type')[restoreManager.get('savedTab')]).click();

            switch(restoreManager.get('savedTab')) {
                case 0 :  $('#consumption').val(localStorage.getObj('fuelConsumption')['value']);
                    $('#consumption-unit1').val(localStorage.getObj('fuelConsumption')['unit1']);
                    $('#consumption-unit2').val(localStorage.getObj('fuelConsumption')['unit2']);
                    break;

                case 1 :  $('#efficiency').val( 1 / localStorage.getObj('fuelConsumption')['value']);
                    $('#efficiency-unit1').val(localStorage.getObj('fuelConsumption')['unit2']);
                    $('#efficiency-unit2').val(localStorage.getObj('fuelConsumption')['unit1']);
                    break;

                case 2 :  $('#emission').val(localStorage.getObj('emissionRate')['value']);
                    $('#emission-unit1').val(localStorage.getObj('emissionRate')['unit1']);
                    $('#emission-unit2').val(localStorage.getObj('emissionRate')['unit2']);
                    break;
            }
        }

        if (restoreManager.has('savedTab'))
            restoreOptions();

        $('#save-button').click(function () {
            var currentTab = $('.emission-input.open').index();

            restoreManager.set('savedTab', currentTab);
            restoreManager.set('fuelType', parseInt($('#fuel-type').value()));

            switch (currentTab) {
                case 0:
                    restoreManager.set('fuelConsumption', {
                        value: parseFloat($('#consumption').val()),
                        unit1: $('#consumption-unit1').val(),
                        unit2: $('#consumption-unit2').val()
                    });
                    break;
                case 1:
                    restoreManager.set('fuelConsumtion', {
                        value: 1 / $('#efficiency').val(),
                        unit1: $('#efficiency-unit2').val(),
                        unit2: $('#efficiency-unit1').val()
                    });
                    break;
            }
        });
    });
});