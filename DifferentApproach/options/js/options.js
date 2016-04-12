/**
 * Created by Kolpa on 23.03.2016.
 */
$(document).ready(function () {
    new RestoreManager(function (restoreManager) {
        $('#save-button').click(function () {
            restoreManager.set('savedTab', $('.emission-input.open').index());
            restoreManager.set('fuelType', parseInt($('#fuel-type').value()));
            restoreManager.set('')
        });
    });
});